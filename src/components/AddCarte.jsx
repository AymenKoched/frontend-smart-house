import { useState } from "react";
import useCartesContext from "../hooks/useCartesContext";
import useAuthContext from "../hooks/useAuthContext";

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const AddCarte = () => {

    const { user } = useAuthContext();
    const { dispatch } = useCartesContext();

    const [nom,setNom] = useState('');
    const [nbPins,setNbPins] = useState();
    const [adresseIp,setAdresse] = useState('');

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {nom,nbPins,adresseIp};

        setIsPending(true);

        const addData = async () => {
            try{
                const res = await fetch('/api/carte' , {
                    method : 'POST' ,
                    headers: {
                        'Content-Type':'application/json' ,
                        'Authorization': `Bearer ${user.token}`
                    } , 
                    body : JSON.stringify(body)
                })
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                const res2 = await fetch(`/api/carte/${data.id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const carte = await res2.json();

                if(!res2.ok){
                    throw new Error(carte.message);
                }

                dispatch({type:'SET_CARTE', carte:carte });
                
                setNom('');
                setNbPins('');
                setAdresse('');

                setIsPending(false);
                setError(null);

                dispatch({type:'CREATE_CARTE' , carte:carte});

            }
            catch(err){
                console.error(err);
                setIsPending(false);
                setError(err.message);
            }
        }
        
        if(user){
            addData();
        } else {
            setError({login:'if faut se connecter !'});
        }
    }

    const findError = (field) => {
        if (error) {
            const items = error.split(',');
            return  items.filter(item => item.includes(field)).join(' / ');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h3>Ajouter une Carte</h3>

            <label>Nom de Carte</label>
            <input 
                type="text" 
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={findError('nom') ? 'error' : ''}
            />
            {error && findError('nom') && <div className="error">{findError('nom')}</div> }

            <label>Nombre des pins</label>
            <input 
                type="number"
                onChange={(e)=>setNbPins(e.target.value)}
                value={nbPins}
                className={findError('nbPins') ? 'error' : ''}
            />
            {error && findError('nbPins') && <div className="error">{findError('nbPins')}</div> }

            <label>Adresse IP de Carte</label>
            <input 
                type="text"
                onChange={(e)=>setAdresse(e.target.value)}
                value={adresseIp}
                className={findError('adresseIp') ? 'error' : ''}
            />
            {error && findError('adresseIp') && <div className="error">{findError('adresseIp')}</div> }

            { !isPending &&  <button>Ajoute Carte</button>}
            { isPending &&  <button className="LoadingButthon" disabled>
                    <span>Ajout En Cours...</span>
                    <lord-icon
                        src="https://cdn.lordicon.com/nxooksci.json"
                        trigger="loop"
                        colors="primary:#ffffff"
                        state="loop"
                        style={{width:"25px" , height:"25px"}}>
                    </lord-icon>
                </button>
            }
        </form>
    );
}
 
export default AddCarte;