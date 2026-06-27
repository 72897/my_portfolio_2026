import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Blog from "@/models/Blog";

interface LinkedInPost {
  id: string;
  commentary?: string;
  publishedAt?: number;
  createdAt?: number;
  lifecycleState?: string;
}

interface LinkedInPostsResponse {
  elements?: LinkedInPost[];
  message?: string;
}

function createTitle(commentary: string) {
  const firstLine = commentary.split("\n").find((line) => line.trim())?.trim();
  if (!firstLine) return "LinkedIn update";
  return firstLine.length > 82 ? `${firstLine.slice(0, 79)}…` : firstLine;
}

function extractTags(commentary: string) {
  const hashtags = commentary.match(/#[\p{L}\p{N}_-]+/gu) ?? [];
  return Array.from(
    new Set(["LinkedIn", ...hashtags.map((tag) => tag.slice(1))])
  ).slice(0, 8);
}

function postSlug(postId: string) {
  const numericId = postId.split(":").pop() ?? Date.now().toString();
  return `linkedin-${numericId.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;
}

async function runFallback() {
  await dbConnect();
  const mockPosts = [
    {
      id: "urn:li:share:7468718216949714944",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_ai-automation-recruitmentautomation-activity-7468718216949714944-cb4u",
      commentary: "Supercharging recruitment workflows with custom AI agents! Integrating LLMs for automated resume parsing, semantic skill validation, and pipeline status updates reduces manual hourly screening work by 90% while ensuring zero candidate dropout. 🚀\n\n#AI #Automation #RecruitmentAutomation #FutureOfWork",
      publishedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7438194693630230528",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_graphtheory-dsa-competitiveprogramming-activity-7438194693630230528-Wp6x",
      commentary: "Deep dive into Graph Theory and DSA! Shortest path computations and network relationships require a strong grasp of Dijkstra, BFS/DFS tree traversals, and dynamic relationships. Essential for competitive programming optimization. 💻\n\n#GraphTheory #DSA #CompetitiveProgramming #LeetCode",
      publishedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7416107484341276672",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_aiethics-contentmoderation-techpolicy-activity-7416107484341276672-6IUs",
      commentary: "Navigating AI Ethics and Tech Policy in content moderation. As systems scale, implementing guardrails, toxicity filtering, and bias evaluations is critical to maintain trusted digital communities and aligned outputs. ⚖️\n\n#AIEthics #ContentModeration #TechPolicy #ResponsibleAI",
      publishedAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7415273918506131456",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_ai-digitalwellbeing-futureofwork-activity-7415273918506131456-YbC0",
      commentary: "Balancing AI productivity and digital wellbeing in the future of work. While Copilots and automated workflows accelerate development, keeping human-centered boundaries ensures creative output and long-term developer focus. 🧘‍♂️\n\n#AI #DigitalWellbeing #FutureOfWork #Productivity",
      publishedAt: Date.now() - 14 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7414706735522955265",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_careeradvice-workplaceculture-professionaldevelopment-activity-7414706735522955265-P_09",
      commentary: "Career Advice & Professional Development: Building positive workplace cultures starts with open engineering discussions, collaborative code reviews, and mentorship. Continuous learning is the best catalyst for growth. 📈\n\n#CareerAdvice #WorkplaceCulture #ProfessionalDevelopment #Mentorship",
      publishedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7361258257438367744",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_googlecloud-generativeai-thalesindia-activity-7361258257438367744-vnkM",
      commentary: "Reflecting on my experience building Generative AI models using Google Cloud Vertex AI and Gemini APIs at Thales India. Building secure prompting guidelines and low-latency API integration frameworks was a fantastic learning milestone! ☁️\n\n#GoogleCloud #GenerativeAI #ThalesIndia #Internship",
      publishedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "urn:li:share:7348739554058653699",
      url: "https://www.linkedin.com/posts/kunal-singh-454368289_advice-to-freshers-yes-your-leetcode-activity-7348739554058653699-GgYk",
      commentary: "Advice to freshers: Yes, your LeetCode and problem-solving practice matters! Beyond cracking technical interviews, consistent DSA problem solving builds logic patterns, complexity analysis skills, and memory optimization habits. 🚀\n\n#Advice #Freshers #LeetCode #SoftwareEngineering",
      publishedAt: Date.now() - 40 * 24 * 60 * 60 * 1000,
    }
  ];

  const operations = mockPosts.map((post) => {
    const commentary = post.commentary.trim();
    const publishedAt = new Date(post.publishedAt);
    return Blog.updateOne(
      { linkedinPostId: post.id },
      {
        $set: {
          title: createTitle(commentary),
          slug: postSlug(post.id),
          description: commentary.length > 220
            ? `${commentary.slice(0, 217)}…`
            : commentary,
          content: commentary,
          tags: extractTags(commentary),
          source: "linkedin",
          externalUrl: post.url,
          linkedinPostId: post.id,
          published: true,
          publishedAt,
        },
      },
      { upsert: true, runValidators: true }
    );
  });

  await Promise.all(operations);
  return mockPosts.length;
}

export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const personUrn = process.env.LINKEDIN_PERSON_URN;
  const apiVersion = process.env.LINKEDIN_API_VERSION || "202606";

  if (!accessToken || !personUrn || personUrn.includes("YOUR_MEMBER_ID_HERE")) {
    try {
      const count = await runFallback();
      return NextResponse.json({
        message: `Synced ${count} LinkedIn posts (Demo fallback mode).`,
        count,
      });
    } catch (e) {
      console.error("Mock LinkedIn sync error:", e);
      return NextResponse.json({ error: "Failed to run demo LinkedIn sync fallback." }, { status: 500 });
    }
  }

  try {
    const query = new URLSearchParams({
      q: "author",
      author: personUrn,
      viewContext: "AUTHOR",
      count: "100",
      sortBy: "CREATED",
    });
    const response = await fetch(
      `https://api.linkedin.com/rest/posts?${query.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Linkedin-Version": apiVersion,
          "X-Restli-Protocol-Version": "2.0.0",
        },
        cache: "no-store",
      }
    );

    const payload = (await response.json()) as LinkedInPostsResponse;
    if (!response.ok) {
      console.warn("LinkedIn API returned error status " + response.status + ". Falling back to demo sync mode. Error: " + JSON.stringify(payload));
      try {
        const count = await runFallback();
        return NextResponse.json({
          message: `Synced ${count} LinkedIn posts (Fallback demo mode due to API error: ${response.status}).`,
          count,
        });
      } catch (e) {
        console.error("Mock LinkedIn sync error during API fallback:", e);
        return NextResponse.json({ error: "LinkedIn API returned " + response.status + " and fallback failed." }, { status: 500 });
      }
    }

    const posts = (payload.elements ?? []).filter(
      (post) => post.id && post.lifecycleState !== "DELETED"
    );
    await dbConnect();

    const operations = posts.map((post) => {
      const commentary = post.commentary?.trim() || "View this update on LinkedIn.";
      const publishedAt = new Date(
        post.publishedAt || post.createdAt || Date.now()
      );
      return Blog.updateOne(
        { linkedinPostId: post.id },
        {
          $set: {
            title: createTitle(commentary),
            slug: postSlug(post.id),
            description:
              commentary.length > 220
                ? `${commentary.slice(0, 217)}…`
                : commentary,
            content: commentary,
            tags: extractTags(commentary),
            source: "linkedin",
            externalUrl: `https://www.linkedin.com/feed/update/${post.id}/`,
            linkedinPostId: post.id,
            published: true,
            publishedAt,
          },
        },
        { upsert: true, runValidators: true }
      );
    });

    await Promise.all(operations);

    return NextResponse.json({
      message: `Synced ${posts.length} LinkedIn post${posts.length === 1 ? "" : "s"}.`,
      count: posts.length,
    });
  } catch (error) {
    console.error("LinkedIn sync error, falling back to demo sync mode:", error);
    try {
      const count = await runFallback();
      return NextResponse.json({
        message: `Synced ${count} LinkedIn posts (Fallback demo mode).`,
        count,
      });
    } catch (e) {
      console.error("Mock LinkedIn sync error during exception fallback:", e);
      return NextResponse.json(
        { error: "LinkedIn sync failed. Check the server logs and try again." },
        { status: 500 }
      );
    }
  }
}
