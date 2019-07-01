import React, { Component } from 'react';
import api from '../../services/api';
import { StickyContainer, Sticky } from 'react-sticky';
import Loader from 'react-loader-spinner';

import './styles.css';
import logo from '../../images/icon.png'

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

    goSchedule = (hsn) => {
        localStorage.setItem('hsn', JSON.stringify(hsn));
        this.props.hist.push("/MedicalArea/Schedules");
    }
    
    render() {
        const {patients, search, exists, page, productInfo, load} = this.props.estado;

        return(
            <div className = "patient-list">
                <h2>Pacientes</h2>
                {load?<Loader type="ThreeDots" color="green"height="30" width="30"/>:null}
                {(exists&&!search)?patients.map(patient => (    //existe mas nao e procura
                    <article key={patient._id}>
                        <div className="profile-container">
                            <img className="profile-pic" src="http://icons.iconarchive.com/icons/icons8/ios7/512/Users-User-Male-2-icon.png" alt="icon"/>  
                        </div>
                        <div className="patient-info">
                            <h3><strong>{patient.firstName+' '+patient.lastName}</strong></h3>
                            <p>Número do sistema de saúde: <u>{patient.hsn}</u></p>
                            <p>Médico: {patient.docName}</p>
                        </div>
                        <div className="scheduleBtn">
                            <button onClick={() => this.goSchedule(patient.hsn)} disabled={patient.docNum!==JSON.parse(localStorage.getItem('docInfo'))}>Manage</button>
                        </div>
                    </article>
                )):(exists&&search)?(<article key={patients._id}> 
                    <div className="profile-container">
                        <img className="profile-pic" src="http://icons.iconarchive.com/icons/icons8/ios7/512/Users-User-Male-2-icon.png" alt="icon"/>  
                    </div>
                    <div className="patient-info">
                        <h3><strong>{patients.firstName+' '+patients.lastName}</strong></h3>
                        <p>Número do sistema de saúde: <u>{patients.hsn}</u></p>
                        <p>Médico: {patients.docName}</p>
                    </div>
                    <div className="scheduleBtn">
                        <button onClick={() => this.goSchedule(patients.hsn)} disabled={patients.docNum!==JSON.parse(localStorage.getItem('docInfo'))}>Manage</button>
                    </div>
                </article>):(!exists&&search)?<h4 id="pacient-error">Nenhum paciente corresponde à pesquisa</h4>:null}
                <div className="actions">
                    <button disabled={page === 1 || search === true} onClick={this.props.prev}>Anterior</button>
                    <button disabled={page === productInfo.pages || productInfo.total<=productInfo.limit || search === true} onClick={this.props.next}>Próximo</button>
                </div>
            </div>
        );
    }
}

class Modal extends Component {
    state = {
        hsn: '',
        firstName: '',
        lastName: '',
        docNum: JSON.parse(localStorage.getItem('docInfo')),
        docName: '',
        load: false,
        exists: false,
        success: false,
        erro: false
    }

    formSubmit = async (e) => {
        e.preventDefault();

        this.state.load = true;
        this.forceUpdate();

        const response = await api.get(`/patients/${this.state.hsn}`);

        if(response.data===null){
            if(isNaN(this.state.hsn) || !this.state.firstName.match(/^[A-Za-z]+$/) || !this.state.lastName.match(/^[A-Za-z]+$/)) {
                this.state.load=false;
                this.state.exists=false;
                this.state.success=false;
                this.state.erro=true;
                this.forceUpdate();
            }
            else{
                const response = await api.get(`doctors/${this.state.docNum}`);
                this.state.docName=response.data.name;
                await api.post('/patients/new', this.state);
                await api.get(`/schedules/${'u'+this.state.hsn}`);
                this.state.load=false;
                this.state.exists=false;
                this.state.success=true;
                this.forceUpdate();
                setTimeout(this.props.close, 1650);
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
                <div id="modal-content" className="modal-content">
                    <span className="close" onClick={this.props.close}>&times;</span>
                    <h3>Informação do paciente</h3>
            
                    {this.state.load?<Loader type="ThreeDots" color="green"height="30" width="30"/>:this.state.exists?<div id="warn">Paciente já existente</div>:this.state.success?<div id="succ">Paciente criado com sucesso</div>:this.state.erro?<div id="erro">Dados introduzidos inválidos</div>:null}

                    <form className="data-form" onSubmit={e => this.formSubmit(e)}>
                        <p><label>Número do sistema de saúde:</label>
                        <input id="hsn" type="text" required autoComplete="off" minLength='9' maxLength='9' onChange={e => this.setState({ hsn: e.target.value})} value={this.state.hsn}/></p>
                        <p><label>Primeiro nome:</label>
                        <input id="fname" type="text" required autoComplete="off" onChange={e => this.setState({ firstName: e.target.value})} value={this.state.firstName}/></p>
                        <p><label>Último nome:</label>
                        <input id="lname" type="text" required autoComplete="off" onChange={e => this.setState({ lastName: e.target.value})} value={this.state.lastName}/></p>
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
        load: false
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = async (page = 1) => {
        const response = await api.get(`/patients?page=${page}`);
        const { docs, ...productInfo} = response.data;

        this.setState({ patients: docs, productInfo, page, exists: (response.data.length===0)?false:true , search: false});
    };

    prevPage = () => {
        const { page } = this.state;

        if( page === 1) return;

        const pageNumber = page - 1;
        this.loadProducts(pageNumber);
    };

    nextPage = () => {
        const { page, productInfo } = this.state;

        if (page === productInfo.pages) return;

        const pageNumber = page + 1;
        this.loadProducts(pageNumber);
    };

    search = async () => {
        this.state.load=true;
        this.forceUpdate();
        const inputField = document.getElementById("search-patient");
        const hsn = inputField.value; 
        inputField.value = '';

        if((!isNaN(hsn) && hsn.length===9) || hsn.length===0){
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
            this.loadProducts();
            this.forceUpdate();
        }
        
        this.setState(prevState => ({ new: !prevState.new }));
        
    }

    logout = () => {
        localStorage.removeItem('docInfo');
        localStorage.removeItem('medicalLogged');
        this.props.history.push("/MedicalLogin");
    }

    checkLogin = () => {
        const logged = JSON.parse(localStorage.getItem('medicalLogged'));
        if(logged!==true) this.props.history.push("/MedicalLogin");
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter') this.search()
    }

    render() {
        localStorage.removeItem('hsn');

        this.checkLogin();

        return(
            <div>
                <Header/>
                <StickyContainer>
                    <Sticky>
                        {({ style }) => 
                            <div style={style} className="medical-nav">
                                <div className="left-container">
                                    <div className="patient">
                                        <input id="search-patient" type="text" placeholder="Número de paciente" name="search" maxLength='9' onKeyDown={this.handleKeyDown}/>
                                        <button className="searchBtn" onClick={this.search}><i className="fa fa-search"></i></button>
                                        <button className="newPatient" onClick={this.switchModal}>Novo Paciente</button>
                                    </div>
                                    
                                </div>
                                <div className="logout">
                                    <button onClick={this.logout} className="logoutBtn">Sign Out <i className="fa fa-sign-out"></i></button>
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