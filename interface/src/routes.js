//REACT.JS COMPONENTS
import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

//PÁGINAS DO SITE
import UserArea from './pages/userArea';
import MedicalLogin from './pages/medicalLogin';
import MedicalArea from './pages/medicalArea';
import Schedule from './pages/schedule';
import Default from './pages/default';

const Routes = () => (
    <CookiesProvider>
        <BrowserRouter>
            <Switch>
                {/* DEFINE AS PÁGINAS A MOSTRAR DE ACORDO COM O LINK */}
<Route exact path='/' component={UserArea} />   {/* HOME PAGE / AREA USUARIO */}
                <Route exact path='/MedicalLogin' component={MedicalLogin} /> {/* LOGIN MEDICO */}
                <Route exact path='/MedicalArea' component={MedicalArea} /> {/* AREA MEDICA */}
                <Route exact path='/MedicalArea/Schedules' component={Schedule} /> {/* PÁGINA HORARIO */}
                <Route component={Default} />   {/* PÁGINA DE ERRO */}
            </Switch>
        </BrowserRouter>
    </CookiesProvider>
);


export default Routes;