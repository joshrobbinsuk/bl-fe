import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "aws-amplify/auth";

export type FixtureResult = "HOME" | "AWAY" | "DRAW";
export type BetOutcome = "UNDECIDED" | "WON" | "LOST" | "VOIDED";
export type UserStatus = "ACTIVE" | "DISABLED" | "INVITED";

export type CupStatus = "OPEN" | "CLOSING" | "SETTLED";

export interface User {
  id: string;
  status: UserStatus;
  cognito_uuid: string;
  email: string;
  balance: string; // weekly cup pot, Decimal as string
  cups_won: number;
  created_at: string;
  updated_at: string;
}

export interface League {
  id: string;
  display_name: string;
  logo: string;
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
  league: League | null;
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

export interface Cup {
  id: string;
  week_start: string; // ISO datetime
  week_end: string; // ISO datetime
  status: CupStatus;
}

export interface CupLeaderboardRow {
  rank: number;
  user_id: string;
  email: string;
  balance: string; // Decimal as string
  is_winner: boolean;
}

export interface CupCurrentResponse {
  cup: Cup | null;
  your_balance: string | null; // Decimal as string
  your_rank: number | null;
  leaderboard: CupLeaderboardRow[];
}

export interface CupResponse {
  cup: Cup;
  leaderboard: CupLeaderboardRow[];
}

export interface CupsResponse {
  cups: Cup[];
}

export interface FixturesResponse {
  fixtures: Fixture[];
}

export interface LeaguesResponse {
  leagues: League[];
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
  tagTypes: ["Fixtures", "Bets", "User", "Leagues", "Cup"],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => "/client/me",
      providesTags: ["User"],
    }),
    getFixtures: builder.query<
      FixturesResponse,
      { search?: string; league_id?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append("search", params.search);
        if (params.league_id)
          searchParams.append("league_id", params.league_id);

        return `/client/fixture${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      providesTags: ["Fixtures"],
    }),

    getLeagues: builder.query<LeaguesResponse, void>({
      query: () => "/client/league",
      providesTags: ["Leagues"],
    }),

    getUserBets: builder.query<
      BetsResponse,
      { outcome?: string; search?: string; cup_id?: string }
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.outcome) searchParams.append("outcome", params.outcome);
        if (params.search) searchParams.append("search", params.search);
        if (params.cup_id) searchParams.append("cup_id", params.cup_id);

        return `/client/bet${
          searchParams.toString() ? `?${searchParams.toString()}` : ""
        }`;
      },
      providesTags: ["Bets"],
    }),

    getCupCurrent: builder.query<CupCurrentResponse, void>({
      query: () => "/client/cup/current",
      providesTags: ["Cup"],
    }),

    getCup: builder.query<CupResponse, string>({
      query: (id) => `/client/cup/${id}`,
      providesTags: ["Cup"],
    }),

    getCups: builder.query<CupsResponse, void>({
      query: () => "/client/cups",
      providesTags: ["Cup"],
    }),

    createBet: builder.mutation<CreateBetResponse, CreateBetRequest>({
      query: (bet) => ({
        url: "/client/bet",
        method: "POST",
        body: bet,
      }),
      invalidatesTags: ["Bets", "User", "Cup"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useGetFixturesQuery,
  useGetLeaguesQuery,
  useGetUserBetsQuery,
  useGetCupCurrentQuery,
  useGetCupQuery,
  useGetCupsQuery,
  useCreateBetMutation,
} = bettingApi;
