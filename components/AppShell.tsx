'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactHashRouter } from '@ionic/react-router';
import { Route, Redirect } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Tabs from './pages/Tabs';
import { useEffect, useState } from 'react';
import { useOnlineStore } from '../store/onlineStore';
import { useGlobalJobSocket } from '../hooks/useGlobalJobSocket';
import { Permission } from '../types/types';



setupIonicReact({
  mode: 'md',
  animated: typeof window === 'undefined' || window.location.protocol !== 'capacitor-electron:',
});

const AppShell = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const setOnline = useOnlineStore((state) => state.setOnline);
  
  // Initialize global job socket listener
  useGlobalJobSocket();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth'));
    setAuthChecked(true);
  }, []);

  // ✅ Listen for 401 unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      setIsLoggedIn(false);
    };
    window.addEventListener('unauthorized', handleUnauthorized);
    return () => window.removeEventListener('unauthorized', handleUnauthorized);
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
           render={() => {
            if (isLoggedIn) {
              const permissions: Permission[] = JSON.parse(
                localStorage.getItem('permissions') || '[]'
              );
              const hasDashboard = permissions.find(
                (item) => item.resource === 'dashboard'
              )?.actions?.visible;

              return hasDashboard 
                ? <Redirect to="/dashboard/home" /> 
                : <Redirect to="/dashboard/kfi" />;
            }
            return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
          }}
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