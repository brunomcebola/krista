import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Home from './pages/home';
import MedicalLogIn from './pages/medicalLogin';
import MedicalArea from './pages/medicalArea';
import Schedule from './pages/schedule';
import Default from './pages/default';

const Routes = () => (
    <CookiesProvider>
        <BrowserRouter>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/MedicalLogin' component={MedicalLogIn} />
                <Route exact path='/MedicalArea' component={MedicalArea} />
                <Route exact path='/MedicalArea/Schedules' component={Schedule} />
                <Route component={Default} />
            </Switch>
        </BrowserRouter>
    </CookiesProvider>
);

export default Routes;