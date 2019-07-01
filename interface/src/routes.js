import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Main from './pages/main';
import Form from './pages/form';
import Home from './pages/home';
import UserLogIn from './pages/userLogin';
import MedicalLogIn from './pages/medicalLogin';
import MedicalArea from './pages/medicalArea';
import Schedule from './pages/schedule';
import Default from './pages/default';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/UserLogin' component={UserLogIn} />
            <Route exact path='/MedicalLogin' component={MedicalLogIn} />
            <Route exact path='/MedicalArea' component={MedicalArea} />
            <Route exact path='/MedicalArea/Schedules' component={Schedule} />
            <Route exact path='/main' component={Main} />
            <Route exact path='/new' component={Form} />
            <Route component={Default} />
        </Switch>
    </BrowserRouter>
);

export default Routes;