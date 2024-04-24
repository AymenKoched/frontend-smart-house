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
    const [nb_chambres,setNbChambres] = useState('');

    useEffect(()=>{
        if(etage){
            setNom(etage.nom);
            setNbChambres(etage.nb_chambres);
        }
    },[etage])

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let body = {};
        if (nom.trim() !== '') {
            body.nom = nom;
        }
        if (nb_chambres !== 0) {
            body.nb_chambres = nb_chambres;
        }

        setIsPending(true);
        
        let data;
        const PatchData = async () => {
            try{
                const res = await fetch(`/api/etage/${etage._id}` , {
                    method : 'PATCH' ,
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

                dispatch({type:'SET_ETAGE' , etage:data.etage});

            }
            catch(err){
                console.error(err);
                //console.log(data.errors);
                setIsPending(false);
                setError(data.errors);
            }
        }

        if(user){
            PatchData();
        } else {
            setError({login:'if faut se connecter !'});
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
            />
            {error?.nom && <div className="error">{error.nom}</div> }

            <label>Nombre de chambres</label>
            <input 
                type="number"
                onChange={(e)=>setNbChambres(e.target.value)}
                value={nb_chambres}
                className={error?.nb_chambres ? 'error' : ''}
            />
            {error?.nb_chambres && <div className="error">{error.nb_chambres}</div> }

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