import React, { Component } from 'react';
import api from '../../services/api';
import Loader from 'react-loader-spinner';
import CreatableSelect from 'react-select/creatable';

import './styles.css';
import User from '../../images/user.png';

import BackBtn from '../../components/backBtn';
import { stringify } from 'querystring';

const options = [
    { value: 'Ben-u-ron', label: 'Ben-u-ron' },
    { value: 'Aulin', label: 'Aulin' },
    { value: 'Brufen', label: 'Brufen' }
  ]


class Table extends Component {
    state = {
        hsn: JSON.parse(localStorage.getItem('hsn')),
        saving: 0
    }

    medication = {
        name: '',
        hour: '00h00',
        meds: []
    }

    medList = [[],[],[],[]]

    hours = ['__h__','00h00','01h00','02h00','03h00','04h00','05h00','06h00','07h00','08h00','09h00','10h00','11h00','12h00',
             '13h00','14h00','15h00','16h00','17h00','18h00','19h00','20h00','21h00','22h00','23h00'];

    getMeds = async () => {
        const list = [[],[],[],[]]
        var index=0;
        for(let line of 'abcd'){
            for(let column=0; column<7; column++){
                const response = await api.get(`/schedules/med/${'u'+this.state.hsn}/${line+'_'+column}`);
                if(response.data!==null){
                    list[index].push(response.data);
                }
            }
            index++;
        }
        this.medList=list
        this.forceUpdate();
    }

    getValuesMedSelect = async (newValue, id) => {
        const name = id.substring(2);
        const meds = [];
        const hour = document.getElementById(id).value;
        if(newValue!==null && hour !== '__h__'){
            this.state.saving = 1;
            this.forceUpdate();
            const length = newValue.length;
            for(let i=0; i<length; i++) meds.push(newValue[Object.keys(newValue)[i]].value);
            Object.assign(this.medication, {name, hour, meds});
            await api.put(`/schedules/med/${'u'+this.state.hsn}`,this.medication);
            this.state.saving = 2;
            this.forceUpdate();
        }
        else if(newValue===null){
            this.state.saving = 1;
            this.forceUpdate();
            Object.assign(this.medication, {name, hour, meds});
            await api.delete(`/schedules/med/${'u'+this.state.hsn}/${this.medication.name}`);
            this.state.saving = 2;
            this.forceUpdate();
        }
    };

    getValuesHourSelect = async (e, id) => {
        const hour = e.target.value;
        const name = id.substring(2);
        const meds = [];
        const list = document.querySelectorAll(`${'#'+id} .css-12jo7m5`);
        if(list.length!==0 && hour!=='__h__'){
            this.state.saving = 1;
            this.forceUpdate();
            const length = list.length;
            for(let i=0; i<length; i++) meds.push(list[i].textContent);
            Object.assign(this.medication, {name, hour, meds});
            await api.put(`/schedules/med/${'u'+this.state.hsn}`,this.medication);
            this.state.saving = 2;
            this.forceUpdate();
        }
        else if(hour==='__h__'){
            this.state.saving = 1;
            this.forceUpdate();
            Object.assign(this.medication, {name, hour, meds});
            await api.delete(`/schedules/med/${'u'+this.state.hsn}/${this.medication.name}`);
            this.state.saving = 2;
            this.forceUpdate();
        }
        
    };

    disable = (letter, number, hour) => {
        const index = letter.charCodeAt(0)-97;
        const length = this.medList[index].length;
        for(let i=0; i<length; i++){
            if(this.medList[index][i].hour===hour && this.medList[index][i].name===letter+'_'+number){
                return true
            }
        }
        return false
    };

    createRow = (letter) => {
        let row = [];
        for (let i = 0; i < 7; i++) {
            row.push( <td key={letter+i}>{
                        <select className="hours" id={'h_'+letter+'_'+i} onChange={e => this.getValuesHourSelect(e, 'm_'+letter+'_'+i)}> {
                            this.hours.map((value, index) => {
                                return <option key={index} selected={this.medList[letter.charCodeAt(0)-97].length!==0?this.disable(letter,i,value):false}>{value}</option>
                            })}
                        </select>}
                      </td> );
            row.push( <td key={i}>
                        <CreatableSelect isClearable={false} isMulti options={options} className="basic-multi-select" onChange={e => this.getValuesMedSelect(e, 'h_'+letter+'_'+i)} id={'m_'+letter+'_'+i}/>
                      </td> )
          }
        return row
    }

    componentDidMount() {
        this.getMeds();
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
        saving: 0
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

        const logged = localStorage.getItem('medicalLogged');
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
                        <p><span className="identifier">Número de paciente: </span>{this.state.hsn}</p>
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
    checkLogin = () => {
        const loggedStorage = localStorage.getItem('medicalLogged');
        if(loggedStorage!=='logged') this.props.history.push("/MedicalLogin");
    }

    render() {
        this.checkLogin();
        return(
            <div className="schedule">
                <BackBtn path="/MedicalArea" text="Página anterior"/>
                <h3 id="title">Horário da medicação</h3>
                <Table />
                <h3 id="title">Informação médica</h3>
                <Info />
            </div>
        )
    }
}