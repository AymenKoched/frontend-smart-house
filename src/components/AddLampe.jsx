import { useState } from "react";
import useEtagesContext from "../hooks/useEtagesContext";
import useCartesContext from "../hooks/useCartesContext";
import useLampesContext from "../hooks/useLampesContext";

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
import useAuthContext from "../hooks/useAuthContext";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const AddLampe = () => {

    const {etages} = useEtagesContext();
    const {cartes} = useCartesContext();
    const { dispatch } = useLampesContext();
    const { user } = useAuthContext();

    const [nom,setNom] = useState('');
    const [etageId,setEtageId] = useState('');
    const [carteId,setCarteId] = useState('');
    const [pin,setPin] = useState();

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = { nom , etageId , carteId , pin };

        setIsPending(true);

        const addData = async () => {
            try{
                const res = await fetch('/api/lampe' , {
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

                const res2 = await fetch(`/api/lampe/${data.id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const lampe = await res2.json();

                if(!res2.ok){
                    throw new Error(lampe.message);
                }
                
                setNom('');
                setEtageId('');
                setCarteId('');
                setPin(0);

                setIsPending(false);
                setError(null);

                dispatch({type:'CREATE_LAMPE' , lampe:lampe});

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
            <h3>Ajouter une Lampe</h3>

            <label>Nom de Lampe</label>
            <input 
                type="text" 
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={findError('nom') ? 'error' : ''}
            />
            {error && findError('nom') && <div className="error">{findError('nom')}</div> }

            <label>Etage</label>
            <select className={findError('etageId') ? 'error' : ''} name="etage" id="etage" value={etageId} onChange={(e)=>setEtageId(e.target.value)}>
                <option value=""></option>
                { etages && etages.map(etage => (
                    <option key={etage.id} value={etage.id}>{etage.nom}</option>
                ))}
            </select>
            {error && findError('etageId') && <div className="error">{findError('etageId')}</div> }

            <label>Carte</label>
            <select className={findError('carteId') ? 'error' : ''} name="carte" id="carte" value={carteId} onChange={(e)=>setCarteId(e.target.value)} >
                <option value=""></option>
                { cartes && cartes.map(carte => (
                    <option key={carte.id} value={carte.id}>{carte.nom}</option>
                ))}
            </select>
            {error && findError('carteId') && <div className="error">{findError('carteId')}</div> }

            <label>Pin dans Carte</label>
            <input 
                type="number"
                onChange={(e)=>setPin(e.target.value)}
                value={pin}
                className={findError('pin') ? 'error' : ''}
            />
            {error && findError('pin') && <div className="error">{findError('pin')}</div> }

            { !isPending &&  <button>Ajoute Lampe</button>}
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

            { error && error.login && <div className="error">{error.login}</div> }   
            
        </form>
    );
}
 
export default AddLampe;