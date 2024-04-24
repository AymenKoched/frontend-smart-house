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
    const [nb_pins,setNbPins] = useState('');
    const [adresse_ip,setAdresse] = useState('');

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {nom,nb_pins,adresse_ip};

        setIsPending(true);

        let data;
        const addData = async () => {
            try{
                const res = await fetch('/api/carte/' , {
                    method : 'POST' ,
                    headers: {
                        'Content-Type':'application/json' ,
                        'Authorization': `Bearer ${user.token}`
                    } , 
                    body : JSON.stringify(body)
                })
                data = await res.json();
                //console.log(data);
                
                if(!res.ok){
                    throw new Error('could not fetch the data for that resource.');
                }
                
                setNom('');
                setNbPins('');
                setAdresse('');

                setIsPending(false);
                setError(null);

                dispatch({type:'CREATE_CARTE' , carte:data.carte});

            }
            catch(err){
                console.error(err);
                //console.log(data.errors);
                setIsPending(false);
                setError(data.errors);
            }
        }
        
        if(user){
            addData();
        } else {
            setError({login:'if faut se connecter !'});
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
                className={error?.nom ? 'error' : ''}
            />
            {error?.nom && <div className="error">{error.nom}</div> }

            <label>Nombre des pins</label>
            <input 
                type="number"
                onChange={(e)=>setNbPins(e.target.value)}
                value={nb_pins}
                className={error?.nb_pins ? 'error' : ''}
            />
            {error?.nb_pins && <div className="error">{error.nb_pins}</div> }

            <label>Adresse IP de Carte</label>
            <input 
                type="text"
                onChange={(e)=>setAdresse(e.target.value)}
                value={adresse_ip}
                className={error?.adresse_ip ? 'error' : ''}
            />
            {error?.adresse_ip && <div className="error">{error.adresse_ip}</div> }

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

            { error && error.login && <div className="error">{error.login}</div> }   

        </form>
    );
}
 
export default AddCarte;