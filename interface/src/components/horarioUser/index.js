import React from 'react';
import './styles.css';
import Loader from 'react-loader-spinner';

function horarioCreateDay(dayOfWeek, medication) {
    let dias;
    window.innerWidth > 750? dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'] : dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

    const dayZone = document.getElementsByClassName('dayZone day'+dayOfWeek);
    if(dayZone.length!==0){
        for(let letter=0;letter<4;letter++){
            medication.map(e => {if(e.name===String.fromCharCode(letter+97)+'_'+dayOfWeek){

                let info = document.createElement("div");
                let spanHora = document.createElement("p");
                let horaTitle = document.createElement("strong")
                let horaTitleText = document.createTextNode("Hora: ");
                let hora = document.createTextNode(e.hour)
                let spanMeds = document.createElement("p");
                let medsTitle = document.createElement("strong");
                let medsTitleText = document.createTextNode("Medicamentos: ");
                let medsLineBreak = document.createElement("br");
                let meds = document.createTextNode(e.meds)

                horaTitle.appendChild(horaTitleText);
                spanHora.appendChild(horaTitle);
                spanHora.appendChild(hora);

                medsTitle.appendChild(medsTitleText);
                spanMeds.appendChild(medsTitle);
                spanMeds.appendChild(medsLineBreak);
                spanMeds.appendChild(meds);

                info.appendChild(spanMeds)
                info.appendChild(spanHora);
                info.classList.add('info')

                dayZone[letter].appendChild(info)

                dayZone[letter].style.backgroundColor='rgb(2, 179, 2)'}
            })
        }
    }
    
    return( 
        <div className="userSchedule" id={'dia_'+dayOfWeek}>
            <h4 className="dayOfWeek">{dias[dayOfWeek]}</h4>
            <div className={"dayZone day"+dayOfWeek}></div>
            <div className={"dayZone day"+dayOfWeek}></div>
            <div className={"dayZone day"+dayOfWeek}></div>
            <div className={"dayZone day"+dayOfWeek}></div>
        </div> 
    )
}

function horarioCreateSchedule(medication) {
    let horario = [];
    for(let i=0;i<7;i++){
        horario.push(horarioCreateDay(i, medication))
    }
    return horario;
    
}

function showSchedule(spinner) {
    if(!spinner){
        const table = document.getElementById('horarioUser');
        if(table!==null) {
            for(let i=0;i<table.childNodes.length-1;i++){
                table.childNodes[i].style.display = 'block'
            }
            table.childNodes[table.childNodes.length-1].style.display = 'none'
        }
    }    
}

const HorarioUser = ({medication, spinner}) =>
    <div id="horarioUser">
        {horarioCreateSchedule(medication, spinner)}
        <h5>Coloque o rato sobre os quadrados verdes para ver a medicação</h5>
        <Loader type="Oval" color="green" height={225.6} width={80} />
        {showSchedule(spinner)}
    </div>

export default HorarioUser;