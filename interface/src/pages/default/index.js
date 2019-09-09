import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import logo from '../../images/icon.png'

//PÁGINA MOSTRADA QUANDO O LINK INTRODUZIDO É INCORRETO
export default class Default extends Component {
    render() {
        return(
            <div id="default">
                <img src={logo} alt="krista logo"/>
                <h3>Lamentamos, mas a página que procurou não existe</h3>
                <h2><Link to='/'><i className="fa fa-arrow-circle-left"></i> Página inicial</Link></h2>
            </div>
        )
    }
}