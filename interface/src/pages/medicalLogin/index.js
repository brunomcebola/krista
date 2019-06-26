import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
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
            if(response.data.password === password) this.props.history.push("/medicalArea");
        }

    };

    render(){
        return(
            <div className="medical-login">
                <div className="backBtn-container">
                    <Link to='/' className="backBtn"><i className="fa fa-arrow-circle-left"></i> Página inicial</Link>
                </div>
                <div className="form-container">
                    <div className="blue-ball">
                        <h1>Área Médica</h1>
                        <form className="medical-form" onSubmit={e => this.submit(e)}>
                            <label forhtml="nm">Número medico</label>
                            <input id="nm" type="number" min="100000000" max="999999999" placeholder="Numero medico" autoComplete="on" required/>
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