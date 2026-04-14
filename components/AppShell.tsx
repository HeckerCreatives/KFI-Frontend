'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Tabs from './pages/Tabs';
import { useEffect, useState } from 'react';
import { useOnlineStore } from '../store/onlineStore';

setupIonicReact({});

const AppShell = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setOnline = useOnlineStore((state) => state.setOnline);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth'));
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnline]);

  if (!authChecked) {
    return (
      <IonApp>
        <div className="ion-page">Loading...</div>
      </IonApp>
    );
  }

  return (
    <IonApp>
      <IonReactHashRouter>
        <IonRouterOutlet id="main">
          <Route
            path="/"
            exact
            render={() =>
              isLoggedIn ? <Redirect to="/dashboard/home" /> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />
            }
          />
          <Route
            path="/dashboard"
            render={() =>
              isLoggedIn ? <Tabs onLogout={() => setIsLoggedIn(false)} /> : <Redirect to="/" />
            }
          />
        </IonRouterOutlet>
      </IonReactHashRouter>
    </IonApp>
  );
};

export default AppShell;