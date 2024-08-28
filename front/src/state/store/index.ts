import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userInfoSlice from "@/state/store/userInfoSlice";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import reviewDetailOpenSlice from "@/state/store/reviewDetailOpenSlice";

// persist 설정
const persistConfig = {
  key: "root",
  storage, // 브라우저 로컬스토리지 사용
};

const persistedReducer = persistReducer(persistConfig, userInfoSlice);

const store = configureStore({
  reducer: {
    userInfo: persistedReducer,
    reviewDetailOpen: reviewDetailOpenSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
