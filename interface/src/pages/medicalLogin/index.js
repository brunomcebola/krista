//REACT.JS COMPONENTS
import React, { Component } from 'react';
import Loader from 'react-loader-spinner';

//COMPONENTES CRIADOS POR NOS
//ligação ao servidor
import api from '../../services/api';
//componente que permite voltar para uma página especificada
import BackBtn from '../../components/backBtn';
//ficheiro com as funcoes para encriptar a info salva no browser
import {cipher,compareCipher} from '../../ciphers/encryptor.js';  

//CSS STYLE SHEET DA PÁGINA
import './styles.css';

//CRIA A ÁREA DE LOGIN PARA OS MÉDICOS
export default class MedicalLogin extends Component {  
    state = {
        loading: false
    }
    
    //realiza o login do médico
    login = async (e) => {
        e.preventDefault();

        //ativa a animação de load no botão de login
        this.state.loading=true;
        this.forceUpdate();

        //indica se tudo se encontra corrreto para fazer login
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
                    //GUARDA INFO ENCRIPTADA NO LOCAL STORAGE:
                    //indica a hora de login 
                    localStorage.setItem('medicalLoginDate', cipher(date.toString()));
                    //indica que o médico tem sessão iniciada
                    localStorage.setItem('medicalLogged', cipher('logged'));
                    //indica o número do médico
                    localStorage.setItem('docInfo', JSON.stringify(cipher(medicalNumber)));
                    this.props.history.push("/MedicalArea");
                } 
            }
        }
        
        //desativa a animação de load no botão de login
        this.state.loading=false;
        this.forceUpdate();
    };

    //verifica os dados de login do médico
    checkLogin = () => {
        const loggedStorage = localStorage.getItem('medicalLogged');
        //se existir sessão iniciada redireciona para a área médica
        if(compareCipher(loggedStorage,'logged')) this.props.history.push("/MedicalArea");
    }

    //alterna a visibilade da password
    togglePassword = () => {
        const eye = document.querySelector("#pass-holder .fa");
        const pass = document.querySelector('#pass-holder #pw');
        if(this.state.pass) {                       //torna invisivel
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            pass.type = "password";
            this.state.pass = false
        }
        else {                                      //torna visivel
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
            pass.type = "text";
            this.state.pass = true
        }   
    }

    //define propriedades da classe
    componentDidMount() {
        document.body.style.overflowX = "hidden";
    }

    render(){
        this.checkLogin();

        return(
            <div id="medical-login">
                <BackBtn path='/' text="Página inicial"/>
                <div id="form-container">
                    <div id="blue-ball">
                        <h1>Área Médica</h1>
                        <form id="medical-form" onSubmit={e => this.login(e)}>
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