import {configureStore,combineReducers} from "@reduxjs/toolkit";

import userReducer from "../features/user/userSlice";
import themeReducer from "../features/theme/themeSlice";

import {persistReducer, persistStore} from "redux-persist";
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: ["loading", "error"],
  }

  const persisteReducer = persistReducer(persistConfig,rootReducer);

export const store = configureStore({
    reducer: persisteReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false
        }),
});

export const persistor = persistStore(store)
