//REACT.JS COMPONENTS
import React, { Component } from 'react';
import api from '../../services/api';
import Loader from 'react-loader-spinner';
import CreatableSelect from 'react-select/creatable';

//COMPONENTES CRIADOS POR NOS
//ficheiro com as funcoes para encriptar a info salva no browser
import {decipher,compareCipher} from '../../ciphers/encryptor.js';
//componente que permite voltar para uma página especificada
import BackBtn from '../../components/backBtn';

//CSS STYLE SHEET DA PÁGINA
import './styles.css';

//IMAGENS
import User from '../../images/user.png';

//LISTA DOS MEDICAMENTOS
const options = [
    { value: 'Ben-u-ron', label: 'Ben-u-ron' },
    { value: 'Aulin', label: 'Aulin' },
    { value: 'Brufen', label: 'Brufen' }
]

//CRIA A TABELA ONDE SE INTRODUZ O HORÁRIO DOS MEDICAMENTOS
class Table extends Component {
    state = {
        hsn: decipher(JSON.parse(localStorage.getItem('hsn'))),
        saving: 3,
        qnt: 28
    }

    //formato da informação guardada na base de dados
    medication = {
        name: '',
        hour: '00h00',
        meds: []
    }

    //horário na base de dados
    medList = [[],[],[],[]]

    //lista dos medicamentos e horas in
    medicamentos = [[],[],[],[]]

    //lista das horas disponiveis para o horario
    hours = ['__h__','00h00','00h30','01h00','01h30','02h00','02h30','03h00','03h30','04h00','04h30','05h00','05h30',
             '06h00','06h30','07h00','07h30','08h00','08h30','09h00','09h30','10h00','10h30','11h00','11h30','12h00',
             '12h30','13h00','13h30','14h00','14h30','15h00','15h30','16h00','16h30','17h00','17h30','18h00','18h30',
             '19h00','19h30','20h00','20h30','21h00','21h30','22h00','22h30','23h00','23h30'];

    //vai buscar os medicamentos a base de dados e guarda em medList
    getMeds = async () => {
        const list = [[],[],[],[]]
        var index=0;
        for(let line of 'abcd'){
            for(let column=0; column<7; column++){
                //obtem a medicação parcela a parcela (a_0 a d_6)
                const response = await api.post(`/schedules/med/${'u'+this.state.hsn}/${line+'_'+column}`);
                if(response.data!==null){
                    //verifica os medicamentos e se algum não existir na lista então adiciona-o
                    for(let i=0;i<response.data.meds.length;i++){
                        let exists = false;
                        options.map(function(e) {if(e.value===response.data.meds[i]){exists = true}})
                        if(!exists) options.push({value: response.data.meds[i], label: response.data.meds[i]});
                    }
                    list[index].push(response.data);
                }
            }
            index++;
        }
        this.medList=list
        this.state.qnt=28
        this.state.saving=0
        this.forceUpdate();
    }

    //seleciona a hora correta para a parcela
    selectedHour = (letter, number, hour) => {
        const index = letter.charCodeAt(0)-97;
        const length = this.medList[index].length;
        for(let i=0; i<length; i++){
            //se a hora coincidir com a guardada na base de dados então é selecionada
            if(this.medList[index][i].hour===hour && this.medList[index][i].name===letter+'_'+number){
                return true
            }
        }
        return false
    };

    //insere os medicamentos na parcela da tabela
    selectMeds = (letter, number) => {
        const list = [];    //lista com os medicamentos da parcela
        const index = letter.charCodeAt(0)-97;

        //executa sempre que a página é atualizada mas não quando é carregada
        if(this.state.qnt===0){
            if(this.medicamentos[index].length!==0){
                for(let i=0; i<this.medicamentos[index].length; i++){
                    //insere em list os medicamentos correspondentes
                    if(this.medicamentos[index][i].id===letter+'_'+number){
                        for(let a=0;a<this.medicamentos[index][i].option.length;a++){
                            list.push(this.medicamentos[index][i].option[a])
                        }   
                    }
                }
            }
        }
        //apenas é executado quando a página carrega incialmente ou é recarregada
        else {
            this.state.qnt--
            const length = this.medList[index].length;
            for(let i=0; i<length; i++){
                //insere em list os medicamentos correspondentes
                if(this.medList[index][i].name===letter+'_'+number){
                    for(let a=0; a<this.medList[index][i].meds.length; a++){
                        //insere o objeto obtido da lista de medicamentos
                        list.push(options[options.map(function(e) { return e.value; }).indexOf(this.medList[index][i].meds[a])])
                    }
                }
            }
        }

        //atualiza a lista (medicamentos) com as informações presentes na tabela
        if(list.length!==0){
            if(this.medicamentos[index].length===0) this.medicamentos[index].push({id: letter+'_'+number, option: list})
            else{
                var exs = false;
                this.medicamentos[index].map(function(e) { if(e.id===letter+'_'+number) exs=true })
                //se já existirem medicamentos nesse index, introduz os novos
                if(exs){
                    let col = this.medicamentos[index].map(function(e) { return e.id} ).indexOf(letter+'_'+number)
                    this.medicamentos[index][col].option=list;
                }
                //se o index se encontrar vazio, cria um novo objeto e introduz as informações da parcela
                else{
                    this.medicamentos[index].push({id: letter+'_'+number, option: list})
                }
            }            
        }

        //devolve a lista de medicamentos da parcela
        return list      
    }

    //controla a criação de uma nova opção na lista de medicamentos (options)
    handleCreate = async (inputValue, id) => {
        const hour = document.getElementById('h_'+id).value;
        let match = false;

        //insere o novo medicamento na lista (options)
        options.push({value: inputValue, label: inputValue})
        //insere o medicamento na lista dos valores da tabela, caso a parcela já tenha medicamentos
        this.medicamentos[id[0].charCodeAt(0)-97].map(function(e){if(e.id===id){
            e.option.push({value: inputValue, label: inputValue})
            match = true;
        }})
        //cria um novo objeto no index correspondente a parcela e insere o medicamento
        if(!match){this.medicamentos[id[0].charCodeAt(0)-97].push({id, option: [{value: inputValue, label: inputValue}]})}

        //guarda os vaores da parcela na base de dados caso haja uma hora definida
        if(hour !== '__h__'){
            this.state.saving = 1;
            this.forceUpdate();
            let meds = []; //array dos medicamentos
            this.medicamentos[id[0].charCodeAt(0)-97].map(function(e){if(e.id===id){
                for(let i=0; i<e.option.length; i++) meds.push(e.option[i].value);
            }});            
            Object.assign(this.medication, {name: id, hour, meds});
            //insere a informação na base de dados
            await api.put(`/schedules/med/${'u'+this.state.hsn}`,this.medication);
            this.state.saving = 2;
        }

        this.forceUpdate()
    }

    //controla o armazenamento automatico do horário quando os inputs dos medicamentos são alterados  
    getValuesMedSelect = async (newValue, id) => {
        const name = id.substring(2);
        const meds = [];
        const hour = document.getElementById(id).value;
        var change = 0;

        //atualiza a lista de medicamentos
        if(newValue!==null){
            this.medicamentos[id[2].charCodeAt(0)-97].map(function(e) { if(e.id===name) change=1 })
            //cria um novo objeto com os dados caso o index estive vazio
            if(change===0){this.medicamentos[id[2].charCodeAt(0)-97].push({id: name, option: [newValue[0]]}) }
            //atualiza os dados guardados no respetivo index
            else if(change===1) {
                this.medicamentos[id[2].charCodeAt(0)-97][this.medicamentos[id[2].charCodeAt(0)-97].map(function(e) { return e.id; }).indexOf(name)].option=[]
                for(let i=0;i<newValue.length;i++){
                    this.medicamentos[id[2].charCodeAt(0)-97][this.medicamentos[id[2].charCodeAt(0)-97].map(function(e) { return e.id; }).indexOf(name)].option.push(newValue[i])
                }
            }
            this.forceUpdate()
        }
        else if(newValue===null){
            //remove da lista o medicamento eliminado da tabela
            for(let i = 0; i < this.medicamentos[id[2].charCodeAt(0)-97].length; i++){ 
                if ( this.medicamentos[id[2].charCodeAt(0)-97][i].id === name) {
                    this.medicamentos[id[2].charCodeAt(0)-97].splice(i, 1); 
                }
            }
            this.forceUpdate()
        }

        //guarda os vaores da parcela na base de dados caso haja uma hora e medicamnetos definidos
        if(newValue!==null && hour !== '__h__'){
            this.state.saving = 1;
            this.forceUpdate();
            const length = newValue.length;
            //cria o array dos medicamentos
            for(let i=0; i<length; i++) meds.push(newValue[Object.keys(newValue)[i]].value);
            Object.assign(this.medication, {name, hour, meds});
            await api.put(`/schedules/med/${'u'+this.state.hsn}`,this.medication);
            this.state.saving = 2;
            this.forceUpdate();
        }
        //apaga a parcela da base de dados caso deixem de haver medicamentos prescritos
        else if(newValue===null){
            this.state.saving = 1;
            this.forceUpdate();
            Object.assign(this.medication, {name, hour, meds});
            await api.delete(`/schedules/med/${'u'+this.state.hsn}/${this.medication.name}`);
            this.state.saving = 2;
            this.forceUpdate();
        }
    };

    //controla o armazenamento automatico do horário quando os inputs das horas são alterados
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

    //animação de load a guardar
    activateLoad = () => {
        this.state.saving = 1;
        this.forceUpdate();
        //termina a animação ao fim de 1 segundo
        setTimeout(() => this.setState({saving: 2}), 1000);
    }

    //cria as linhas da tabela onde se inserem os dados
    createRow = (letter) => {
        let row = [];
        for (let i = 0; i < 7; i++) {
            row.push( 
                <td key={letter+i}>{
                    //ciração do input das horas
                    <select className="hours" id={'h_'+letter+'_'+i} onChange={e => this.getValuesHourSelect(e, 'm_'+letter+'_'+i)}> {
                        this.hours.map((value, index) => {
                            return <option key={index} selected={this.medList[letter.charCodeAt(0)-97].length!==0?this.selectedHour(letter,i,value):false}>{value}</option>
                        })}
                    </select>
                }</td> );
            row.push( 
                //criação do input dos medicamentos
                <td key={i}>
                    <CreatableSelect value={this.selectMeds(letter, i)} isClearable={false} onCreateOption={e => this.handleCreate(e,letter+'_'+i)} isMulti options={options} className="basic-multi-select" onChange={e => this.getValuesMedSelect(e, 'h_'+letter+'_'+i)} id={'m_'+letter+'_'+i}/>
                </td> )
          }
        return row
    }

    //sempre que a página é carregada/re-carregada, vai buscar o horário à base de dados
    componentDidMount() {
        this.getMeds();
    }

    render() {
        const { saving } = this.state
        return(
            <div id="table">
                {saving===3?
                    /* animaçaõ de load para bloquear o horário até todas as informações terem sido obtidas */
                    <div id="secure-wait-container">
                        <Loader type="TailSpin" color="green" height={300} width={125} />
                    </div>
                :
                    <div>
                        {/* horário */}
                        <div id="message-container">
                            {saving===1?<Loader type="ThreeDots" color="green" height="30" width="30"/>:saving===2?<div id="succ">Informação salva com sucesso</div>:<div id="wait">Pronto a utilizar</div>}
                        </div>
                        <table id="horario-container">
                            <tbody id="data">
                                {/* cabçalho da tabela com os dias da semana */}
                                <tr id="data-title">
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
                                {/* criação das linhas da tabela */}
                                <tr className="dataLine">{this.createRow('a')}</tr>
                                <tr className="dataLine">{this.createRow('b')}</tr>
                                <tr className="dataLine">{this.createRow('c')}</tr>
                                <tr className="dataLine">{this.createRow('d')}</tr>
                            </tbody>
                            <tfoot id="btn-container">
                                <tr>
                                    <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
                                    <td><button id="save-btn" onClick={this.state.saving!==1?this.activateLoad:null}>Guardar</button></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                }
            </div>
            
        )
    }
} 

//CRIA A ÁREA DE INFORMAÇÃO ADICIONAL
class Info extends Component {
    state = {
        hsn: decipher(JSON.parse(localStorage.getItem('hsn'))),
        nome: '',
        sex: 0,
        age: 0,
        saving: 0
    }

    info = {
        text: ''
    }

    //obtem a informação médica e pessoal do paciente
    getInfo = async () => {
        this.state.saving = 1;
        this.forceUpdate();

        const logged = localStorage.getItem('medicalLogged');
        if(compareCipher(logged,'logged')){
            const PatientsResponse = await api.get(`patients/${this.state.hsn}`);
            const SchedulesResponse = await api.get(`schedules/info/${'u'+this.state.hsn}`);

            //informação pessoal
            const {firstName, lastName, sex, age} = PatientsResponse.data;
            //informação médica
            this.info.text = SchedulesResponse.data.text;

            this.setState({nome:firstName+' '+lastName, sex, age, saving: 0})
        }        
    }

    //atualiza o texto no local side
    updateInfoLocalSide = (value) => {
        this.info.text = value;
        this.forceUpdate();
    }

    //guarda as informações médicas na base de dados
    updateInfoDataBase = async (e) => {
        this.state.saving = 1;
        this.forceUpdate();
        this.updateInfoLocalSide(e.target.value);
        await api.put(`/schedules/info/${'u'+this.state.hsn}`, this.info);
        this.state.saving = 2;
        this.forceUpdate();
    }

    //animação de load a guardar
    activateLoad = () => {
        this.state.saving = 1;
        this.forceUpdate();
        //termina a animação ao fim de 1 segundo
        setTimeout(() => this.setState({saving: 2}), 500);
    }

    //obtem a informação quando a página e carregada/re-carregada
    componentDidMount() {
        this.getInfo();
    }

    render() {
        const {saving} = this.state
        return(
            <div id="info">
                {/* informação médica */}
                <div id="medical-info-container">
                    <div id="message-container">
                        {saving===1?<Loader type="ThreeDots" color="green" height="30" width="30"/>:saving===2?<div id="succ">Informação salva com sucesso</div>:<div id="wait">Pronto a utilizar</div>}
                    </div>
                    <textarea id="text" value={this.info.text} onChange={e => this.updateInfoDataBase(e)}></textarea>
                    <button id="save-btn" onClick={this.activateLoad}>Guardar</button>
                </div>
                {/* informação pessoal */}
                <div id="personal-info-container">
                    <div id="user-photo-container">
                        <img src={User} alt='user'/>
                    </div>
                    <div id="details-container">
                        <p><span className="identifier">Número de paciente: </span>{this.state.hsn}</p>
                        <p><span className="identifier">Nome: </span>{this.state.nome}</p>
                        <p><span className="identifier">Género: </span>{this.state.sex===0?'Feminino':this.state.sex===1?'Masculino':'Não especificado'}</p>
                        <p><span className="identifier">Idade: </span>{this.state.age}</p>
                    </div>  
                </div>
            </div>
        )
    }
}

//CLASSE CENTRAL
export default class Schedule extends Component {
    state = {
        intervalID: ''
    }

    //faz logout caso a sessão atinja o tempo limite
    logout = () => {
        localStorage.removeItem('medicalLoginDate');
        localStorage.removeItem('medicalLogged');
        localStorage.removeItem('docInfo');
        localStorage.removeItem('hsn');
        //termina o intervalo que verifica se a sessão é válida
        clearInterval(this.state.intervalID);
        this.props.history.push("/MedicalLogin");
    }

    //verifica periodicamente o login
    checkLogin = () => {
        const medicalLoginDate = localStorage.getItem('medicalLoginDate');
        const today = new Date();
        const date = today.getTime();

        const loggedStorage = localStorage.getItem('medicalLogged');
        //confirma se existe um login iniciado
        if(!compareCipher(loggedStorage,'logged')){
            this.logout();
        }
        //confirma se o ogin foi feito há menos de 3h
        else if((date-Number(decipher(medicalLoginDate)))/1000 > 10800){
            alert('Por motivos de segurança é necessário realizar login novamente!');
            this.logout();
        }
    }

    //define prametros da classe
    componentDidMount() {
        document.body.style.overflowX = "visible";
        this.state.intervalID = setInterval(this.checkLogin, 1000);
        this.forceUpdate()
    }

    render() {
        this.checkLogin();
        return(
            <div id="schedule">
                <BackBtn path="/MedicalArea" text="Página anterior" intervalID={this.state.intervalID}/>
                <h3 id="title">Horário da medicação</h3>
                <Table />
                <h3 id="title">Informação médica</h3>
                <Info />
            </div>
        )
    }
}