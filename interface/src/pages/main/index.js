import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import './styles.css';

export default class Main extends Component {
    state = {
        docs: [],
        search: false,
        exists: true,
    };

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async () => {
        const response = await api.get('/doctors');

        const { data: docs } = response;

        this.setState({ docs, exists: (response.data.length===0)?false:true , search: false});
    };

    search = async () => {
        const inputField = document.getElementById("id");
        const medicalNumber = inputField.value; 
        
        inputField.value = '';

        const response = await api.get(`/doctors/${medicalNumber}`);
    
        this.setState({ docs: response.data, exists: (response.data == null)?false:true, search:true });

    };

    render() {
        const { docs, exists, search } = this.state;
        
        return (

            <div className = "product-list">  
                <div className="actions">
                    <input type="number" id="id" name="id" placeholder="Medical Number:"/>
                    <button id="procurar" onClick={this.search}>Procurar</button>
                    <button onClick={this.loadProducts}>Mostrar todos</button>
                    <button><Link id='formLink' to='/new'>Adicionar</Link></button>
                </div>
                {(exists&&!search)?docs.map(doc => (    //existe mas nao e procura
                    <article key={doc._id}>
                        <strong>{doc.name}</strong>
                        <p>{doc.medicalNumber}</p>
                    </article>
                )):(exists&&search)?(<article key={docs._id}> 
                    <strong>{docs.name}</strong>
                    <p>{docs.medicalNumber}</p>
                </article>):(!exists&&search)?<h3>Doctor not found</h3>:null}
            </div>
        )
    }
}