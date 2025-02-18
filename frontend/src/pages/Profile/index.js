import React, { useState, useEffect } from 'react'
import { FiPower, FiTrash2 } from 'react-icons/fi'
import { Link, useHistory } from 'react-router-dom'

import './style.css'
import logo from '../../assets/logo.svg'
import api from '../../services/api'

export default function Profile() {

    const [incidents, setIncidents] = useState([])

    const ongId = localStorage.getItem('ong_id')
    const ongName = localStorage.getItem('name')

    const history = useHistory()

    useEffect(() => {

        api.get('profile', {
            headers: {
                Authorization: ongId
            }
        }).then(res => {
            setIncidents(res.data)
        })

    }, [ongId])

    function format(value){
        return Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value)
    }

    async function handleDeleteIncident(id) {
        try {
            await api.delete(`incidents/${id}`, {
                headers: {
                    Authorization: ongId
                }
            })

            setIncidents(incidents.filter(incident => incident.id !== id))
        } catch (err) {
            alert('erro ao deletar p caso, tente novamente')
        }
    }

    function handleLogout() {
        localStorage.clear()
        history.push('/')
    }

    return (
        <div className="profile-container">
            <header>
                <img src={logo} alt="be the hero" />
                <span>Bem vindo, {ongName}</span>

                <Link className="button" to="incidents/new">Cadastrar novo caso</Link>
                <button type="button" onClick={handleLogout}>
                    <FiPower size={18} color="E02041" />
                </button>

            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                {
                    incidents.map(incident => (

                        <li key={incident.id}>
                            <strong>CASO:</strong>
                            <p>{incident.title}</p>

                            <strong>DESCRIÇÃO:</strong>
                            <p>{incident.description}</p>

                            <strong>VALOR:</strong>
                            <p>{format(incident.value)}</p>

                            <button type="button" onClick={() => handleDeleteIncident(incident.id)}>
                                <FiTrash2 size={20} color="a0a0b3" />
                            </button>
                        </li>

                    ))
                }
            </ul>
        </div>
    )
}