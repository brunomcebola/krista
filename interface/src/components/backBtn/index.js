import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const BackBtn = ({ path , text}) =>
    <div className="backBtn-component">
       <div className="backBtn-container">
            <Link to={path} className="backBtn"><i className="fa fa-arrow-circle-left"></i> {text}</Link>
        </div> 
    </div>
    

export default BackBtn;