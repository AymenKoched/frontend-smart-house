import { useEffect , useState } from "react";
import useCartesContext from "../hooks/useCartesContext";

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
import useAuthContext from "../hooks/useAuthContext";
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const UpdateCarte = () => {

    const { user } = useAuthContext();
    const { carte , dispatch } = useCartesContext();

    const [nom,setNom] = useState('');
    const [adresse_ip,setAdresse] = useState('');

    useEffect(()=>{
        if(carte){
            setNom(carte.nom);
            setAdresse(carte.adresse_ip);
        }
    },[carte])

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let body = {};
        if (nom.trim() !== '') {
            body.nom = nom;
        }
        if (adresse_ip.trim() !== '') {
            body.adresse_ip = adresse_ip;
        }

        setIsPending(true);
        
        let data;
        const PatchData = async () => {
            try{
                const res = await fetch(`/api/carte/${carte._id}` , {
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
                setAdresse('');

                setIsPending(false);
                setError(null);

                dispatch({type:'SET_CARTE' , carte:data.carte});

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
            <h3>Mettre à  jour Carte</h3>

            <label>Nom de Carte</label>
            <input 
                type="text" 
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={error?.nom ? 'error' : ''}
            />
            {error?.nom && <div className="error">{error.nom}</div> }

            <label>Adresse IP de Carte</label>
            <input 
                type="text"
                onChange={(e)=>setAdresse(e.target.value)}
                value={adresse_ip}
                className={error?.adresse_ip ? 'error' : ''}
            />
            {error?.adresse_ip && <div className="error">{error.adresse_ip}</div> }

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
 
export default UpdateCarte;