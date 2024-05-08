import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import authSlice from './Slice'
import { combineReducers, configureStore } from "@reduxjs/toolkit";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { store, persistor };
