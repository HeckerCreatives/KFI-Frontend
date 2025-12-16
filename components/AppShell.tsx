'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Tabs from './pages/Tabs';
import { useEffect, useState } from 'react';
import { useOnlineStore } from '../store/onlineStore';

setupIonicReact({});

const AppShell = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const online = useOnlineStore((state) => state.online);
  const setOnline = useOnlineStore((state) => state.setOnline);

  useEffect(() => {
    // Client-side only check
    setIsLoggedIn(!!localStorage.getItem('auth'));
    setAuthChecked(true);
  }, []);

   useEffect(() => {
    // LISTEN TO ONLINE/OFFLINE CHANGES
    //  const handleOnline = () => setOnline(true);
    //  const handleOffline = () => setOnline(false);
    //  window.addEventListener("online", handleOnline);
    //  window.addEventListener("offline", handleOffline);
    //  return () => {
    //    window.removeEventListener("online", handleOnline);
    //    window.removeEventListener("offline", handleOffline);
    //  };

    setOnline(false)
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
