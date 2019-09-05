import React from 'react';
import './styles.css';
import male from '../../images/male.png'
import female from '../../images/female.png'
import other from '../../images/other.png'

import {cipher,compareCipher} from '../../ciphers/encryptor.js';

function goSchedule (hsn, intervalId) {
    localStorage.setItem('hsn', JSON.stringify(cipher(hsn)));
    clearInterval(intervalId);
    window.location.href = "/MedicalArea/Schedules";
}

const PatientInfo = ({ data , intervalId }) =>
    <article id="patient-info" key={data._id}>
        <div id="patient-photo-container">
            {
                data.sex===0? <img className="profile-photo" src={female} alt="icon"/> :
                data.sex===1? <img className="profile-photo" src={male} alt="icon"/> :
                              <img className="profile-photo" src={other} alt="icon"/>
            }
        </div>
        <div id="patient-data-container">
            <h3><strong>{data.firstName+' '+data.lastName}</strong></h3>
            <p><strong>Nº utente de saúde:</strong> {data.hsn}</p>
            <p><strong>Médico:</strong> {data.docName}</p>
        </div>
        <div id="schedule-btn-container">
            <button onClick={() => goSchedule(data.hsn, intervalId)} disabled={!compareCipher(JSON.parse(localStorage.getItem('docInfo')),data.docNum)}>Manage</button>
        </div>
    </article>

export default PatientInfo;