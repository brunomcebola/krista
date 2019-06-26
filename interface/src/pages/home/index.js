import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import logo from '../../images/icon.png';

export default class Home extends Component {

    render() {
        return(
            <div className="home">
                <div className="page-header">
                    <img src={logo} alt="krista logo"/>
                    <h1>Krista Health-care</h1>
                </div>
                <div className="navigation">
                    <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand">Krista Healt-care</a>
                            </div>
                            <ul className="nav navbar-nav navbar-right">
                                <li>
                                    <div className="dropdown">
                                        <button className="dropbtn">Menu</button>
                                        <div className="dropdown-content">
                                            <a href="#">Products</a>
                                            <a href="#">Contacts</a>
                                            <Link to='/MedicalLogin' className="logBtn">Medical Area</Link>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <button className="dropbtn"><span className="glyphicon glyphicon-log-in"></span><Link to='/UserLogin' className="logBtn"> Login</Link></button>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        )
    }

}