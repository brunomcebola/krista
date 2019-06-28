import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
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
                    <button disabled={page === productInfo.pages || search === true} onClick={this.props.next}>Próximo</button>
                </div>
            </div>
        );
    }
}

class Modal extends Component {
    render() {
        return(
            <div className="contentor">
                <div className="modal-content">
                    <span className="close" onClick={this.props.close}>&times;</span>
                    <h3>Informação do paciente</h3>
                    <div className="data-form">
                        <p><label htmlfor="hsn">Número do sistema de saúde:</label>
                        <input id="hsn" type="text" name="hsn" required /></p>
                        <p><label htmlfor="fname">Primeiro nome:</label>
                        <input id="fname" type="text" name="fname" required /></p>
                        <p><label htmlfor="lname">Último nome:</label>
                        <input id="lname" type="text" name="lname" required /></p>
                        <button>Adicionar</button>
                    </div>
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
        this.setState(prevState => ({ new: !prevState.new }));
    }

    render() {
        return(
            <div>
                <Header/>
                <StickyContainer>
                    <Sticky>
                        {({ style }) => 
                            <div style={style} className="medical-nav">
                                <div className="search">
                                    <input id="search-patient" type="text" placeholder="Número de paciente" name="search" />
                                    <button onClick={this.search}><i className="fa fa-search"></i></button>
                                </div>
                                <div className="new">
                                    <button className="newPatient" onClick={this.switchModal}>Novo Paciente</button>
                                </div>
                                <div className="logout">
                                    <button className="logoutBtn"><Link to='/medicalLogin' id="out">Sign Out <i className="fa fa-sign-out"></i></Link></button>
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