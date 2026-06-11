import { NextResponse } from 'next/server'
import { fallbackGitHub } from '@/lib/constants'

interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  html_url: string
  fork: boolean
  topics: string[]
  updated_at: string
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

export async function GET() {
  try {
    const headers: HeadersInit = {
      Accept: 'application/vnd.github.v3+json',
    }

    // Use GitHub token if available for higher rate limits
    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
    }

    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/72897', {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch('https://api.github.com/users/72897/repos?sort=stars&per_page=10', {
        headers,
        next: { revalidate: 3600 },
      }),
    ])

    if (!userRes.ok || !reposRes.ok) {
      console.error('GitHub API error:', userRes.status, reposRes.status)
      return NextResponse.json(fallbackGitHub)
    }

    const user: GitHubUser = await userRes.json()
    const repos: GitHubRepo[] = await reposRes.json()

    // Calculate language stats from repos
    const languageCounts: Record<string, number> = {}
    const nonForkRepos = repos.filter((repo) => !repo.fork)

    for (const repo of nonForkRepos) {
      if (repo.language) {
        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
      }
    }

    // Convert to percentages
    const totalWithLanguage = Object.values(languageCounts).reduce((a, b) => a + b, 0)
    const languages: Record<string, number> = {}
    for (const [lang, count] of Object.entries(languageCounts)) {
      languages[lang] = Math.round((count / totalWithLanguage) * 100)
    }

    // Map top repos
    const topRepos = nonForkRepos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 6)
      .map((repo) => ({
        name: repo.name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        url: repo.html_url,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
      }))

    return NextResponse.json({
      username: user.login,
      name: user.name || 'Kunal Singh',
      bio: user.bio || 'AI Engineer | Full Stack Developer',
      avatarUrl: user.avatar_url,
      profileUrl: user.html_url,
      publicRepos: user.public_repos,
      followers: user.followers,
      following: user.following,
      topRepos,
      languages,
    })
  } catch (error) {
    console.error('GitHub route error:', error)
    return NextResponse.json(fallbackGitHub)
  }
}
