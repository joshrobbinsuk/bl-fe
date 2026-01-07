import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

export type FixtureResult = "HOME" | "AWAY" | "DRAW";
export type BetOutcome = "UNDECIDED" | "WON" | "LOST" | "VOIDED";
export type UserStatus = "ACTIVE" | "DISABLED" | "INVITED";

export interface User {
  id: string;
  status: UserStatus;
  cognito_uuid: string;
  email: string;
  balance: string; // Decimal as string
  created_at: string;
  updated_at: string;
}

export interface League {
  id: string;
  rapid_api_id: number;
  name: string;
  display_name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Fixture {
  id: string;
  status: string;
  rapid_api_id: number;
  kick_off: string; // ISO datetime
  venue: string;
  home_team: string;
  home_team_logo: string;
  away_team: string;
  away_team_logo: string;
  home_odds: string | null; // Decimal as string
  away_odds: string | null;
  draw_odds: string | null;
  home_goals: number | null;
  away_goals: number | null;
  created_at: string;
  updated_at: string;
}

export interface Bet {
  id: string;
  fixture_id: string;
  user_id: string;
  choice: FixtureResult;
  stake: string; // Decimal as string
  returns: string; // Decimal as string
  outcome: BetOutcome;
  created_at: string;
  updated_at: string;
  fixture?: Fixture;
}

export interface CreateBetRequest {
  fixture_id: string;
  choice: FixtureResult;
  stake: number;
}

export interface FixturesResponse {
  fixtures: Fixture[];
}

export interface BetsResponse {
  bets: Bet[];
}

export interface CreateBetResponse {
  bet: Bet;
  message: string;
}

export interface UserBalanceResponse {
  balance: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch (error) {
      console.error("[v0] Failed to get auth token:", error);
    }

    return headers;
  },
});

const mockBaseQuery: typeof baseQuery = async (args, api, extraOptions) => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const endpoint = typeof args === "string" ? args : args.url;

  if (endpoint?.includes("/client/fixture")) {
    return { data: { fixtures: mockFixtures } };
  }

  if (
    endpoint?.includes("/client/bet") &&
    typeof args !== "string" &&
    args.method === "POST"
  ) {
    const body = args.body as CreateBetRequest;
    const fixture = mockFixtures.find((f) => f.id === body.fixture_id);

    if (!fixture) {
      return { error: { status: 404, data: { message: "Fixture not found" } } };
    }

    const odds =
      body.choice === "HOME"
        ? fixture.home_odds
        : body.choice === "AWAY"
        ? fixture.away_odds
        : fixture.draw_odds;

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
    };

    mockBets.unshift(newBet);

    return {
      data: {
        bet: newBet,
        message: "Bet placed successfully",
      },
    };
  }

  if (endpoint?.includes("/client/bet")) {
    return { data: { bets: mockBets } };
  }

  return { error: { status: 404, data: { message: "Not found" } } };
};

export const bettingApi = createApi({
  reducerPath: "bettingApi",
  baseQuery: baseQuery,
  tagTypes: ["Fixtures", "Bets"],
  endpoints: (builder) => ({
    getFixtures: builder.query<
      FixturesResponse,
      { league?: string; date?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.league) searchParams.append("league", params.league);
        if (params.date) searchParams.append("date", params.date);

        return `/client/fixture${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      providesTags: ["Fixtures"],
    }),

    getUserBets: builder.query<
      BetsResponse,
      { status?: string; limit?: number }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.status) searchParams.append("status", params.status);
        if (params.limit) searchParams.append("limit", params.limit.toString());

        return `/client/bet${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
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
});

export const {
  useGetFixturesQuery,
  useGetUserBetsQuery,
  useCreateBetMutation,
} = bettingApi;
