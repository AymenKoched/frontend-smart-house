import { useEffect , useState } from "react";

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
import useEtagesContext from "../hooks/useEtagesContext";
import useAuthContext from "../hooks/useAuthContext";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const UpdateEtage = () => {

    const { user } = useAuthContext();
    const { etage , dispatch } = useEtagesContext();

    const [nom,setNom] = useState('');
    const [nbChambres,setNbChambres] = useState('');

    useEffect(()=>{
        if(etage){
            setNom(etage.nom);
            setNbChambres(etage.nbChambres);
        }
    },[etage]);

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let body = {nbChambres};

        setIsPending(true);
        
        let data;
        const PatchData = async () => {
            try{
                const res = await fetch(`/api/etage/${etage.id}` , {
                    method : 'PATCH' ,
                    headers: {
                        'Content-Type':'application/json' , 
                        'Authorization': `Bearer ${user.token}`
                    } , 
                    body : JSON.stringify(body)
                })
                data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                const res2 = await fetch(`/api/etage/${etage.id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const newEtage = await res2.json();

                if(!res2.ok){
                    throw new Error(newEtage.message);
                }
                
                setNbChambres(newEtage.nbChambres);

                setIsPending(false);
                setError(null);

                dispatch({type:'SET_ETAGE' , etage:newEtage});

            }
            catch(err){
                console.error(err);
                setIsPending(false);
                setError(data.message);
            }
        }

        if(user){
            PatchData();
        } else {
            setError({login:'if faut se connecter !'});
        } 
    }

    const findError = (field) => {
        if (error) {
            const items = error.includes(',') ?  error.split(',') : error;
            return  items.filter(item => item.includes(field)).join(' / ');
        }
    }

    return (  
        <form  onSubmit={handleSubmit}>
            <h3>Mettre à  jour Etage</h3>

            <label>Nom de l'Etage</label>
            <input 
                type="text" 
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={error?.nom ? 'error' : ''}
                disabled={true}
            />

            <label>Nombre de chambres</label>
            <input 
                type="number"
                onChange={(e)=>setNbChambres(e.target.value)}
                value={nbChambres}
                className={error?.nbChambres ? 'error' : ''}
            />
            {error && findError('nbChambres') && <div className="error">{findError('nbChambres')}</div> }

            { !isPending &&  <button>Mettre à jour </button>}
            { isPending &&  <button className="LoadingButthon" disabled>
                    <span>En Cours...</span>
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
 
export default UpdateEtage;