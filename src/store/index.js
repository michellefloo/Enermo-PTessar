import { configureStore, combineReducers } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import thunk from 'redux-thunk';
import { PERSIST_KEY_NAME } from '../utils/constant'

import coreUiState from './coreui-state'
import modalState from './modal-state';
import exportToCsvFromCoreUiDatatable from './export-to-csv/core-ui-datatable';
import authSlice from './auth-slice';

const persistConfig = {
  key: PERSIST_KEY_NAME,
  storage,
  whitelist: ['auth'],
  stateReconciler: autoMergeLevel2
}

const rootReducer = combineReducers({
  modalState, 
  coreUiState,
  exportToCsvFromCoreUiDatatable,
  auth: authSlice.reducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk]
})
export const persistor = persistStore(store);