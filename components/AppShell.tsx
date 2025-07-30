'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Tabs from './pages/Tabs';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

setupIonicReact({});

const AppShell = () => {
  const isLoggedIn = localStorage.getItem('auth') ? true : false;
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== '/' && !isLoggedIn) {
      (window as any).location.href = '/';
    }
  }, [isLoggedIn]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/" render={() => (isLoggedIn ? <Redirect to="/dashboard" /> : <Login />)} exact={isLoggedIn ? false : true} />
          <Route path="/dashboard" render={() => (isLoggedIn ? <Tabs /> : <Redirect to="/" />)} exact={isLoggedIn ? false : true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
