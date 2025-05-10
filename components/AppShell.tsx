'use client';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Login from './pages/auth/login/Login';
import { kfiAxios, Request, RequestError, Response, ResponseError } from './utils/axios';
import Tabs from './pages/Tabs';

setupIonicReact({});

const AppShell = () => {
  kfiAxios.defaults.baseURL = 'http://localhost:5000/api/v1';
  kfiAxios.defaults.withCredentials = true;
  kfiAxios.interceptors.request.use(Request, RequestError);
  kfiAxios.interceptors.response.use(Response, ResponseError);

  const isLoggedIn = localStorage.getItem('auth') ? true : false;
  console.log(isLoggedIn);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet id="main">
          <Route path="/" render={() => (isLoggedIn ? <Redirect to="/dashboard" /> : <Login />)} />
          <Route path="/dashboard" render={() => (isLoggedIn ? <Tabs /> : <Redirect to="/" />)} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default AppShell;
