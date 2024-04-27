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
    const [adresseIp,setAdresse] = useState('');

    useEffect(()=>{
        if(carte){
            setNom(carte.nom);
            setAdresse(carte.adresseIp);
        }
    },[carte])

    const [isPending,setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        let body = {adresseIp};

        setIsPending(true);
        
        let data;
        const PatchData = async () => {
            try{
                const res = await fetch(`/api/carte/${carte.id}` , {
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

                const res2 = await fetch(`/api/carte/${carte.id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const newCarte = await res2.json();

                if(!res2.ok){
                    throw new Error(newCarte.message);
                }


                setAdresse(carte.adresseIp);

                setIsPending(false);
                setError(null);

                dispatch({type:'SET_CARTE' , carte:newCarte});

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
            <h3>Mettre à  jour Carte</h3>

            <label>Nom de Carte</label>
            <input 
                type="text" 
                onChange={(e)=>setNom(e.target.value)}
                value={nom}
                className={error?.nom ? 'error' : ''}
                disabled={true}
            />

            <label>Adresse IP de Carte</label>
            <input 
                type="text"
                onChange={(e)=>setAdresse(e.target.value)}
                value={adresseIp}
                className={ findError('adresseIp') ? 'error' : ''}
            />
            {error && findError('adresseIp') && <div className="error">{findError('adresseIp')}</div> }

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
        </form>
    );
}
 
export default UpdateCarte;