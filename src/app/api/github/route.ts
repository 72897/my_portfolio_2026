import { NextResponse } from 'next/server'
import { fallbackGitHub, siteConfig } from '@/lib/constants'

interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  fork: boolean
  topics?: string[]
  updated_at: string
  pushed_at: string | null
  created_at: string
}

interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
  avatar_url: string
  html_url: string
}

const TIMEOUT_MS = 8000
const REVALIDATE_SECONDS = 3600
const TOP_REPO_COUNT = 6

// `fallback: true` means GitHub could not be reached and the numbers are
// placeholders, not real statistics.
function fallbackResponse() {
  return NextResponse.json(
    { ...fallbackGitHub, fallback: true },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

const lastActivity = (repo: GitHubRepo) =>
  new Date(repo.pushed_at || repo.updated_at || repo.created_at).getTime()

export async function GET() {
  const username = encodeURIComponent(siteConfig.githubUsername)
  const headers: HeadersInit = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  }
  // Optional: raises the rate limit from 60 to 5000 requests per hour.
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const get = (url: string) =>
    fetch(url, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    })

  try {
    const [userRes, reposRes] = await Promise.all([
      get(`https://api.github.com/users/${username}`),
      get(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`),
    ])

    if (!userRes.ok || !reposRes.ok) {
      console.error('GitHub API error:', userRes.status, reposRes.status)
      return fallbackResponse()
    }

    const user: GitHubUser = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()
    if (!Array.isArray(repos)) return fallbackResponse()

    const ownRepos = repos.filter((repo) => !repo.fork)

    // Share of repositories by primary language, in whole percent.
    const languageCounts: Record<string, number> = {}
    for (const repo of ownRepos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    }
    const reposWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languages: Record<string, number> = {}
    for (const [language, count] of Object.entries(languageCounts)) {
      languages[language] = Math.round((count / reposWithLanguage) * 100)
    }

    const topRepos = [...ownRepos]
      .sort((a, b) => lastActivity(b) - lastActivity(a))
      .slice(0, TOP_REPO_COUNT)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        url: repo.html_url,
        topics: repo.topics || [],
        updatedAt: repo.pushed_at || repo.updated_at,
      }))

    return NextResponse.json(
      {
        username: user.login,
        name: user.name || siteConfig.name,
        bio: user.bio || '',
        avatarUrl: user.avatar_url,
        profileUrl: user.html_url,
        publicRepos: user.public_repos,
        followers: user.followers,
        following: user.following,
        topRepos,
        languages,
        fallback: false,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  } catch (error) {
    console.error('GitHub route error:', error instanceof Error ? error.message : error)
    return fallbackResponse()
  }
}
