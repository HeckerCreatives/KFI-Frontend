'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import Tabs from './pages/Tabs';

setupIonicReact({});

const AppShell = () => {
  const isLoggedIn = localStorage.getItem('auth') ? true : false;

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/" render={() => (isLoggedIn ? <Redirect to="/dashboard/home" /> : <Login />)} />
          <Route path="/dashboard/home" render={() => (isLoggedIn ? <Tabs /> : <Redirect to="/" />)} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
