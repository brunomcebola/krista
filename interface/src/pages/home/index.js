import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import api from '../../services/api';
import './styles.css';
import logo from '../../images/icon.png';

var loginIntervalId = '';

class General extends Component {

    state = {
        slide: 1,
        scroll: 0
    }

    prev = () => {
        this.showSlides(--this.state.slide)
    }

    next = () => {
        this.showSlides(++this.state.slide)
    }

    slide = (slide) => {
        this.state.slide = slide;
        this.showSlides(this.state.slide)
    }

    showSlides = (slide) => {
        const slides = document.getElementsByClassName("mainInfo");

        if (slide > slides.length) {this.state.slide = 1}    
        if (slide < 1) {this.state.slide = slides.length}

        const dots = document.querySelectorAll('#mainInfo'+ this.state.slide +' .dot');        

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";  
        }

        for (let i = 0; i < dots.length; i++) {
            dots[i].style.opacity = 0.6;
        }

        slides[this.state.slide - 1].style.display = "block";  
        dots[this.state.slide - 1].style.opacity = 1;
    }

    scroll = (n, active=0, scroll=1) => {
        const element = document.querySelector("#details"+n);
        const parent = document.querySelector("#mainInfo"+n);
        const dots = document.querySelector("#dots"+n);
        const arrow = document.querySelector("#arrow"+n);
        const arrows = document.querySelector("#arrows"+n);

        if(active===1) parent.classList.remove("active");

        if(arrow.classList.contains('turnUp')){
            arrow.classList.remove('turnUp');
            dots.classList.remove('out');
            arrows.classList.remove('out');
            arrow.classList.add('turnDown');
            dots.classList.add('in');
            arrows.classList.add('in');
            setTimeout(() => {arrow.classList.remove('turnDown'); dots.classList.remove('in'); arrows.classList.remove('in');},1000)
            if(scroll) parent.scrollTo({top: 0, behavior: 'smooth'});
        } 
        else{
            arrow.classList.remove('turnDown');
            dots.classList.remove('in');
            arrows.classList.remove('in');
            arrow.classList.add('turnUp');
            dots.classList.add('out');
            arrows.classList.add('out');
            if(scroll) parent.scrollTo({ top: element.offsetTop, behavior: "smooth" });
        }
    }

    scrollControl = (n) => {        
        const element = document.querySelector("#mainInfo"+n);

        if(element.offsetHeight + element.scrollTop === element.scrollHeight && this.state.scroll === 0){ element.classList.add("active"); this.state.scroll = 1 }
        else if(element.scrollTop === 0 && this.state.scroll === 1){ element.classList.add("active"); this.state.scroll = 0 }

        if(element.classList.contains("active")){

            if(element.scrollTop>=80 && !element.childNodes[3].classList.contains("out")){
                this.scroll(n, undefined, 0);
            }
            else if(element.scrollTop<79 && element.childNodes[3].classList.contains("out")){
                this.scroll(n, undefined, 0);
            }
        }
    }

    componentDidMount() {
        this.slide(1);
    }

    render() {
        return(
            <div className="generalView">

                <div className="mainInfo fade active" id="mainInfo1" onScroll={() => this.scrollControl(1)}>

                    <div className="info">
                        <h1><strong>Venha conhecer a nossa caixa mais recente!</strong></h1>
                        <h2>Construída em madeira e com o seu design minimalista,</h2>
                        <h2>esta caixa garante-lhe todas as comodidades.</h2>
                    </div>

                    <div className="arrowContainer">
                        <div className="arrow-2" onClick={() => this.scroll(1 , 1)}><i className="fa fa-angle-down" id="arrow1"></i></div>
                        <div className="arrow-1 zoomIn"></div>
                    </div>
                    
                    <div className="arrowsContainer" id="arrows1">
                        <a className="prev" onClick={this.prev}>&#10094;</a>
                        <a className="next" onClick={this.next}>&#10095;</a>
                    </div>

                    <div className="dotContainer" id="dots1">
                        <span className="dot" onClick={() => this.slide(1)}></span> 
                        <span className="dot" onClick={() => this.slide(2)}></span> 
                        <span className="dot" onClick={() => this.slide(3)}></span> 
                    </div>
                    
                    <div className="details" id="details1">
                        <h3>Informação do produto</h3>
                        <div><span className="identifier">Dimensões:</span> 17.0cm x 9.0cm x 4.0cm</div>
                        <div><span className="identifier">Peso:</span> 100g</div>
                        <div><span className="identifier">Alimentação:</span> Pilha 9V</div>
                        <div><span className="identifier">Conectividade:</span> Wifi</div>
                        <div><span className="identifier">Capacidade:</span> Semanal</div>
                    </div>
                    
                </div>

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

class User extends Component {
    state = {
        data: this.props.data,
        setup: this.props.data,
        changed: localStorage.getItem('changed'),
        correct: true,
        loading: false,
        pass: false
    }

    formSubmit = async (e) => {
        e.preventDefault();

        this.state.loading = true;
        this.forceUpdate();

        const pass = document.getElementById('pass');
        const user = document.getElementById('user');
        const sex = document.querySelectorAll('#sex');

        if(this.state.setup.password==='krista'){
            pass.style.borderColor = 'red';
            this.state.correct = false;
        }  

        if(!isNaN(this.state.setup.username)){
            user.style.borderColor = 'red';
            this.state.correct = false;
        }  

        if(this.state.correct){
            this.state.setup.changed = 1;
            for(let i=0;i<3;i++){
                if(sex[i].checked) this.state.setup.sex = sex[i].value;
            }
            await api.post(`/patients/update/${this.state.setup.hsn}`, this.state.setup);
            localStorage.removeItem('changed');
            this.state.changed = '';
            this.forceUpdate();
        }

        this.state.correct = true;
        this.state.loading = false;
        this.forceUpdate();

    }

    componentDidMount() {
        if(this.state.changed==="false"){
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
        loginIntervalId = setInterval(this.checkLoginTime, 1000);
    }

    checkLoginTime = () => {
        const loginDate = localStorage.getItem('loginDate');
        const today = new Date();
        const date = today.getTime();

        if((date-loginDate)/1000 > 10800){
            alert('Por motivos de segurança é necessário realizar login novamente!')
            this.props.logout()
        }
    }

    togglePassword = () => {
        const eye = document.querySelector("#pass-holder .fa");
        const pass = document.querySelector('#pass');
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

    render() {
        return(
            <div className="userView">
                {this.state.changed==="false"?
                    <div className="setup">
                        <h2>Atualização de dados</h2>
                        <p>Bem vindo ao serviço <strong>Krista Health-Care</strong>!</p>
                        <p>Sendo esta a primeira vez que acede à sua área pessoal é necessário realizar uma atualização/verificação
                           dos dados para que a sua conta possa ser sempre mantida em segurança e totalmente pessoal.</p>
                        <p>Reserve, por favor, algum tempo para realizar esta ação com atenção para que lhe possamos oferecer sempre o serviço mais adequado.</p>
                        <p>Qualquer informação introduzida poderá ser posteriormente alterada em <strong>Área pessoal > Perfil</strong>. 
                        Se necessitar de ajuda não hesite em contactar-nos via e-mail <strong>(kristahealthcare@gmail.com)</strong>.</p>
                        <form onSubmit={e => this.formSubmit(e)}>
                            <p>
                                <input className="divided first" id="fname" placeholder="Primeiro Nome" type="text" required onChange={e => this.setState({setup: {...this.state.setup, firstName: e.target.value}})} value={this.state.setup.firstName}/>
                                <input className="divided" id="lname" placeholder="Último Nome" type="text" required onChange={e => this.setState({setup: {...this.state.setup, lastName: e.target.value}})} value={this.state.setup.lastName}/>
                            </p>
                            <p>
                                <input className="full" id="user" placeholder="Nome de Utilizador" type="text" required onChange={e => this.setState({setup: {...this.state.setup, username: e.target.value}})} value={this.state.setup.username}/>
                            </p>
                            <p id="pass-holder">
                                <input className="full" id="pass" placeholder="Password" type="password" required autoComplete="new-password" onChange={e => this.setState({setup: {...this.state.setup, password: e.target.value}})} value={this.state.setup.password}/>
                                <i className="fa fa-eye" onClick={this.togglePassword}></i>
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
                :
                    <General/>
                }
            </div>
        )
    }
}

class Foot extends Component {
    componentDidMount() {
        window.addEventListener('resize', () => this.forceUpdate(), false);
    }

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

export default class Home extends Component {
    state = {
        loading: false,
        data: '',
        pass: false
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
        if(response.data!==""){
            const today = new Date();
            const date = today.getTime();
            localStorage.setItem('userLogged', "logged");
            localStorage.setItem('userHsn', response.data.hsn);
            localStorage.setItem('loginDate', date);
            if(response.data.changed==0) localStorage.setItem('changed', "false");
        } 
        this.forceUpdate();
    }

    logout = () => {
        localStorage.removeItem('userLogged');
        localStorage.removeItem('changed');
        localStorage.removeItem('userHsn')
        localStorage.removeItem('loginDate');
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

    render() {
        const {loading, data} = this.state
        const userLogged = localStorage.getItem('userLogged');
        return(
            <div className="home">
                <div className="page-header">
                    <img src={logo} alt="krista logo"/>
                    <h1>Krista Health-Care</h1>
                </div>
                <div className="navigation">
                    <nav className="navbar navbar-inverse">
                        <div className="container-fluid">
                            <div className="navbar-header">
                                <a className="navbar-brand">Krista Health-Care</a>
                            </div>
                            <ul className="nav navbar-nav navbar-right">
                                <li>  
                                    <button className="medBtn"><Link to='/MedicalLogin' className="logBtn">Área médica</Link></button>
                                    {userLogged==="logged"
                                        ?<span className="logged">
                                            <div className="dropdown">
                                                <button className="dropbtn">Área pessoal <i className="fa fa-caret-down"></i></button>
                                                <div className="dropdown-content">
                                                    <a href="#">Perfil</a>
                                                    <a href="#">Horário</a>
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
                {userLogged==="logged"?
                    <User data={data} logout={this.logout}/>
                    :
                    <General/>
                }
                
                <Foot/>
            </div>
        )
    }

}