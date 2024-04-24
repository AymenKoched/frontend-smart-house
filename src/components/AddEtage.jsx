import { useState } from "react";
import useEtagesContext from "../hooks/useEtagesContext";
import useAuthContext from "../hooks/useAuthContext";


import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const AddEtage = () => {

    const { user } = useAuthContext();
    const { dispatch } = useEtagesContext();

    const [nom,setNom] = useState('');
    const [nb_chambres,setNbChambres] = useState('');

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {nom,nb_chambres};

        setIsPending(true);

        let data;
        const addData = async () => {
            try{
                const res = await fetch('/api/etage/' , {
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
                setNbChambres('');

                setIsPending(false);
                setError(null);

                dispatch({type:'CREATE_ETAGE' , etage:data.etage});

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
        <form className="create" onSubmit={handleSubmit}>
            <h3>Ajouter un étage</h3>

            <label>Nom d'étage : </label>
            <input 
                type="text"
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={error?.nom ? 'error' : ''}
            />
            {error?.nom && <div className="error">{error.nom}</div> }

            <label>Nombre de chambres : </label>
            <input 
                type="number"
                onChange={(e)=>setNbChambres(e.target.value)}
                value={nb_chambres}
                className={error?.nb_chambres ? 'error' : ''}
            />
            {error?.nb_chambres && <div className="error">{error.nb_chambres}</div> }

            { !isPending &&  <button>Ajoute Etage</button>}
            { isPending &&  <button className="LoadingButthon" disabled>
                <span>Ajout En Cours...</span>
                <lord-icon
                    src="https://cdn.lordicon.com/nxooksci.json"
                    trigger="loop"
                    colors="primary:#ffffff"
                    state="loop"
                    style={{width:"25px" , height:"25px"}}>
                </lord-icon></button>
            }
            
            {  error && error.login && <div className="error">{error.login}</div> }   

        </form>
    );
}
 
export default AddEtage;