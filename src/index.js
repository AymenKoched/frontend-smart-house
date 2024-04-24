import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { EtagesContextProvider } from './contexts/EtagesContext';
import { CartesContextProvider } from './contexts/CartesContext';
import { LampesContextProvider } from './contexts/LampesContext';
import { StoresContextProvider } from './contexts/StoresContext';
import { AuthContectProvider } from './contexts/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <AuthContectProvider>
    <EtagesContextProvider>
      <CartesContextProvider>
        <LampesContextProvider>
          <StoresContextProvider>
            <App />
          </StoresContextProvider>
        </LampesContextProvider>
      </CartesContextProvider>
    </EtagesContextProvider>
  </AuthContectProvider>
  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
