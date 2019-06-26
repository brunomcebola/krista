import React, { Component } from 'react';
import api from '../../services/api';
import './styles.css';

//aaaaa

export default class Form extends Component {
    state = {
        name: '',
        password: '',
        medicalNumber: ''
    }

    formSubmit = async (e) => {
        e.preventDefault();
        
        this.setState({ name: '', password: '', medicalNumber: ''})

        await api.post('/doctors/new', this.state);        
      }

    render() {
        return(
            <form className="formArea" onSubmit={e => this.formSubmit(e)}>
                <input onChange={e => this.setState({ name: e.target.value})} name="name" type="text" value={this.state.name} placeholder="Nome" required/>
                <input onChange={e => this.setState({ password: e.target.value})} name="password" type="password" value={this.state.password} placeholder="Password" required/>
                <input onChange={e => this.setState({ medicalNumber: e.target.value})} name="medicalNumber" type="number" value={this.state.medicalNumber} placeholder="Medical Number" required/>
                <button type="submit">Send</button>
            </form>
        )
    }
}