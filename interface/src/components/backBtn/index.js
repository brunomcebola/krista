import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const BackBtn = () =>
    <div className="backBtn-component">
       <div className="backBtn-container">
            <Link to='/' className="backBtn"><i className="fa fa-arrow-circle-left"></i> Página inicial</Link>
        </div> 
    </div>
    

export default BackBtn;