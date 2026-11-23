import { NextResponse } from 'next/server'
import { fallbackLeetCode, siteConfig } from '@/lib/constants'

interface DifficultyCount {
  difficulty: string
  count: number
}

interface LeetCodeResponse {
  data?: {
    allQuestionsCount?: DifficultyCount[]
    matchedUser?: {
      submitStatsGlobal?: { acSubmissionNum?: DifficultyCount[] }
      profile?: { ranking?: number }
    } | null
  }
}

const TIMEOUT_MS = 8000
const REVALIDATE_SECONDS = 3600

const QUERY = `query userStats($username: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    submitStatsGlobal { acSubmissionNum { difficulty count } }
    profile { ranking }
  }
}`

// `fallback: true` means LeetCode could not be reached and the numbers are
// placeholders, not real statistics.
function fallbackResponse() {
  return NextResponse.json(
    { ...fallbackLeetCode, fallback: true },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}

const countFor = (counts: DifficultyCount[], difficulty: string) =>
  counts.find((entry) => entry.difficulty === difficulty)?.count ?? 0

export async function GET() {
  const username = siteConfig.leetcodeUsername

  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Referer: 'https://leetcode.com',
      },
      body: JSON.stringify({ query: QUERY, variables: { username } }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: REVALIDATE_SECONDS },
    })

    if (!res.ok) {
      console.error('LeetCode API error:', res.status)
      return fallbackResponse()
    }

    const payload: LeetCodeResponse = await res.json()
    const matchedUser = payload.data?.matchedUser
    if (!matchedUser) {
      console.error('LeetCode: no data for user', username)
      return fallbackResponse()
    }

    const solved = matchedUser.submitStatsGlobal?.acSubmissionNum ?? []
    const available = payload.data?.allQuestionsCount ?? []

    return NextResponse.json(
      {
        username,
        totalSolved: countFor(solved, 'All'),
        easySolved: countFor(solved, 'Easy'),
        mediumSolved: countFor(solved, 'Medium'),
        hardSolved: countFor(solved, 'Hard'),
        ranking: matchedUser.profile?.ranking ?? 0,
        totalQuestions: {
          easy: countFor(available, 'Easy'),
          medium: countFor(available, 'Medium'),
          hard: countFor(available, 'Hard'),
        },
        fallback: false,
      },
      {
        headers: {
          'Cache-Control': `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      }
    )
  } catch (error) {
    console.error('LeetCode route error:', error instanceof Error ? error.message : error)
    return fallbackResponse()
  }
}
