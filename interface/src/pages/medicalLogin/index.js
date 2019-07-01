import React, { Component } from 'react';
import api from '../../services/api';

import BackBtn from '../../components/backBtn';
import './styles.css';

export default class MedicalLogIn extends Component {

    submit = async (e) => {
        e.preventDefault();

        const medicalNumber = document.getElementById("nm").value;
        const password = document.getElementById("pw").value;
        document.getElementById("nm").value = '';
        document.getElementById("pw").value = '';

        const response = await api.get(`/doctors/${medicalNumber}`);
        
        if(response.data != null){
            if(response.data.password === password){
                localStorage.setItem('docInfo', JSON.stringify(medicalNumber));
                localStorage.setItem('medicalLogged', JSON.stringify(true));
                this.props.history.push("/MedicalArea");
            } 
        }

    };

    checkLogin = () => {
        const logged = JSON.parse(localStorage.getItem('medicalLogged'));
        if(logged===true) this.props.history.push("/MedicalArea");
    }

    render(){
        this.checkLogin();

        return(
            <div className="medical-login">
                <BackBtn path='/' text="Página inicial"/>
                <div className="form-container">
                    <div className="blue-ball">
                        <h1>Área Médica</h1>
                        <form className="medical-form" onSubmit={e => this.submit(e)}>
                            <label forhtml="nm">Número medico</label>
                            <input id="nm" type="text" placeholder="Numero medico" autoComplete="on" required/>
                            <label forhtml="pw">Password</label>
                            <input id="pw" type="password" placeholder="Password" autoComplete="on" required/>
                            <button type="submit">Entrar  <span className="glyphicon glyphicon-log-in"></span></button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

}