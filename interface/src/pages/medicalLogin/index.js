import React, { Component } from 'react';
import Loader from 'react-loader-spinner';
import api from '../../services/api';

import BackBtn from '../../components/backBtn';
import {cipher,compareCipher} from '../../ciphers/encryptor.js';
import './styles.css';

export default class MedicalLogIn extends Component {  
    state = {
        loading: false
    }
    
    login = async (e) => {
        e.preventDefault();
        this.state.loading=true;
        this.forceUpdate();

        let allow = true;

        const nm = document.getElementById("nm");
        const pw = document.getElementById("pw");
        const passHolder = document.getElementById("pass-holder")

        const medicalNumber = nm.value;
        const password = pw.value;

        nm.style.borderColor = '#5B5F97';
        passHolder.style.borderColor = '#5B5F97';

        //saneamento do numero medico
        if(!medicalNumber.match(/^[A-Za-z0-9]+$/)){
            nm.style.borderColor = 'red'
            allow = false;
        }

        if(!password.match(/^[A-Za-z0-9]+$/)){
            passHolder.style.borderColor = 'red'
            allow = false;
        }

        if(allow){
            const response = await api.get(`/doctors/${medicalNumber}`);
            document.getElementById("nm").value = '';
            document.getElementById("pw").value = '';
            if(response.data != null){
                if(response.data.password === password){
                    const today = new Date();
                    const date = today.getTime();
                    localStorage.setItem('medicalLoginDate', cipher(date.toString()));
                    localStorage.setItem('medicalLogged', cipher('logged'));
                    localStorage.setItem('docInfo', JSON.stringify(cipher(medicalNumber)));
                    this.props.history.push("/MedicalArea");
                } 
            }
        }
        
        this.state.loading=false;
        
        this.forceUpdate();
    };

    checkLogin = () => {
        const loggedStorage = localStorage.getItem('medicalLogged');
        if(compareCipher(loggedStorage,'logged')) this.props.history.push("/MedicalArea");
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
                            <input id="nm" type="text" placeholder="Numero medico" minLength='9' maxLength='9' autoComplete="on" required/>
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