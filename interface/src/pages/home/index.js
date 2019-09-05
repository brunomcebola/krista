//REACT.JS COMPONENTS
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';
import Loader from 'react-loader-spinner';

//COMPONENTS CREATED BY US
import api from '../../services/api';   //ligação ao servidor
import {cipher,decipher,compareCipher} from '../../ciphers/encryptor.js';   //ficheiro com as funcoes p/ encriptar a info salva no browser
import HorarioUser from '../../components/horarioUser';     //componente que fornece o horário do utilizador

//PAGE CSS STYLE SHEET
import './styles.css';

//IMAGES
import logo from '../../images/icon.png';   //logotipo do projeto
import male from '../../images/male.png';   //icon usuario masculino
import female from '../../images/female.png';   //icon usuario feminino
import other from '../../images/other.png';     //icon usuario default 

//ID DO INTERVALO QUE VERIFICA O LOGIN
var loginIntervalId = '';

//PÁGINA INICIAL DO SITE
class General extends Component {
    state = {
        slide: 1,
        scroll: 0
    }

    //permite recuar para o slide anterior
    prev = () => {
        this.showSlides(--this.state.slide)
    }

    //permite avançar para o slide seguinte
    next = () => {
        this.showSlides(++this.state.slide)
    }

    //permite mostra um determinado slide
    slide = (slide) => {
        this.state.slide = slide;
        this.showSlides(this.state.slide)
    }

    //controla o display dos slides
    showSlides = (slide) => {
        const slides = document.getElementsByClassName("mainInfo");

        if (slide > slides.length) {this.state.slide = 1}    
        if (slide < 1) {this.state.slide = slides.length}

        const dots = document.querySelectorAll('#mainInfo'+ this.state.slide +' .dot');        

        for (let i = 0; i < slides.length; i++) {   //esconde todos os slides
            slides[i].style.display = "none";  
        }

        for (let i = 0; i < dots.length; i++) {     //coloca todos os pontos indicadores do slide em stand-by
            dots[i].style.opacity = 0.6;
        }

        slides[this.state.slide - 1].style.display = "block";  //faz display do slide desejado
        dots[this.state.slide - 1].style.opacity = 1;   //realça o ponto correspondente ao slide desejado
    }

    //cria a animação do scroll dentro dos slides
    scroll = (n, active=0, scroll=1) => {
        const element = document.querySelector("#details"+n);
        const parent = document.querySelector("#mainInfo"+n);
        const dots = document.querySelector("#dots"+n);
        const arrow = document.querySelector("#arrow"+n);
        const arrows = document.querySelector("#arrows"+n);

        if(active===1) parent.classList.remove("active");

        if(arrow.classList.contains('turnUp')) {     //se estiver no fundo do slide controla o scroll de volta para o topo
            arrow.classList.remove('turnUp');
            dots.classList.remove('out');
            arrows.classList.remove('out');
            arrow.classList.add('turnDown');
            dots.classList.add('in');
            arrows.classList.add('in');
            setTimeout(() => {arrow.classList.remove('turnDown'); dots.classList.remove('in'); arrows.classList.remove('in');},1000)
            if(scroll) parent.scrollTo({top: 0, behavior: 'smooth'});
        } 
        else {                                       //se estiver no topo do slide controla o scroll para baixo
            arrow.classList.remove('turnDown');
            dots.classList.remove('in');
            arrows.classList.remove('in');
            arrow.classList.add('turnUp');
            dots.classList.add('out');
            arrows.classList.add('out');
            if(scroll) parent.scrollTo({ top: element.offsetTop, behavior: "smooth" });
        }
    }

    //controla o scroll com rato ou touch
    scrollControl = (n) => {        
        const element = document.querySelector("#mainInfo"+n);

        if(element.offsetHeight + element.scrollTop === element.scrollHeight && this.state.scroll === 0){ element.classList.add("active"); this.state.scroll = 1 }
        else if(element.scrollTop === 0 && this.state.scroll === 1){ element.classList.add("active"); this.state.scroll = 0 }

        if(element.classList.contains("active")){

            if(element.scrollTop>=80 && !element.childNodes[3].classList.contains("out")){  //controla o scroll para baixo
                this.scroll(n, undefined, 0);
            }
            else if(element.scrollTop<79 && element.childNodes[3].classList.contains("out")){   //controla o scroll para cima
                this.scroll(n, undefined, 0);
            }
        }
    }

    //faz as inicializações da classe
    componentDidMount() {
        this.slide(1);  //coloca o slide 1 visivel

        let userMenuButton = document.getElementsByClassName('dropdown')[0];
        if(userMenuButton!==undefined){
            let moldura = document.getElementsByClassName('generalView')[0];
            //adiciona um controlador para quando o rato se encontra em cima do menu de usuario
            userMenuButton.addEventListener("mouseover", (event) => {
                if(moldura!==undefined){
                    for(let i=0; i<3; i++){
                        moldura.childNodes[i].style.zIndex = -1     //os slides passam para segundo plano
                    }
                }           
            })
            //adiciona um controlador para quando o rato sai de cima do menu de usuario
            userMenuButton.addEventListener("mouseout", (event) => {
                if(moldura!==undefined){
                    for(let i=0; i<3; i++){
                        moldura.childNodes[i].style.zIndex = 1      //os slides voltam para a frente
                    }
                }              
            })
        }
    }

    render() {
        return(
            <div className="generalView">
                {/* SLIDE 1 */}
                <div className="mainInfo fade active" id="mainInfo1" onScroll={() => this.scrollControl(1)}>

                    {/* texto intrdução */}
                    <div className="info">
                        <h1><strong>Venha conhecer a nossa caixa mais recente!</strong></h1>
                        <h2>Construída em madeira e com o seu design minimalista,</h2>
                        <h2>esta caixa garante-lhe todas as comodidades.</h2>
                    </div>

                    {/* seta com base circular no centro do slide */}
                    <div className="arrowContainer">
                        <div className="arrow-2" onClick={() => this.scroll(1 , 1)}><i className="fa fa-angle-down" id="arrow1"></i></div>
                        <div className="arrow-1 zoomIn"></div>
                    </div>
                    
                    {/* setas para trocar de slide */}
                    <div className="arrowsContainer" id="arrows1">
                        <a className="prev" onClick={this.prev}>&#10094;</a>    {/* seta esquerda */}
                        <a className="next" onClick={this.next}>&#10095;</a>    {/* seta direita */}
                    </div>

                    {/* pontos indicadores do slide */}
                    <div className="dotContainer" id="dots1">
                        <span className="dot" onClick={() => this.slide(1)}></span> 
                        <span className="dot" onClick={() => this.slide(2)}></span> 
                        <span className="dot" onClick={() => this.slide(3)}></span> 
                    </div>
                    
                    {/* informação detalhada do produto */}
                    <div className="details" id="details1">
                        <h3>Informação do produto</h3>
                        <div><span className="identifier">Dimensões:</span> 17.0cm x 9.0cm x 4.0cm</div>
                        <div><span className="identifier">Peso:</span> 100g</div>
                        <div><span className="identifier">Alimentação:</span> Pilha 9V</div>
                        <div><span className="identifier">Conectividade:</span> Wifi</div>
                        <div><span className="identifier">Capacidade:</span> Semanal</div>
                    </div>
                    
                </div>

                {/* SLIDE 2 */}
                <div className="mainInfo fade" id="mainInfo2">

                    <div className="arrowContainer">
                        <div className="arrow-2" onClick={() => this.scroll(2)}><i className="fa fa-angle-down" id="arrow2"></i></div>
                        <div className="arrow-1 zoomIn"></div>
                    </div>

                    <div className="arrowsContainer" id="arrows2">
                        <a className="prev" onClick={this.prev}>&#10094;</a>
                        <a className="next" onClick={this.next}>&#10095;</a>
                    </div>

                    <div className="dotContainer" id="dots2">
                        <span className="dot" onClick={() => this.slide(1)}></span> 
                        <span className="dot" onClick={() => this.slide(2)}></span> 
                        <span className="dot" onClick={() => this.slide(3)}></span> 
                    </div>

                </div>

                {/* SLIDE 3 */}
                <div className="mainInfo fade" id="mainInfo3">

                    <div className="arrowContainer">
                        <div className="arrow-2" onClick={() => this.scroll(3)}><i className="fa fa-angle-down" id="arrow3"></i></div>
                        <div className="arrow-1 zoomIn"></div>
                    </div>

                    <div className="arrowsContainer" id="arrows3">
                        <a className="prev" onClick={this.prev}>&#10094;</a>
                        <a className="next" onClick={this.next}>&#10095;</a>
                    </div>

                    <div className="dotContainer" id="dots3">
                        <span className="dot" onClick={() => this.slide(1)}></span> 
                        <span className="dot" onClick={() => this.slide(2)}></span> 
                        <span className="dot" onClick={() => this.slide(3)}></span> 
                    </div>
                    
                </div>
            </div>
        )
    }
}

//ÁREA DE UTILIZADOR
class User extends Component {
    state = {
        data: this.props.data,
        setup: this.props.data,
        changed: localStorage.getItem('changed') || '',
        correct: true,
        loading: false,
        pass: false,
        userMenu: this.props.userMenu,
        changeData: false,
        spinner: true
    }

    medication = [];

    //FUNÇÕES DA ÁREA DE SETUP

    //verifica os dados inseridos pelo user e atualiza as informações na base de dados
    setupFormSubmit = async (e) => {
        e.preventDefault();

        this.state.loading = true;  //ativa a imagem de load no botao
        this.forceUpdate();

        const pass = document.getElementById('pass-holder');
        const user = document.getElementById('user');
        const sex = document.querySelectorAll('#sex');

        //pedido para a api para verificar se existe um user com o username indicado
        const response = await api.post('/patients/checkUser', {user: this.state.setup.username});

        pass.style.borderColor = '#5B5F97';
        user.style.borderColor = '#5B5F97';

        //saneamento da password
        if(this.state.setup.password==='krista' || !this.state.setup.password.match(/^[A-Za-z_-]+$/)){
            pass.style.borderColor = 'red';
            this.state.correct = false;
        }  

        //saneamento do username
        if(!this.state.setup.username.match(/^[A-Za-z_-]+$/) || response.data===false){
            user.style.borderColor = 'red';
            this.state.correct = false;
        }  

        //atualiza os dados se tudo estiver correto
        if(this.state.correct){
            this.state.setup.changed = 1;
            for(let i=0;i<3;i++){
                if(sex[i].checked) this.state.setup.sex = sex[i].value;
            }
            await api.post(`/patients/update/${this.state.setup.hsn}`, this.state.setup);
            localStorage.removeItem('changed');
            this.state.changed = '';
            this.forceUpdate();
            this.horarioGetMeds();
        }

        this.state.correct = true;
        this.state.loading = false;
        this.forceUpdate();

    }

    //alterna a visibilade da password
    setupTogglePassword = () => {
        const eye = document.querySelector("#pass-holder .fa");
        const pass = document.querySelector('#pass');
        if(this.state.pass) {                       //torna invisivel
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            pass.type = "password";
            this.state.pass = false
        }
        else {                                  //torna visivel
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
            pass.type = "text";
            this.state.pass = true
        }   
    }


    //FUNÇÕES DA ÁREA DO PERFIL

    //verifica os dados inseridos pelo user e atualiza as informações na base de dados
    profileSubmitData = async () => {
        this.state.loading = true;
        this.forceUpdate();

        const pass = document.getElementById('pass-container');
        const user = document.getElementById('user');

        //pedido para a api para verificar se existe um user com o username indicado
        let response = await api.post('/patients/checkUser', {user: this.state.setup.username});
        if(this.state.setup.username === this.state.data.username) response.data=true;

        pass.style.borderColor = '#5B5F97';
        user.style.borderColor = '#5B5F97';

        //saneamento da password
        if(this.state.setup.password==='krista' || !this.state.setup.password.match(/^[A-Za-z_-]+$/)){
            pass.style.borderColor = 'red';
            this.state.correct = false;
        }  

        //saneamento do username
        if(!this.state.setup.username.match(/^[A-Za-z_-]+$/) || response.data===false){
            user.style.borderColor = 'red';
            this.state.correct = false;
        }  

        //atualiza os dados se tudo estiver correto
        if(this.state.correct){
            await api.post(`/patients/update/${this.state.setup.hsn}`, this.state.setup);
            this.profileGetData()
            this.forceUpdate();
            this.profileControlButtons()
        }

        this.state.correct = true;
        this.state.loading = false;
        this.forceUpdate();
    }    

    //obtem a informação do user
    profileGetData = async () => {
        let hsn = localStorage.getItem('userHsn');
        const resp = await api.get(`patients/${decipher(hsn)}`);
        this.state.setup = resp.data;
        this.state.data = resp.data;
        const radio = document.querySelectorAll("input[type='radio']");
        switch(this.state.setup.sex){
            case 0:
                radio[0].checked=true;
                break;
            case 1:
                radio[1].checked=true;
                break;
            default:
                radio[2].checked=true;
                break;
        } 
        this.forceUpdate()
    }

    //controla os botões de 'atualizar informação', 'cancelar' e 'guardar'
    profileControlButtons = () => {
        if(!this.state.changeData) {                                            //torna possivel atualizar os dados
            document.getElementById('cancelar').style.display = 'initial';
            document.getElementById('guardar').style.display = 'initial';
            document.getElementById('atualizar').style.display = 'none';
            document.getElementById('pass-container').style.backgroundColor = '#fff';
            document.getElementById('profile-eye').style.cursor = 'pointer'
        }
        else {                                                                  //cancela as alterações efetuadas e bloqueia os inputs
            document.getElementById('cancelar').style.display = 'none';
            document.getElementById('guardar').style.display = 'none';
            document.getElementById('atualizar').style.display = 'initial';
            document.getElementById('pass-container').style.backgroundColor = 'rgb(235,235,228)';
            document.getElementById('profile-eye').style.cursor = 'default';
            if(this.state.pass) this.profileTogglePassword()
            this.state.setup = this.state.data;
            const radio = document.querySelectorAll("input[type='radio']");
            switch(this.state.setup.sex){
                case 0:
                    radio[0].checked=true;
                    break;
                case 1:
                    radio[1].checked=true;
                    break;
                default:
                    radio[2].checked=true;
                    break;
            } 
        }
        this.state.changeData = !this.state.changeData;
        
        this.forceUpdate();
    }

    //alterna a visibilade da password
    profileTogglePassword = () => {
        const eye = document.querySelector("#pass-container .fa");
        const pass = document.querySelector('#pass');
        if(this.state.pass) {                       //torna invisivel
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            pass.type = "password";
            this.state.pass = false
        }
        else {                                  //torna visivel
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
            pass.type = "text";
            this.state.pass = true
        }   
    }


    //FUNÇÕES DA ÁREA DO HORÁRIO

    //obtem o horario da medicação do user
    horarioGetMeds = async () => {        
        for(let day=0;day<7;day++){
            for(let letter=0;letter<4;letter++){
                //pedido para a api para retornar a hora e os meds de um determinado slot do horário (a_0 a d_6)
                let resp = await api.post(`/schedules/med/u${decipher(localStorage.getItem('userHsn'))}/${String.fromCharCode(letter+97)}_${day}`);
                if(resp.data!==null){
                    let {_id, ...data} = resp.data;
                    this.medication.push(data)  //informação salva na variavel medication
                }
            }
        }

        this.state.spinner = false
        
        this.forceUpdate()
    }

    //FUNÇÕES RELATIVAS À CLASSE NO GERAL

    //verifica os dados de login do user
    checkLoginTime = () => {
        const userLoginDate = localStorage.getItem('userLoginDate');
        const today = new Date();
        const date = today.getTime();
        const userLogged = localStorage.getItem('userLogged') || '';

        if(compareCipher(userLogged,'logged')){     //verifica se existe um login efetuado
            if((date-Number(decipher(userLoginDate)))/1000 > 10800){        //verifica o tempo de login (tem de ser inferior a 3h)
                alert('Por motivos de segurança é necessário realizar login novamente!')
                this.props.logout()
            }
        }
        else{this.props.logout()}
        
    }

    //controla a mudança de argumentos passados a classe
    componentWillReceiveProps({userMenu}) {
        this.setState({userMenu})
        if(compareCipher(userMenu,'horario')){      //executa quando o user clica em 'Área pessoal' > 'Horário'
            this.horarioGetMeds();

            let userMenuButton = document.getElementsByClassName('dropdown')[0];
            if(userMenuButton!==undefined){
                let dayZoneA6 = document.getElementsByClassName('dayZone day6')
                //adiciona um controlador para quando o rato se encontra em cima do menu de usuario
                userMenuButton.addEventListener("mouseover", (event) => {
                    if(dayZoneA6[0]!==undefined){dayZoneA6[0].style.zIndex = -1}     //o horário passa para segundo plano      
                })
                //adiciona um controlador para quando o rato sai de cima do menu de usuario
                userMenuButton.addEventListener("mouseout", (event) => {
                    if(dayZoneA6[0]!==undefined){dayZoneA6[0].style.zIndex = 'auto'}     //o horário volta para a frente              
                })
            }
        }
        else if(compareCipher(userMenu,'perfil')){      //executa quando o user clica em 'Área pessoal' > 'Perfil'
            this.profileGetData();
            this.forceUpdate()
        }
    }

    componentDidMount() {
        if(compareCipher(this.state.changed,'false')){         //executa quando o user recarrega a página e se encontra na área de setup
            const radio = document.querySelectorAll("input[type='radio']");
            switch(this.state.setup.sex){
                case 0:
                    radio[0].checked=true;
                    break;
                case 1:
                    radio[1].checked=true;
                    break;
                default:
                    radio[2].checked=true;
                    break;
            } 
        }
        else if(compareCipher(localStorage.getItem('userMenu'),'horario')){     //executa quando o user recarrega a página e se encontra no 'Horário'
            this.horarioGetMeds();

            let userMenuButton = document.getElementsByClassName('dropdown')[0];
            if(userMenuButton!==undefined){
                let dayZoneA6 = document.getElementsByClassName('dayZone day6')
                //adiciona um controlador para quando o rato se encontra em cima do menu de usuario
                userMenuButton.addEventListener("mouseover", (event) => {
                    if(dayZoneA6[0]!==undefined){dayZoneA6[0].style.zIndex = -1}    //o horário passa para segundo plano       
                })
                //adiciona um controlador para quando o rato sai de cima do menu de usuario
                userMenuButton.addEventListener("mouseout", (event) => {
                    if(dayZoneA6[0]!==undefined){dayZoneA6[0].style.zIndex = 'auto'}    //o horário volta para a frente                   
                })
            }
        }
        else if(compareCipher(localStorage.getItem('userMenu'),'perfil')){      //executa quando o user recarrega a página e se encontra no 'Perfil'
            this.profileGetData();
            this.forceUpdate()
        }

        loginIntervalId = setInterval(this.checkLoginTime, 1000);       //guarda o ID do intervalo que verifica o login 
    }

    render() {
        if(compareCipher(this.state.changed,'false') && !compareCipher(this.state.userMenu,'default')){
            alert('É necessário atualizar a sua informação primeiro');
            localStorage.setItem('userMenu', cipher('default'));
            this.props.parentUpdate()
        }

        return(
            <div className="userView">
                {compareCipher(this.state.changed,'false')?
                    <div className="setup">
                        <h2>Atualização de dados</h2>
                        <p>Bem vindo ao serviço <strong>Krista Health-Care</strong>!</p>
                        <p>Sendo esta a primeira vez que acede à sua área pessoal é necessário realizar uma atualização/verificação
                           dos dados para que a sua conta possa ser sempre mantida em segurança e totalmente pessoal.</p>
                        <p>Reserve, por favor, algum tempo para realizar esta ação com atenção para que lhe possamos oferecer sempre o serviço mais adequado.</p>
                        <p>Qualquer informação introduzida poderá ser posteriormente alterada em <strong>Área pessoal > Perfil</strong>. 
                        Se necessitar de ajuda não hesite em contactar-nos via e-mail <strong>(kristahealthcare@gmail.com)</strong>.</p>
                        <form onSubmit={e => this.setupFormSubmit(e)}>
                            <p>
                                <input className="divided first" id="fname" placeholder="Primeiro Nome" type="text" required onChange={e => this.setState({setup: {...this.state.setup, firstName: e.target.value}})} value={this.state.setup.firstName}/>
                                <input className="divided" id="lname" placeholder="Último Nome" type="text" required onChange={e => this.setState({setup: {...this.state.setup, lastName: e.target.value}})} value={this.state.setup.lastName}/>
                            </p>
                            <p>
                                <input className="full" id="user" placeholder="Nome de Utilizador" type="text" required onChange={e => this.setState({setup: {...this.state.setup, username: e.target.value}})} value={this.state.setup.username}/>
                            </p>
                            <p id="pass-holder">
                                <input className="full" id="pass" placeholder="Password" type="password" required autoComplete="new-password" onChange={e => this.setState({setup: {...this.state.setup, password: e.target.value}})} value={this.state.setup.password}/>
                                <i className="fa fa-eye" onClick={this.setupTogglePassword}></i>
                            </p>
                            <p>Idade</p>
                            <p>
                                <input id="age" type="number" required onChange={e => this.setState({setup: {...this.state.setup, age: e.target.value}})} value={this.state.setup.age}/>
                            </p>
                            <p>Género</p>
                            <p>
                                <span className="options"><input type="radio" name="sex" id="sex" value='0' required/> Feminino</span>
                                <span className="options"><input type="radio" name="sex" id="sex" value='1'/> Masculino</span>
                                <span className="options"><input type="radio" name="sex" id="sex" value='2'/> Outro</span>
                            </p>
                            <button type="submit">{this.state.loading?<Loader type="ThreeDots" color='rgb(56, 59, 94)' height="10" width="30"/>:'Atualizar'}</button>
                        </form>
                    </div>
                :compareCipher(this.state.userMenu,'perfil')?
                    <div className="perfil">
                        <div id="data-container">
                            <div id="photo-container">
                                <img src={this.state.setup.sex===0?female:this.state.setup.sex===1?male:other} alt='user'/>
                            </div>
                            <div id="information-container">
                                <label for="nome">Primeiro nome:</label><br/>
                                <input disabled={!this.state.changeData} id="first-name" type="text" onChange={e => this.setState({setup: {...this.state.setup, firstName: e.target.value}})} value={this.state.setup.firstName}/><br/>
                                <label for="nome">Último Nome:</label><br/>
                                <input disabled={!this.state.changeData} id="last-name" type="text" onChange={e => this.setState({setup: {...this.state.setup, lastName: e.target.value}})} value={this.state.setup.lastName}/><br/>
                                <label for="user">Username:</label><br/>
                                <input disabled={!this.state.changeData} id="user" type="text" onChange={e => this.setState({setup: {...this.state.setup, username: e.target.value}})} value={this.state.setup.username}/><br/>
                                <label for="pass">Password:</label><br/>
                                <span id="pass-container"><input disabled={!this.state.changeData} id="pass" type="password" onChange={e => this.setState({setup: {...this.state.setup, password: e.target.value}})} value={this.state.setup.password}/>
                                <i className="fa fa-eye" id="profile-eye" onClick={!this.state.changeData?null:this.profileTogglePassword}></i></span><br/>
                                <label for="age">Idade:</label><br/>
                                <input disabled={!this.state.changeData} id="age" type="number" onChange={e => this.setState({setup: {...this.state.setup, age: e.target.value}})} value={this.state.setup.age}/><br/>
                                <label>Género:</label><br/>                            
                                <input disabled={!this.state.changeData} type="radio" name="gender" id="male" value='0' onChange={() => {this.state.setup.sex=0; this.forceUpdate()}}/>
                                <label className="radioLabel" for="male">Feminino</label>
                                <input disabled={!this.state.changeData} type="radio" name="gender" id="female" value='1' onChange={() => {this.state.setup.sex=1; this.forceUpdate()}}/>
                                <label className="radioLabel" for="female">Masculino</label>
                                <input disabled={!this.state.changeData} type="radio" name="gender" id="other" value='2' onChange={() => {this.state.setup.sex=2; this.forceUpdate()}}/>
                                <label className="radioLabel" for="other">Outro</label>                         
                            </div>
                        </div>
                        <div id="button-container">
                            <button id="atualizar" onClick={this.profileControlButtons}>Atualizar informação</button>
                            <button id="cancelar" onClick={this.profileControlButtons}>Cancelar</button>
                            <button id="guardar" onClick={this.profileSubmitData}>{this.state.loading?<Loader type="ThreeDots" color='rgb(56, 59, 94)' height="10" width="30"/>:'Guardar'}</button>
                        </div>
                    </div>
                :compareCipher(this.state.userMenu,'horario')?
                    <HorarioUser medication={this.medication} spinner={this.state.spinner}/>
                :
                    <General/>
                }
            </div>
        )
    }
}

//RODAPÉ DA PÁGINA
class Foot extends Component {
    render() {
        return(
            <footer className="siteFooter">
                <div className="container">
                    <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <h6>Sobre</h6>
                        <p className="text-justify">
                            KRISTA HEALTH-CARE foi criada no âmbito de uma competição universitária 
                            e teve como objetivo a criação de um sistema para auxiliar os pacientes na toma
                            da medicação. Neste contexto, desenvolvemos o site (<i>kristahealthcare.netlify.com</i>)
                            e criámos a caixa, que se pode visualizar acima, que facilita a tomada diária da medicação.</p>
                    </div>

                    <div className={window.innerWidth < 875?"col-sm-12":"col-xs-6 col-md-3"}>
                        <iframe id="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.1718215239475!2d-9.140893684677636!3d38.73681917959569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1933a24aa81f17%3A0x880c7c731a54423!2sInstituto+Superior+T%C3%A9cnico!5e0!3m2!1sen!2spt!4v1565711555277!5m2!1sen!2spt"></iframe>
                        {window.innerWidth < 875?<p className="exists"><i className="fa fa-map-marker"></i> Av. Rovisco Pais 1, 1049-001 Lisboa</p>:null}
                    </div>

                    <div className={window.innerWidth < 875?"col-sm-12":"col-xs-6 col-md-3"}>
                        <h6>Contactos</h6>
                        <ul className="footer-links">
                            <li><i className="fa fa-phone-square" aria-hidden="true"></i> 96xxxxxxx</li>
                            <li><i className="fa fa-envelope" aria-hidden="true"></i> kristahealthcare@gmail.com</li>
                            <li><br/></li>
                            <li>{window.innerWidth < 875?null:<p className="exists"><i className="fa fa-map-marker"></i> Av. Rovisco Pais 1, 1049-001 Lisboa</p>}</li>
                        </ul>
                    </div>
                    </div>
                </div>

                <hr className="line"/>

                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-sm-6 col-xs-12">
                            <p className="copyright-text">Copyright &copy; 2019 All Rights Reserved by KRISTA INC.
                            </p>
                        </div>

                        <div className="col-md-4 col-sm-6 col-xs-12">
                            <ul className="social-icons">
                                <li><a className="facebook" href="#" target="_blank"><i className="fa fa-facebook"></i></a></li>
                                <li><a className="twitter" href="#" target="_blank"><i className="fa fa-twitter"></i></a></li>
                                <li><a className="instagram" href="https://www.instagram.com/kristahealthcare/" target="_blank"><i className="fa fa-instagram"></i></a></li>
                                <li><a className="linkedin" href="#" target="_blank"><i className="fa fa-linkedin"></i></a></li>   
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
}

//CLASSE CENTRAL
export default class Home extends Component {
    state = {
        loading: false,
        data: '',
        pass: false,
        userMenu: localStorage.getItem('userMenu') || cipher('default')
    }

    login = async () => {
        this.state.loading = true;
        this.forceUpdate();
        let user = document.querySelector('#user');
        let pass = document.querySelector('#pass');
        const response = await api.post('/patients/log', {user: user.value, pass: pass.value});
        this.state.loading = false;
        this.setState({data: response.data})
        user.value="";
        pass.value="";
        if(response.data!==null){
            const today = new Date();
            const date = today.getTime();
            localStorage.setItem('userLogged', cipher('logged'));
            localStorage.setItem('userHsn', cipher(response.data.hsn));
            localStorage.setItem('userLoginDate', cipher(date.toString()));
            if(response.data.changed===0) localStorage.setItem('changed', cipher('false'));            
        } 
        this.forceUpdate();
    }

    logout = () => {
        localStorage.removeItem('userLogged');
        localStorage.removeItem('changed');
        localStorage.removeItem('userHsn')
        localStorage.removeItem('userLoginDate');
        localStorage.setItem('userMenu',cipher('default'))
        this.state.userMenu = cipher('default');
        clearInterval(loginIntervalId);
        this.forceUpdate();
    }

    togglePassword = () => {
        const eye = document.querySelector("#pass-holder .fa");
        const pass = document.querySelector('#pass-holder #pass');
        if(this.state.pass) {
            eye.classList.remove('fa-eye-slash');
            eye.classList.add('fa-eye');
            pass.type = "password";
            this.state.pass = false
        }
        else {
            eye.classList.remove('fa-eye');
            eye.classList.add('fa-eye-slash');
            pass.type = "text";
            this.state.pass = true
        }   
    }

    userChange = (option) => {
        localStorage.setItem('userMenu', cipher(option))
        this.setState({userMenu: localStorage.getItem('userMenu')})
        this.forceUpdate();
    }

    componentDidMount() {
        if(localStorage.getItem('userMenu') === null) localStorage.setItem('userMenu', cipher('default'))
        window.addEventListener('resize', () => this.forceUpdate(), false);
    }

    parentUpdate = () => {
        this.setState({userMenu: localStorage.getItem('userMenu')})
    }

    render() {
        const {loading, data} = this.state
        const userLogged = localStorage.getItem('userLogged') || '';
        return(
            <div className="home">
                <div className="page-header">
                    <img src={logo} alt="krista logo"/>
                    <h1>Krista Health-Care</h1>
                </div>
                <StickyContainer>
                    <Sticky>
                    {({ style }) => 
                        <div style={style} className="navigation">
                            <nav className="navbar navbar-inverse">
                                <div className="container-fluid">
                                    <ul className="nav navbar-nav navbar-right">
                                        <li>  
                                            <button className="medBtn"><Link to='/MedicalLogin' className="logBtn">Área médica</Link></button>
                                            {compareCipher(userLogged,'logged')
                                                ?<span className="logged">
                                                    <div className="dropdown">
                                                        <button className="dropbtn">Área pessoal <i className="fa fa-caret-down"></i></button>
                                                        <div className="dropdown-content">
                                                            {compareCipher(this.state.userMenu,'default')?null:<p onClick={() => this.userChange('default')}>Página inicial</p>}
                                                            {compareCipher(this.state.userMenu,'perfil')?null:<p onClick={() => this.userChange('perfil')}>Perfil</p>}
                                                            {compareCipher(this.state.userMenu,'horario')?null:<p onClick={() => this.userChange('horario')}>Horário</p>}
                                                        </div>
                                                    </div> 
                                                    <button onClick={this.logout} id="logout">Logout</button>
                                                </span>
                                                :<span className="logging">
                                                    <input placeholder="username" type="text" id="user" autoComplete="on"></input>
                                                    <span id="pass-holder"><input placeholder="password" type="password" id="pass" autoComplete="on"></input>
                                                    <i className="fa fa-eye" onClick={this.togglePassword}></i></span>
                                                    <button onClick={this.login} id="login">{loading?<Loader type="ThreeDots" color='rgb(56, 59, 94)' height="10" width="30"/>:'Login'}</button>
                                                </span>
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    }
                    </Sticky>
                    {compareCipher(userLogged,'logged')?<User data={data} logout={this.logout} userMenu={this.state.userMenu} parentUpdate={this.parentUpdate}/>:<General/>}
                    <Foot/>
                </StickyContainer>
            </div>
        )
    }

}