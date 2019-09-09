//REACT.JS COMPONENTS
import React from 'react';
import { Link } from 'react-router-dom';

//CSS STYLE SHEET DO COMPONENTE
import './styles.css';

//COMPONENTE USADO PARA RETROCEDER NAS PÁGINAS
const BackBtn = ({ path , text, intervalID}) =>
    //usado para terminar o intervalo na página Schedule
    <div id="back-btn-container" onClick={() => clearInterval(intervalID)}>
        <Link to={path} id="backBtn"><i className="fa fa-arrow-circle-left"></i> {text}</Link>
    </div> 

export default BackBtn;