//index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

// Replace with your Auth0 domain and client ID
const domain = "dev-wi8rrfeuvgiseeuj.us.auth0.com";
const clientId = "BlRMFCr7orVJbf0Tov2yXfe03glw01ob";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: window.location.origin + '/users'}}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

reportWebVitals();
