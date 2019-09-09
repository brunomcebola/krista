//REACT.JS COMPONENTS
import React, { Component } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import Loader from 'react-loader-spinner';

//COMPONENTES CRIADOS POR NOS
//ligação ao servidor
import api from '../../services/api';
//componente usado para mostrar as informações do paciente
import PatientInfo from '../../components/patientInfo';
//ficheiro com as funcoes para encriptar a info salva no browser
import {decipher,compareCipher} from '../../ciphers/encryptor.js';

//CSS STYLE SHEET DA PÁGINA
import './styles.css';

//IMAGENS
import logo from '../../images/icon.png'

//PASSWORD DO PACIENTE GERADA ALEATÓRIA PELA BASE DE DADOS
//APENAS É GUARDADA TEMPORARIAMENTE
var randoomPass = '';

//APRESENTA A IMAGEM E NOME NO TOPO DA PÁGINA
class Header extends Component {
    render() {
        return(
            <div id="header">
                <h2><img src={logo} alt='Krista logo'/> Área médica</h2>
            </div>
        );
    }
}

//USADO NO DISPLAY DOS PACIENTES
class List extends Component {

    //define comportamentos da classe
    componentDidMount() {
        //força o update da página quando há resize
        window.addEventListener('resize', () => this.forceUpdate(), false);
    }
    
    render() {
        const {patients, search, exists, page, productInfo, load} = this.props.estado;
        
        console.log(patients)

        return(
            <div id = "patient-list">
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

//PERMITE CRIAR NOVOS PACINETES
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

    //gere a criação de novos pacinetes
    formSubmit = async (e) => {
        e.preventDefault();

        this.state.load = true;

        //ativa a animação de load
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

        //confirma se existe algum paviente com o hsn passado
        //se sim então não é possivel criar outro user com o mesmo hsn
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
                randoomPass = pass.data;    //guarda temporariamente a password do novo paciente
                await api.get(`/schedules/${'u'+this.state.hsn}`);
                //termina a animação de load e define a mensagem a ser mostrada
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
            //termina a animação de load e mostra a mensagem de paciente já existente
            this.state.load=false;
            this.state.exists=true;
            this.forceUpdate();
        }
    };

    render() {
        return(
            <div id="modal-container">
                <div id="modal-content">
                    {/* botão para fechar o modal */}
                    <span id="close" onClick={this.props.close}>&times;</span>
                    <h3>Informação do paciente</h3>
            
                    {/* Mensagems/animação de load */}
                    {this.state.load?<Loader type="ThreeDots" color="green"height="30" width="30"/>:this.state.exists?<div id="warn">Paciente já existente</div>:this.state.success?<div id="succ">{"Paciente criado com sucesso - Password: "+ randoomPass /* mostra a pass do paciente para o médico lha poder dar */}</div>:this.state.erro?<div id="erro">Dados introduzidos inválidos</div>:null}

                    {/* zona para introduzir os dados do novo paciente */}
                    <form id="data-form" onSubmit={e => this.formSubmit(e)}>
                        <p><label>Número do sistema de saúde:</label><br/>
                        <input id="hsn" type="text" required autoComplete="off" minLength='9' maxLength='9' onChange={e => this.setState({ hsn: e.target.value})} value={this.state.hsn}/></p>
                        <p><label>Primeiro nome:</label><br/>
                        <input id="fname" type="text" required autoComplete="off" onChange={e => this.setState({ firstName: e.target.value})} value={this.state.firstName}/></p>
                        <p><label>Último nome:</label><br/>
                        <input id="lname" type="text" required autoComplete="off" onChange={e => this.setState({ lastName: e.target.value})} value={this.state.lastName}/></p>
                        <p><label>Idade:</label><br/>
                        <input id="age" type="number" min='13' max='200' required autoComplete="off" onChange={e => this.setState({ age: e.target.value})} value={this.state.age}/></p>
                        <p><label>ID da caixa:</label><br/>
                        <input id="bn" type="text" required autoComplete="off" minLength='12' maxLength='12' onChange={e => this.setState({ boxNum: e.target.value})} value={this.state.boxNum}/></p>
                        <button type="submit">Adicionar</button>
                    </form>
                </div>
            </div>
        )
    }
}

//CLASSE CENTRAL
export default class MedicalArea extends Component {
    state = {
        patients: [],
        productInfo: {},
        search: false,
        exists: false,
        page: 1,
        new: false,
        load: true,
        interval: ''     //id do intervalo que verifica o login
    }

    //descarrega os daodos dos pacientes da base de dados de acordo com a página
    loadPatients = async (page = 1) => {
        const response = await api.get(`/patients?page=${page}`);

        const { docs, ...productInfo} = response.data;

        //guarda a resposta no estado
        this.setState({ patients: docs, productInfo, page, exists: (response.data.length===0)?false:true , search: false, load: false});
    };

    //retrocede um página na listagem dos pacientes
    prevPage = () => {
        const { page } = this.state;

        if( page === 1) return;

        const pageNumber = page - 1;
        this.loadPatients(pageNumber);
    };

    //avaça uma página na listagem dos pacientes
    nextPage = () => {
        const { page, productInfo } = this.state;

        if (page === productInfo.pages) return;

        const pageNumber = page + 1;
        this.loadPatients(pageNumber);
    };

    //permite procurar um paciente através do seu hsn
    search = async () => {
        //ativa a animação de load
        this.state.load=true;
        this.forceUpdate();
        const inputField = document.getElementById("search-patient");
        let hsn = inputField.value; 
        inputField.value = '';

        hsn = hsn.trim();

        //saneamento do hsn introduzido
        if((hsn.match(/^[0-9]+$/) && hsn.length===9) || hsn.length===0){
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
            //alerta caso o hsn não respeite os parâmetros definidos
            alert('1) Introduza um nº de 9 digitos para procurar por um paciente\n2) Deixe a caixa de pesquisa vazia para obter todos os pacientes');
            this.state.load=false
        }
    };

    //ativa/desativa a zona para inserir novos pacientes
    switchModal = () => {
        if(this.state.new===true){
            this.loadPatients();
            this.forceUpdate();
        }

        //apaga o valor da passsword quando o modal é fechado
        //maior segurança pois a pass não fica guardada
        randoomPass = '';
        
        this.setState(prevState => ({ new: !prevState.new }));
        
    }

    //faz logout do médico
    logout = () => {
        //remove os valores da local storage
        localStorage.removeItem('medicalLogged');
        localStorage.removeItem('docInfo');
        localStorage.removeItem('medicalLoginDate');
        //termina o intervalo que verifica se o login é valido
        clearInterval(this.state.interval);
        this.props.history.push("/MedicalLogin");
    }

    //verifica periodicamente os dados de login do médico
    checkLogin = () => {
        const medicalLoginDate = localStorage.getItem('medicalLoginDate');
        const today = new Date();
        const date = today.getTime();

        const loggedStorage = localStorage.getItem('medicalLogged');
        //verifica se existe um login efetuado
        if(!compareCipher(loggedStorage,'logged')){ 
            clearInterval(this.state.interval);
            this.logout()
        }
        //verifica se o tempo de login já tingiu 3h
        else if((date-Number(decipher(medicalLoginDate)))/1000 > 10800){
            alert('Por motivos de segurança é necessário realizar login novamente!');
            this.logout()
        } 
    }

    //permite pesquisar ao clicar no 'enter'
    handleKeyDown = (e) => {
        if (e.key === 'Enter') this.search()
    }

    //definições iniciais da classe
    componentDidMount() {
        document.body.style.overflowX = "hidden";
        this.state.interval = setInterval(this.checkLogin, 1000);
        this.loadPatients();
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
                            <div style={style} id="medical-nav">
                                {/* área de pesquisa e de criação de pacientes */}
                                <div id="left-container">
                                    <input id="search-patient" type="text" placeholder="Número de paciente" name="search" minLength='9' maxLength='9' onKeyDown={this.handleKeyDown}/>
                                    <button id="search-btn" onClick={this.search}><i className="fa fa-search"></i></button>
                                    <button id="new-patient" onClick={this.switchModal}>Novo Paciente</button>   
                                </div>
                                {/* área de logout */}
                                <div id="right-container">
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