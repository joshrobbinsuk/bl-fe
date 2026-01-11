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
  home_odds: string | null;
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
  home_team: string;
  away_team: string;
  choice: FixtureResult;
  stake: string;
  returns: string;
  outcome: BetOutcome;
  kick_off: string;
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

export const bettingApi = createApi({
  reducerPath: "bettingApi",
  baseQuery: baseQuery,
  tagTypes: ["Fixtures", "Bets", "User"],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/client/me",
      providesTags: ["User"],
    }),
    getFixtures: builder.query<FixturesResponse, { search?: string }>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append("search", params.search);

        return `/client/fixture${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      providesTags: ["Fixtures"],
    }),

    getUserBets: builder.query<
      BetsResponse,
      { outcome?: string; search?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.outcome) searchParams.append("outcome", params.outcome);
        if (params.search) searchParams.append("search", params.search);

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
      invalidatesTags: ["Bets", "User"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetFixturesQuery,
  useGetUserBetsQuery,
  useCreateBetMutation,
} = bettingApi;
