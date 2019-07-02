import React, { Component } from 'react';
import Cookies from 'universal-cookie';
import api from '../../services/api';
import Loader from 'react-loader-spinner';
import CreatableSelect from 'react-select/creatable';

import './styles.css';
import User from '../../images/user.png';

import BackBtn from '../../components/backBtn';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]


class Table extends Component {
    state = {
        saving: 0
    }

    hours = ['__h__','00h00','01h00','02h00','03h00','04h00','05h00','06h00','07h00','08h00','09h00','10h00','11h00','12h00',
             '13h00','14h00','15h00','16h00','17h00','18h00','19h00','20h00','21h00','22h00','23h00'];

    getValuesSelect = (newValue, aaa) => {
        if(newValue!==null && document.getElementById(aaa).value !== '__h__'){
            this.state.saving = 1;
            this.forceUpdate();
            const length = newValue.length;
            console.group();
            for(let i=0; i<length; i++) console.log(newValue[Object.keys(newValue)[i]].value);
            console.groupEnd();
            this.state.saving = 2;
            this.forceUpdate();
        }
    };

    createRow = (letter) => {
        let row = [];
        for (let i = 0; i < 7; i++) {
            row.push( <td key={letter+i}>{<select className="hours" id={'h_'+letter+'_'+i}> {this.hours.map((value, index) => {return <option key={index}>{value}</option>})}</select>}</td> );
            row.push( <td key={i}><CreatableSelect isClearable={false} isMulti options={options} className="basic-multi-select" onChange={e => this.getValuesSelect(e, 'h_'+letter+'_'+i)} id={'m_'+letter+'_'+i}/></td> )
          }
        return row
    }

    render() {
        const { saving } = this.state
        return(
            <div id="table">
                <div id="loader">
                    {saving===1?<Loader type="ThreeDots" color="green" height="30" width="30"/>:saving===2?<div id="succ">Informação salva com sucesso</div>:<div id="wait">Em espera...</div>}
                </div>
                <table>
                    <tbody>
                        <tr id="header">
                            <td>Hora</td>
                            <td>Segunda</td>
                            <td>Hora</td>
                            <td>Terça</td>
                            <td>Hora</td>
                            <td>Quarta</td>
                            <td>Hora</td>
                            <td>Quinta</td>
                            <td>Hora</td>
                            <td>Sexta</td>
                            <td>Hora</td>
                            <td>Sábado</td>
                            <td>Hora</td>
                            <td>Domingo</td>
                        </tr>
                        <tr>{this.createRow('a')}</tr>
                        <tr>{this.createRow('b')}</tr>
                        <tr>{this.createRow('c')}</tr>
                        <tr>{this.createRow('d')}</tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                            <td><button className="save">Guardar</button></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        )
    }
} 

class Info extends Component {
    state = {
        hsn: JSON.parse(localStorage.getItem('hsn')),
        nome: '',
        sex: 0,
        age: 0,
        saving: 0,
        cookies : this.props.cookies
    }

    info = {
        text: ''
    }

    componentDidMount() {
        this.getInfo();
    }

    getInfo = async () => {
        this.state.saving = 1;
        this.forceUpdate();

        const logged = this.state.cookies.get('medicalLogged');
        if(logged==='logged'){
            const PatientsResponse = await api.get(`patients/${this.state.hsn}`);
            const {firstName, lastName, sex, age} = PatientsResponse.data;

            const SchedulesResponse = await api.get(`schedules/info/${'u'+this.state.hsn}`);

            this.info.text = SchedulesResponse.data.text
            this.setState({nome:firstName+' '+lastName, sex, age, saving: 0})
        }        
    }

    updateState = (value) => {
        this.info.text = value;
        this.forceUpdate();
    }

    updateInfo = async (e) => {
        this.state.saving = 1;
        this.forceUpdate();
        this.updateState(e.target.value);
        await api.put(`/schedules/info/${'u'+this.state.hsn}`, this.info);
        this.state.saving = 2;
        this.forceUpdate();
    }

    activateLoad = () => {
        this.state.saving = 1;
        this.forceUpdate();
        setTimeout(() => this.setState({saving: 2}), 500);
    }

    render() {
        const {saving} = this.state
        return(
            <div id="info">
                <div id="loader">
                    {saving===1?<Loader type="ThreeDots" color="green" height="30" width="30"/>:saving===2?<div id="succ">Informação salva com sucesso</div>:<div id="wait">Em espera...</div>}
                </div>
                <textarea id="text" value={this.info.text} onChange={e => this.updateInfo(e)}></textarea>
                <button className="save" onClick={this.activateLoad}>Guardar</button>
                <div id="personalInfo">
                    <div id="userPic-container">
                        <img src={User}/>
                    </div>
                    <div id="detail">
                        <p><span className="identifier">Numero de paciente: </span>{this.state.hsn}</p>
                        <p><span className="identifier">Nome: </span>{this.state.nome}</p>
                        <p><span className="identifier">Género: </span>{this.state.sex===0?'Não especificado':this.state.sex===1?'Masculino':'Feminino'}</p>
                        <p><span className="identifier">Idade: </span>{this.state.age}</p>
                    </div>  
                </div>
            </div>
        )
    }
}

export default class Schedule extends Component {
    state = {
        cookies: new Cookies()
    }

    checkLogin = () => {
        const loggedCookie = this.state.cookies.get('medicalLogged');
        const loggedStorage = localStorage.getItem('medicalLogged');
        if(loggedCookie!=='logged' || loggedStorage!=='logged') this.props.history.push("/MedicalArea");
    }

    render() {
        this.checkLogin();
        return(
            <div className="schedule">
                <BackBtn path="/MedicalArea" text="Página anterior"/>
                <h3 id="title">Horário da medicação</h3>
                <Table />
                <h3 id="title">Informação médica</h3>
                <Info cookies={this.state.cookies}/>
            </div>
        )
    }
}