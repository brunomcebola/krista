import React, { Component } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';
import { StickyContainer, Sticky } from 'react-sticky';

import './styles.css';
import logo from '../../images/icon.png'
import BackBtn from '../../components/backBtn';

export default class Schedule extends Component {
    render() {
        return <BackBtn />
    }
}