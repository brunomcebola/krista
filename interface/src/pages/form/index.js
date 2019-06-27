import React, { Component } from 'react';
import api from '../../services/api';
import './styles.css';

export default class Form extends Component{

    state = {
        name: '',
        password: '',
        medicalNumber: ''
    };

    formSubmit = async (e) => {
        e.preventDefault();
        
        const ps = document.getElementById('ps');
        ps.value="";

        this.setState({ name: '', password: '', medicalNumber: ''})

        await api.post('/doctors/new', this.state);   
    };

    new = () => {
        
    }
    
    render(){
    
        return(
            <div>
                <form className="formArea" onSubmit={e => this.formSubmit(e)}>
                    <input onChange={e => this.setState({ name: e.target.value})} name="name" type="text" value={this.state.name} placeholder="Nome" required/>
                    <input id ="ps" onChange={e => this.setState({ password: e.target.value})} name="password" type="password" placeholder="Password" required/>
                    <input onChange={e => this.setState({ medicalNumber: e.target.value})} name="medicalNumber" type="number" value={this.state.medicalNumber} placeholder="Medical Number" required/>
                    <button type="submit">Send</button>
                </form>
                <button onClick={this.new}>ooooo</button>
            </div>
        );    
    }
}