import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";
import { errorResponse, jsonError, requireSession } from "@/app/api/_lib/http";
import { readingTimeMinutes } from "@/app/api/_lib/blog";

interface LinkedInPost {
  id: string;
  commentary?: string;
  publishedAt?: number;
  createdAt?: number;
  lifecycleState?: string;
}

interface LinkedInPostsResponse {
  elements?: LinkedInPost[];
}

const DEFAULT_API_VERSION = "202606";
const TIMEOUT_MS = 15_000;
const MAX_POSTS = 100;

function createTitle(commentary: string) {
  const firstLine = commentary.split("\n").find((line) => line.trim())?.trim();
  if (!firstLine) return "LinkedIn update";
  return firstLine.length > 82 ? `${firstLine.slice(0, 79)}…` : firstLine;
}

function extractTags(commentary: string) {
  const hashtags = commentary.match(/#[\p{L}\p{N}_-]+/gu) ?? [];
  return Array.from(new Set(["LinkedIn", ...hashtags.map((tag) => tag.slice(1))])).slice(0, 8);
}

function postSlug(postId: string) {
  const numericId = postId.split(":").pop() || postId;
  return `linkedin-${numericId.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}

/**
 * Copies the admin's own LinkedIn posts into the blog collection. Nothing is
 * written unless LinkedIn returns real posts: there is no sample-data mode.
 */
export async function POST() {
  try {
    await requireSession();

    const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const personUrn = process.env.LINKEDIN_PERSON_URN;
    const apiVersion = process.env.LINKEDIN_API_VERSION || DEFAULT_API_VERSION;

    if (!accessToken || !personUrn || !/^urn:li:(person|organization):[\w-]+$/.test(personUrn)) {
      return jsonError(
        503,
        "LinkedIn sync is not configured. Set LINKEDIN_ACCESS_TOKEN and LINKEDIN_PERSON_URN on the server."
      );
    }

    const query = new URLSearchParams({
      q: "author",
      author: personUrn,
      viewContext: "AUTHOR",
      count: String(MAX_POSTS),
      sortBy: "CREATED",
    });

    let response: Response;
    try {
      response = await fetch(`https://api.linkedin.com/rest/posts?${query.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Linkedin-Version": apiVersion,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        cache: "no-store",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch (error) {
      const timedOut = error instanceof Error && error.name === "TimeoutError";
      console.error("LinkedIn sync: request failed:", error instanceof Error ? error.message : error);
      return jsonError(
        timedOut ? 504 : 502,
        timedOut ? "LinkedIn did not respond in time." : "Could not reach LinkedIn."
      );
    }

    if (!response.ok) {
      console.error("LinkedIn sync: API returned", response.status, (await response.text()).slice(0, 500));
      const hint =
        response.status === 401
          ? "The access token is invalid or expired."
          : response.status === 403
            ? "The token lacks permission to read posts (r_member_social)."
            : "Check the server logs.";
      return jsonError(502, `LinkedIn returned ${response.status}. ${hint}`);
    }

    let payload: LinkedInPostsResponse;
    try {
      payload = await response.json();
    } catch {
      return jsonError(502, "LinkedIn returned a response that could not be read.");
    }

    const posts = (payload.elements ?? []).filter(
      (post) => post.id && post.commentary?.trim() && post.lifecycleState !== "DELETED"
    );

    await dbConnect();
    if (posts.length > 0) {
      await Blog.bulkWrite(
        posts.map((post) => {
          const commentary = (post.commentary as string).trim();
          const postedAt = post.publishedAt || post.createdAt;
          return {
            updateOne: {
              filter: { linkedinPostId: post.id },
              update: {
                $set: {
                  title: createTitle(commentary),
                  slug: postSlug(post.id),
                  description: commentary.length > 220 ? `${commentary.slice(0, 217)}…` : commentary,
                  content: commentary,
                  tags: extractTags(commentary),
                  source: "linkedin" as const,
                  externalUrl: `https://www.linkedin.com/feed/update/${post.id}/`,
                  linkedinPostId: post.id,
                  readingTime: readingTimeMinutes(commentary),
                  ...(postedAt ? { publishedAt: new Date(postedAt) } : {}),
                },
                // New posts start published; a post the admin has unpublished stays that way.
                $setOnInsert: {
                  published: true,
                  ...(postedAt ? {} : { publishedAt: new Date() }),
                },
              },
              upsert: true,
            },
          };
        })
      );
    }

    return NextResponse.json({
      message: `Synced ${posts.length} LinkedIn post${posts.length === 1 ? "" : "s"}.`,
      count: posts.length,
    });
  } catch (error) {
    return errorResponse(error, "LinkedIn sync");
  }
}
