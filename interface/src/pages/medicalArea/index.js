import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';

import Loader from 'react-loader-spinner';

import './styles.css';
import logo from '../../images/icon.png'

class Header extends Component {
    render() {
        return(
            <div className="header">
                <h2><img src={logo}/> Área médica</h2>
            </div>
        );
    }
}

class List extends Component {
    
    render() {
        const {patients, search, exists, page, productInfo} = this.props.estado;

        return(
            <div className = "patient-list">
                <h2>Pacientes</h2>
                {(exists&&!search)?patients.map(patient => (    //existe mas nao e procura
                    <article key={patient._id}>
                        <div className="profile-container">
                            <img className="profile-pic" src="http://icons.iconarchive.com/icons/icons8/ios7/512/Users-User-Male-2-icon.png"/>  
                        </div>
                        <div className="patient-info">
                            <h3><strong>{patient.firstName+' '+patient.lastName}</strong></h3>
                            <p>Número do sistema de saúde: <u>{patient.hsn}</u></p>
                            <p>Médico: </p>
                        </div>
                        <div className="scheduleBtn">
                            <button disabled={patient.docNum!=JSON.parse(localStorage.getItem('docInfo'))}><Link id="link" to="/medicalArea/schedules">Manage</Link></button>
                        </div>
                    </article>
                )):(exists&&search)?(<article key={patients._id}> 
                    <div className="profile-container">
                        <img className="profile-pic" src="http://icons.iconarchive.com/icons/icons8/ios7/512/Users-User-Male-2-icon.png"/>  
                    </div>
                    <div className="patient-info">
                        <h3><strong>{patients.firstName+' '+patients.lastName}</strong></h3>
                        <p>Número do sistema de saúde: <u>{patients.hsn}</u></p>
                        <p>Médico: </p>
                    </div>
                </article>):(!exists&&search)?<h3>Não foi possível encontrar o paciente</h3>:null}
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
        load: false,
        erro: false,
        success: false
    }

    loading = () => {
        this.state.load = true;
        this.forceUpdate();
    }

    formSubmit = async (e) => {
        e.preventDefault();

        this.loading();

        const response = await api.get(`/patients/${this.state.hsn}`);

        if(response.data===null){
            await api.post('/patients/new', this.state);
            await api.get(`/schedules/${'u'+this.state.hsn}`);
            this.state.load=false;
            this.state.erro=false;
            this.state.success = true;
            this.forceUpdate();
            setTimeout(this.props.close, 1650);
        }
        else{
            this.state.load=false;
            this.state.erro=true;
            this.forceUpdate();
        }
    };

    render() {
        return(
            <div className="contentor">
                <div id="modal-content" className="modal-content">
                    <span className="close" onClick={this.props.close}>&times;</span>
                    <h3>Informação do paciente</h3>

                    {this.state.load?<Loader type="ThreeDots" color="green"height="30" width="30"/>:this.state.erro?<div id="erro">Paciente já existente</div>:this.state.success?<div id="succ">Paciente criado com sucesso</div>:null}

                    <form className="data-form" onSubmit={e => this.formSubmit(e)}>
                        <p><label>Número do sistema de saúde:</label>
                        <input id="hsn" type="text" required autoComplete="off" onChange={e => this.setState({ hsn: e.target.value})} value={this.state.hsn}/></p>
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
        new: false
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
        const inputField = document.getElementById("search-patient");
        const hsn = inputField.value; 
        inputField.value = '';

        const response = await api.get(`/patients/${hsn}`);

        if(response.data===null){
            this.setState({ exists: (response.data == null)?false:true, search: (hsn==='')?false:true });
        }
        else if(response.data.docs === undefined){
            this.setState({ patients: response.data, page: 1, exists: (response.data == null)?false:true, search: (hsn==='')?false:true });
        }
        else{
            const { docs, ...productInfo} = response.data;
            this.setState({ patients: docs, productInfo, page: 1, exists: (response.data == null)?false:true, search: (hsn==='')?false:true });
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
        this.props.history.push("/medicalLogin");
    }

    render() {
        return(
            <div>
                <Header/>
                <StickyContainer>
                    <Sticky>
                        {({ style }) => 
                            <div style={style} className="medical-nav">
                                <div className="left-container">
                                    <div className="patient">
                                        <input id="search-patient" type="text" placeholder="Número de paciente" name="search" />
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
                    <List estado={this.state} next={this.nextPage} prev={this.prevPage}/>
                </StickyContainer>

            </div>
        );
    }
}