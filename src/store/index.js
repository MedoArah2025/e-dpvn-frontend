import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  // ajoute d'autres slices ici
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
