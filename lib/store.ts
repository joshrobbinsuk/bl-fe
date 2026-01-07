import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { bettingApi } from "./services/betting-api"

export const store = configureStore({
  reducer: {
    [bettingApi.reducerPath]: bettingApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(bettingApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
