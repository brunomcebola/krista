import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './pages/main';
import Form from './pages/form';
import Home from './pages/home';
import UserLogIn from './pages/userLogin';
import MedicalLogIn from './pages/medicalLogin';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route path='/UserLogin' component={UserLogIn} />
            <Route path='/MedicalLogin' component={MedicalLogIn} />
            <Route path='/main' component={Main} />
            <Route path='/new' component={Form} />
        </Switch>
    </BrowserRouter>
);

export default Routes;