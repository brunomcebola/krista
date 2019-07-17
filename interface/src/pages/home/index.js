import React, { Component, useReducer } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './styles.css';
import logo from '../../images/icon.png';
import { element } from 'prop-types';

export default class Home extends Component {
    login = async () => {
        let user = document.querySelector('#user');
        let pass = document.querySelector('#pass');
        const response = await api.post('/patients/log', {user: user.value, pass: pass.value});
        user.value="";
        pass.value="";
        if(response.data!=="") localStorage.setItem('userLogged', "logged");
        this.forceUpdate();
    }

    logout = () => {
        localStorage.removeItem('userLogged')
        this.forceUpdate();
    }

    render() {
        const userLogged = localStorage.getItem('userLogged');
        return(
            <div className="home">
                <div className="page-header">
                    <img src={logo} alt="krista logo"/>
                    <h1>Krista Health-Care</h1>
                </div>
                <div className="navigation">
                    <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand">Krista Health-Care</a>
                            </div>
                            <ul className="nav navbar-nav navbar-right">
                                <li>   
                                    <button className="dropbtn"><Link to='' className="logBtn">Contactos</Link></button>
                                    <button className="dropbtn"><Link to='/MedicalLogin' className="logBtn">Área médica</Link></button>
                                    {userLogged==="logged"
                                        ?<span>
                                            <button onClick={this.logout} id="login">Logout</button>
                                        </span>
                                        :<span>
                                            <input placeholder="username" id="user"></input>
                                            <input placeholder="password" id="pass"></input>
                                            <button onClick={this.login} id="login">Login</button>
                                        </span>
                                    }
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </div>
        )
    }

}