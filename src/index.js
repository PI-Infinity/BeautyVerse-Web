import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter } from 'react-router-dom';
import { GoogleMapsProvider } from './components/googleApiProvider';

const container = document.getElementById('root');
const root = createRoot(container);
// const apiKey = 'AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo';
root.render(
  <BrowserRouter>
    {/* <GoogleMapsProvider apiKey={apiKey}> */}
    <Provider store={store}>
      <App />
    </Provider>
    {/* </GoogleMapsProvider> */}
  </BrowserRouter>
);
