import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import api from '../../services/api';

import BackBtn from '../../components/backBtn';
import './styles.css';

export default class MedicalLogIn extends Component {  
    state = {
        loading: false
    }
    
    login = async (e) => {
        e.preventDefault();
        this.state.loading=true;
        this.forceUpdate();

        const medicalNumber = document.getElementById("nm").value;
        const password = document.getElementById("pw").value;

        const response = await api.get(`/doctors/${medicalNumber}`);

        document.getElementById("nm").value = '';
        document.getElementById("pw").value = '';
        
        if(response.data != null){
            if(response.data.password === password){
                const today = new Date();
                const date = today.getTime();
                localStorage.setItem('medicalLoginDate', date);
                localStorage.setItem('medicalLogged','logged');
                localStorage.setItem('docInfo', JSON.stringify(medicalNumber));
                this.props.history.push("/MedicalArea");
            } 
        }
        this.state.loading=false;
        
        this.forceUpdate();
    };

    checkLogin = () => {
        const loggedStorage = localStorage.getItem('medicalLogged');
        if(loggedStorage==='logged') this.props.history.push("/MedicalArea");
    }

    togglePassword = () => {
        const eye = document.querySelector("#pass-holder .fa");
        const pass = document.querySelector('#pass-holder #pw');
        if(this.state.pass) {
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            pass.type = "password";
            this.state.pass = false
        }
        else {
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
            pass.type = "text";
            this.state.pass = true
        }   
    }

    render(){
        this.checkLogin();

        return(
            <div className="medical-login">
                <BackBtn path='/' text="Página inicial"/>
                <div className="form-container">
                    <div className="blue-ball">
                        <h1>Área Médica</h1>
                        <form className="medical-form" onSubmit={e => this.login(e)}>
                            <label forhtml="nm">Número médico</label>
                            <input id="nm" type="text" placeholder="Numero medico" autoComplete="on" required/>
                            <label forhtml="pw">Password</label>
                            <span id="pass-holder"><input id="pw" type="password" placeholder="Password" autoComplete="on" required/>
                            <i className="fa fa-eye" onClick={this.togglePassword}></i></span>
                            <button type="submit">{this.state.loading?<Loader type="ThreeDots" color='rgb(56, 59, 94)' height="10" width="30"/>:<span>Entrar <span className="glyphicon glyphicon-log-in"></span></span>}  </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}