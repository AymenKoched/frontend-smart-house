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
    const [etage,setEtage] = useState('');
    const [carte,setCarte] = useState('');
    const [pin,setPin] = useState('');

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = { nom , etage , carte , pin };
        //console.log(body);

        setIsPending(true);

        let data;
        const addData = async () => {
            try{
                const res = await fetch('/api/lampe/' , {
                    method : 'POST' ,
                    headers: {
                        'Content-Type':'application/json' ,
                        'Authorization': `Bearer ${user.token}`
                    } , 
                    body : JSON.stringify(body)
                })
                data = await res.json();
                console.log(data);
                
                if(!res.ok){
                    throw new Error('could not fetch the data for that resource.');
                }
                
                setNom('');
                setEtage('');
                setCarte('');
                setPin('');

                setIsPending(false);
                setError(null);

                dispatch({type:'CREATE_LAMPE' , lampe:data.lampe});

            }
            catch(err){
                console.error(err);
                console.log(data.errors);
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
            <h3>Ajouter une Lampe</h3>

            <label>Nom de Lampe</label>
            <input 
                type="text" 
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={error?.nom ? 'error' : ''}
            />
            {error?.nom && <div className="error">{error.nom}</div> }


            <label>Etage</label>
            <select name="etage" id="etage" value={etage} onChange={(e)=>setEtage(e.target.value)} className={error?.etage ? 'error' : ''}>
                <option value=""></option>
                { etages && etages.map(etage => (
                    <option key={etage._id} value={etage._id}>{etage.nom}</option>
                ))}
            </select>
            {error?.etage && <div className="error">{error.etage}</div> }


            <label>Carte</label>
            <select name="carte" id="carte" value={carte} onChange={(e)=>setCarte(e.target.value)} className={error?.carte ? 'error' : ''}>
                <option value=""></option>
                { cartes && cartes.map(carte => (
                    <option key={carte._id} value={carte._id}>{carte.nom}</option>
                ))}
            </select>
            {error?.carte && <div className="error">{error.carte}</div> }


            <label>Pin dans Carte</label>
            <input 
                type="number"
                onChange={(e)=>setPin(e.target.value)}
                value={pin}
                className={error?.pin ? 'error' : ''}
            />
            {error?.pin && <div className="error">{error.pin}</div> }


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