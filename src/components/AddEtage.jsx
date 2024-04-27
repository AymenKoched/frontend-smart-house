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
    const [nbChambres,setNbChambres] = useState();

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {nom,nbChambres};

        setIsPending(true);

        const addData = async () => {
            try{
                const res = await fetch('/api/etage' , {
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

                const res2 = await fetch(`/api/etage/${data.id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const etage = await res2.json();

                if(!res2.ok){
                    throw new Error(etage.message);
                }


                setNom('');
                setNbChambres(0);

                setIsPending(false);
                setError(null);

                dispatch({type:'CREATE_ETAGE' , etage:etage});
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
        <form className="create" onSubmit={handleSubmit}>
            <h3>Ajouter un étage</h3>

            <label>Nom d'étage : </label>
            <input 
                type="text"
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={findError('nom') ? 'error' : ''}
            />
            {error && findError('nom') && <div className="error">{findError('nom')}</div> }

            <label>Nombre de chambres : </label>
            <input 
                type="number"
                onChange={(e)=>setNbChambres((e.target.value)) }
                value={nbChambres}
                className={findError('nbChambres') ? 'error' : ''}
            />
            {error && findError('nbChambres') && <div className="error">{findError('nbChambres')}</div> }

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