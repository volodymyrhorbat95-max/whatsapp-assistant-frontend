import { configureStore } from '@reduxjs/toolkit';
import loadingReducer from './slices/loadingSlice';
import conversationReducer from './slices/conversationSlice';
import clientReducer from './slices/clientSlice';
import reportsReducer from './slices/reportsSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    conversations: conversationReducer,
    client: clientReducer,
    reports: reportsReducer,
    orders: orderReducer
  }
});

// Types for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
