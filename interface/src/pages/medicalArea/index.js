import React, { Component } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import Loader from 'react-loader-spinner';

import api from '../../services/api';
import PatientInfo from '../../components/patientInfo';
import {decipher,compareCipher} from '../../ciphers/encryptor.js';

import './styles.css';
import logo from '../../images/icon.png'

var randoomPass = '';

class Header extends Component {
    render() {
        return(
            <div className="header">
                <h2><img src={logo} alt='Krista logo'/> Área médica</h2>
            </div>
        );
    }
}

class List extends Component {

    componentDidMount() {
        window.addEventListener('resize', () => this.forceUpdate(), false);
    }
    
    render() {
        const {patients, search, exists, page, productInfo, load} = this.props.estado;
        
        console.log(patients)

        return(
            <div className = "patient-list">
                <h2>Pacientes</h2>
                {load?<Loader type="ThreeDots" color="green" height="30" width="30"/>:null}
                {(exists&&!search)?patients.map(patient => (<PatientInfo data={patient} intervalId={this.props.estado.interval}/>)):
                (exists&&search)?(<PatientInfo data={patients} intervalId={this.props.estado.interval}/>):
                (!exists&&search)?<h4 id="pacient-error">Nenhum paciente corresponde à pesquisa</h4>:null}
                <div id="actions">
                    <button disabled={page === 1 || search === true || load === true} onClick={this.props.prev}>Anterior</button>
                    <button disabled={page === productInfo.pages || productInfo.total<=productInfo.limit || search === true || load === true} onClick={this.props.next}>Próximo</button>
                </div>
            </div>
        );
    }
}

class Modal extends Component {
    state = {
        hsn: '',
        username: '',
        firstName: '',
        lastName: '',
        docNum: decipher(JSON.parse(localStorage.getItem('docInfo'))),
        docName: '',
        boxNum: '',
        load: false,
        exists: false,
        success: false,
        erro: false
    }

    formSubmit = async (e) => {
        e.preventDefault();

        this.state.load = true;
        this.state.username = this.state.hsn;
        this.forceUpdate();

        const hsn = document.getElementById('hsn');
        const fname = document.getElementById('fname');
        const lname = document.getElementById('lname');
        const age = document.getElementById('age');
        const bn = document.getElementById('bn');

        hsn.style.borderColor = '#5B5F97';
        fname.style.borderColor = '#5B5F97';
        lname.style.borderColor = '#5B5F97';
        age.style.borderColor = '#5B5F97';
        bn.style.borderColor = '#5B5F97';

        const response = await api.get(`/patients/${this.state.hsn}`);

        if(response.data===null){
            let allCorret = true

            //saneamento do hsn
            if(!this.state.hsn.match(/^[0-9]+$/)) {
                this.state.load=false;
                this.state.exists=false;
                this.state.success=false;
                this.state.erro=true;
                hsn.style.borderColor = 'red';
                allCorret = false;
                this.forceUpdate();
            }

            //saneamento do primeiro nome
            if(!this.state.firstName.match(/^[A-Za-z]+$/)) {
                this.state.load=false;
                this.state.exists=false;
                this.state.success=false;
                this.state.erro=true;
                fname.style.borderColor = 'red';
                allCorret = false;
                this.forceUpdate();
            }

            //saneamento do segundo nome
            if(!this.state.lastName.match(/^[A-Za-z]+$/)) {
                this.state.load=false;
                this.state.exists=false;
                this.state.success=false;
                this.state.erro=true;
                lname.style.borderColor = 'red';
                allCorret = false;
                this.forceUpdate();
            }

            //saneamento do número da caixa
            if(!this.state.boxNum.match(/^[A-Za-z0-9]+$/)) {
                this.state.load=false;
                this.state.exists=false;
                this.state.success=false;
                this.state.erro=true;
                bn.style.borderColor = 'red';
                allCorret = false;
                this.forceUpdate();
            }

            //verificação da idade minima
            if(this.state.age < 13) {
                this.state.load=false;
                this.state.exists=false;
                this.state.success=false;
                this.state.erro=true;
                age.style.borderColor = 'red';
                allCorret = false;
                this.forceUpdate();
            }

            if(allCorret){
                const response = await api.get(`doctors/${this.state.docNum}`);
                this.state.docName=response.data.name;
                const pass = await api.post('/patients/new', this.state);
                randoomPass = pass.data;
                await api.get(`/schedules/${'u'+this.state.hsn}`);
                this.state.load=false;
                this.state.exists=false;
                this.state.success=true;
                hsn.style.borderColor = '#5B5F97';
                fname.style.borderColor = '#5B5F97';
                lname.style.borderColor = '#5B5F97';
                age.style.borderColor = '#5B5F97';
                bn.style.borderColor = '#5B5F97';
                this.forceUpdate();
            }  
        }
        else{
            this.state.load=false;
            this.state.exists=true;
            this.forceUpdate();
        }
    };

    render() {
        return(
            <div className="contentor">
                <div className="modalContent">
                    <span className="close" onClick={this.props.close}>&times;</span>
                    <h3>Informação do paciente</h3>
            
                    {this.state.load?<Loader type="ThreeDots" color="green"height="30" width="30"/>:this.state.exists?<div id="warn">Paciente já existente</div>:this.state.success?<div id="succ">{"Paciente criado com sucesso - Password: "+ randoomPass}</div>:this.state.erro?<div id="erro">Dados introduzidos inválidos</div>:null}

                    <form className="data-form" onSubmit={e => this.formSubmit(e)}>
                        <p><label>Número do sistema de saúde:</label><br/>
                        <input id="hsn" type="text" required autoComplete="off" minLength='9' maxLength='9' onChange={e => this.setState({ hsn: e.target.value})} value={this.state.hsn}/></p>
                        <p><label>Primeiro nome:</label><br/>
                        <input id="fname" type="text" required autoComplete="off" onChange={e => this.setState({ firstName: e.target.value})} value={this.state.firstName}/></p>
                        <p><label>Último nome:</label><br/>
                        <input id="lname" type="text" required autoComplete="off" onChange={e => this.setState({ lastName: e.target.value})} value={this.state.lastName}/></p>
                        <p><label>Idade:</label><br/>
                        <input id="age" type="number" min='13' required autoComplete="off" onChange={e => this.setState({ age: e.target.value})} value={this.state.age}/></p>
                        <p><label>ID da caixa:</label><br/>
                        <input id="bn" type="text" required autoComplete="off" minLength='12' maxLength='12' onChange={e => this.setState({ boxNum: e.target.value})} value={this.state.boxNum}/></p>
                        <button type="submit">Adicionar</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default class MedicalArea extends Component {
    state = {
        patients: [],
        productInfo: {},
        search: false,
        exists: false,
        page: 1,
        new: false,
        load: true,
        interval: ''
    }

    componentDidMount() {
        document.body.style.overflowX = "hidden";
        this.state.interval = setInterval(this.checkLogin, 1000);
        this.loadPatients();
    }

    loadPatients = async (page = 1) => {
        const response = await api.get(`/patients?page=${page}`);

        const { docs, ...productInfo} = response.data;

        this.setState({ patients: docs, productInfo, page, exists: (response.data.length===0)?false:true , search: false, load: false});
    };

    //caso nao hajam muitas paginas nao aparecer ?
    prevPage = () => {
        const { page } = this.state;

        if( page === 1) return;

        const pageNumber = page - 1;
        this.loadPatients(pageNumber);
    };

    //same que o prevPage
    nextPage = () => {
        const { page, productInfo } = this.state;

        if (page === productInfo.pages) return;

        const pageNumber = page + 1;
        this.loadPatients(pageNumber);
    };

    //ideia para mais tarde : ajuda nas procuras "facilitar"
    search = async () => {
        this.state.load=true;
        this.forceUpdate();
        const inputField = document.getElementById("search-patient");
        let hsn = inputField.value; 
        inputField.value = '';

        hsn = hsn.trim();

        if((!hsn.match(/^[0-9]+$/) && hsn.length===9) || hsn.length===0){
            const response = await api.get(`/patients/${hsn}`);

            if(response.data===null){
                this.setState({ exists: (response.data == null)?false:true, search: (hsn==='')?false:true, load:false });
            }
            else if(response.data.docs === undefined){
                this.setState({ patients: response.data, page: 1, exists: (response.data == null)?false:true, search: (hsn==='')?false:true, load:false });
            }
            else{
                const { docs, ...productInfo} = response.data;
                this.setState({ patients: docs, productInfo, page: 1, exists: (response.data == null)?false:true, search: (hsn==='')?false:true, load:false });
            }   
        }
        else{
            alert('O valor introduzido tem de ser um número de 9 caracteres');
            this.state.load=false
        }
    };

    switchModal = () => {
        if(this.state.new===true){
            this.loadPatients();
            this.forceUpdate();
        }

        randoomPass = '';
        
        this.setState(prevState => ({ new: !prevState.new }));
        
    }

    logout = () => {
        localStorage.removeItem('medicalLogged');
        localStorage.removeItem('docInfo');
        localStorage.removeItem('medicalLoginDate');
        clearInterval(this.state.interval);
        this.props.history.push("/MedicalLogin");
    }

    checkLogin = () => {
        const medicalLoginDate = localStorage.getItem('medicalLoginDate');
        const today = new Date();
        const date = today.getTime();

        const loggedStorage = localStorage.getItem('medicalLogged');
        if(!compareCipher(loggedStorage,'logged')){
            clearInterval(this.state.interval);
            this.props.history.push("/MedicalLogin");
        }

        else if((date-Number(decipher(medicalLoginDate)))/1000 > 10800){
            alert('Por motivos de segurança é necessário realizar login novamente!');
            this.logout()
        }

        
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') this.search()
    }

    render() {
        localStorage.removeItem('hsn');

        this.checkLogin();

        return(
            <div id="medical-area">
                <Header/>
                <StickyContainer>
                    <Sticky>
                        {({ style }) => 
                            <div style={style} className="medicalNav">
                                <div className="leftContainer">
                                    <input id="search-patient" type="text" placeholder="Número de paciente" name="search" minLength='9' maxLength='9' onKeyDown={this.handleKeyDown}/>
                                    <button id="search-btn" onClick={this.search}><i className="fa fa-search"></i></button>
                                    <button id="new-patient" onClick={this.switchModal}>Novo Paciente</button>   
                                </div>
                                <div className="rightContainer">
                                    <button onClick={this.logout} id="logout-btn">Sign Out <i className="fa fa-sign-out"></i></button>
                                </div>  
                            </div>
                        }
                    </Sticky>
                    {this.state.new?<Modal close={this.switchModal}/>:null}
                    <List estado={this.state} hist={this.props.history} next={this.nextPage} prev={this.prevPage}/>
                </StickyContainer>

            </div>
        );
    }
}