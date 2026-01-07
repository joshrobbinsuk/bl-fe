import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { fetchAuthSession } from "aws-amplify/auth"

export type FixtureResult = "HOME" | "AWAY" | "DRAW"
export type BetOutcome = "UNDECIDED" | "WON" | "LOST" | "VOIDED"
export type UserStatus = "ACTIVE" | "DISABLED" | "INVITED"

export interface User {
  id: string
  status: UserStatus
  cognito_uuid: string
  email: string
  balance: string // Decimal as string
  created_at: string
  updated_at: string
}

export interface League {
  id: string
  rapid_api_id: number
  name: string
  display_name: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface Fixture {
  id: string
  status: string
  rapid_api_id: number
  kick_off: string // ISO datetime
  venue: string
  home_team: string
  home_team_logo: string
  away_team: string
  away_team_logo: string
  home_odds: string | null // Decimal as string
  away_odds: string | null
  draw_odds: string | null
  home_goals: number | null
  away_goals: number | null
  created_at: string
  updated_at: string
}

export interface Bet {
  id: string
  fixture_id: string
  user_id: string
  choice: FixtureResult
  stake: string // Decimal as string
  returns: string // Decimal as string
  outcome: BetOutcome
  created_at: string
  updated_at: string
  fixture?: Fixture
}

export interface CreateBetRequest {
  fixture_id: string
  choice: FixtureResult
  stake: number
}

export interface FixturesResponse {
  fixtures: Fixture[]
}

export interface BetsResponse {
  bets: Bet[]
}

export interface CreateBetResponse {
  bet: Bet
  message: string
}

export interface UserBalanceResponse {
  balance: string
}

const USE_MOCK_DATA = !process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL.includes("localhost")

const mockFixtures: Fixture[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    status: "NS",
    rapid_api_id: 12345,
    kick_off: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    venue: "Old Trafford",
    home_team: "Manchester United",
    home_team_logo: "/placeholder.svg?height=48&width=48",
    away_team: "Liverpool",
    away_team_logo: "/placeholder.svg?height=48&width=48",
    home_odds: "2.10",
    away_odds: "3.50",
    draw_odds: "3.20",
    home_goals: null,
    away_goals: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    status: "NS",
    rapid_api_id: 12346,
    kick_off: new Date(Date.now() + 172800000).toISOString(), // 2 days
    venue: "Etihad Stadium",
    home_team: "Manchester City",
    home_team_logo: "/placeholder.svg?height=48&width=48",
    away_team: "Arsenal",
    away_team_logo: "/placeholder.svg?height=48&width=48",
    home_odds: "1.85",
    away_odds: "4.20",
    draw_odds: "3.60",
    home_goals: null,
    away_goals: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    status: "NS",
    rapid_api_id: 12347,
    kick_off: new Date(Date.now() + 259200000).toISOString(), // 3 days
    venue: "Stamford Bridge",
    home_team: "Chelsea",
    home_team_logo: "/placeholder.svg?height=48&width=48",
    away_team: "Tottenham",
    away_team_logo: "/placeholder.svg?height=48&width=48",
    home_odds: "2.40",
    away_odds: "2.90",
    draw_odds: "3.40",
    home_goals: null,
    away_goals: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const mockBets: Bet[] = [
  {
    id: "650e8400-e29b-41d4-a716-446655440001",
    fixture_id: "550e8400-e29b-41d4-a716-446655440001",
    user_id: "user-123",
    choice: "HOME",
    stake: "10.00",
    returns: "21.00",
    outcome: "UNDECIDED",
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    fixture: mockFixtures[0],
  },
  {
    id: "650e8400-e29b-41d4-a716-446655440002",
    fixture_id: "550e8400-e29b-41d4-a716-446655440002",
    user_id: "user-123",
    choice: "AWAY",
    stake: "5.00",
    returns: "21.00",
    outcome: "WON",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 7200000).toISOString(),
    fixture: {
      ...mockFixtures[1],
      status: "FT",
      home_goals: 1,
      away_goals: 2,
    },
  },
  {
    id: "650e8400-e29b-41d4-a716-446655440003",
    fixture_id: "550e8400-e29b-41d4-a716-446655440003",
    user_id: "user-123",
    choice: "DRAW",
    stake: "15.00",
    returns: "0.00",
    outcome: "LOST",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    fixture: {
      ...mockFixtures[2],
      status: "FT",
      home_goals: 3,
      away_goals: 1,
    },
  },
]

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  prepareHeaders: async (headers) => {
    try {
      const session = await fetchAuthSession()
      const token = session.tokens?.idToken?.toString()

      if (token) {
        headers.set("Authorization", `Bearer ${token}`)
      }
    } catch (error) {
      console.error("[v0] Failed to get auth token:", error)
    }

    return headers
  },
})

const mockBaseQuery: typeof baseQuery = async (args, api, extraOptions) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const endpoint = typeof args === "string" ? args : args.url

  console.log("[v0] Mock API call to endpoint:", endpoint)
  console.log("[v0] Args:", args)
  console.log("[v0] USE_MOCK_DATA:", USE_MOCK_DATA)

  if (endpoint?.includes("/client/fixture")) {
    console.log("[v0] Returning mock fixtures:", mockFixtures.length)
    return { data: { fixtures: mockFixtures } }
  }

  if (endpoint?.includes("/client/bet") && typeof args !== "string" && args.method === "POST") {
    const body = args.body as CreateBetRequest
    const fixture = mockFixtures.find((f) => f.id === body.fixture_id)

    if (!fixture) {
      return { error: { status: 404, data: { message: "Fixture not found" } } }
    }

    const odds =
      body.choice === "HOME" ? fixture.home_odds : body.choice === "AWAY" ? fixture.away_odds : fixture.draw_odds

    const newBet: Bet = {
      id: `bet-${Date.now()}`,
      fixture_id: body.fixture_id,
      user_id: "user-123",
      choice: body.choice,
      stake: body.stake.toFixed(2),
      returns: (body.stake * Number.parseFloat(odds || "1")).toFixed(2),
      outcome: "UNDECIDED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      fixture,
    }

    mockBets.unshift(newBet)

    return {
      data: {
        bet: newBet,
        message: "Bet placed successfully",
      },
    }
  }

  if (endpoint?.includes("/client/bet")) {
    console.log("[v0] Returning mock bets:", mockBets.length)
    return { data: { bets: mockBets } }
  }

  console.log("[v0] No mock handler found for endpoint")
  return { error: { status: 404, data: { message: "Not found" } } }
}

export const bettingApi = createApi({
  reducerPath: "bettingApi",
  baseQuery: USE_MOCK_DATA ? mockBaseQuery : baseQuery,
  tagTypes: ["Fixtures", "Bets"],
  endpoints: (builder) => ({
    getFixtures: builder.query<FixturesResponse, { league?: string; date?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.league) searchParams.append("league", params.league)
        if (params.date) searchParams.append("date", params.date)

        return `/client/fixture${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      },
      providesTags: ["Fixtures"],
    }),

    getUserBets: builder.query<BetsResponse, { status?: string; limit?: number }>({
      query: (params) => {
        const searchParams = new URLSearchParams()
        if (params.status) searchParams.append("status", params.status)
        if (params.limit) searchParams.append("limit", params.limit.toString())

        return `/client/bet${searchParams.toString() ? `?${searchParams.toString()}` : ""}`
      },
      providesTags: ["Bets"],
    }),

    createBet: builder.mutation<CreateBetResponse, CreateBetRequest>({
      query: (bet) => ({
        url: "/client/bet",
        method: "POST",
        body: bet,
      }),
      invalidatesTags: ["Bets"],
    }),
  }),
})

export const { useGetFixturesQuery, useGetUserBetsQuery, useCreateBetMutation } = bettingApi
