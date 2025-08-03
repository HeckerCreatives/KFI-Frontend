'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Tabs from './pages/Tabs';
import { useEffect, useState } from 'react';

setupIonicReact({});

const AppShell = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Client-side only check
    setIsLoggedIn(!!localStorage.getItem('auth'));
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return (
      <IonApp>
        <div className="ion-page">Loading...</div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route
            path="/"
            exact
            render={() => {
              if (!authChecked) return null;
              return isLoggedIn ? <Redirect to="/dashboard" /> : <Login />;
            }}
          />
          <Route
            path="/dashboard"
            render={() => {
              if (!authChecked) return null;
              return isLoggedIn ? <Tabs /> : <Redirect to="/" />;
            }}
          />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
