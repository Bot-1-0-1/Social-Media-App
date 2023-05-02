import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import authReducer from "./states/state.js";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// for redux persist : Used to store all the state in the local storage
// Same as session storage

import { 
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react';


// For storing the state in persist

const persistConfig = { key : "root", storage ,version : 1};
const persistedReducer = persistReducer(persistConfig, authReducer);                       // Reducer is persisted


// Configuring the store

const store = configureStore({
  reducer: persistedReducer,
  middleware : (getDefaultMiddleware) =>
    getDefaultMiddleware({                                                                  // We are making the changes in the default middleware with the redux-persist configurations
      serializableCheck : {
        ignoreActions : [FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
      }
    })
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store ={store}>
      <PersistGate loading={null} persistor={persistStore(store)}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
