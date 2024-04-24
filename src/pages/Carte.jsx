import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import useCartesContext from "../hooks/useCartesContext";
import useAuthContext from "../hooks/useAuthContext"
import ConnectedDevices from "../components/ConnectedDevices";
import UpdateCarte from "../components/UpdateCarte";

const Carte = () => {

    useTitle('Carte');

    const { id } = useParams();

    const { user } = useAuthContext();
    const {carte , dispatch} = useCartesContext();
    
    const [connectedDevices,setConnectedDevices] = useState('');
    const [NbElements,setNb] = useState(0);

    const [isPending,setIsPending] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{

        const fetchData = async () => {
            try{
                const res = await fetch(`/api/carte/${id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                if(!res.ok){
                    throw Error('could not fetch the data for that resource.');
                }
                const data = await res.json();

                dispatch({type:'SET_CARTE', carte:data.carte });
                setConnectedDevices(data.DevicesNames);

                setError(null);
                setIsPending(false);
            }
            catch(err){
                console.error(err);

                setError(err.message);
                setIsPending(false);
            }
        }

        if(user){
            fetchData();
        } else {
            setError('if faut se connecter !');
        }
        
    },[dispatch , user]);
    
    useEffect(()=>{
        if(carte){
            const nonZeroInputs = Object.values(carte.elementsConnectes).filter(value => value !== 0);
            const uniqueNonZeroInputs = Array.from(new Set(nonZeroInputs));
            setNb(uniqueNonZeroInputs.length);
        }
    },[carte]);
    
    
    return ( 
        <div className="cartesPages">
            <div className="cartes">
                { error && <div>{error}</div> }
                { isPending && <div>Chargement... </div> }         
                {carte && (
                    <div className="carte-details-update">
                        <h2>{carte.nom}</h2>
                        <p>
                            <strong>Adrees IP de Carte :</strong>&nbsp;
                            <span className="material-symbols-outlined">alternate_email</span>&nbsp;
                            {carte.adresse_ip}&nbsp;
                        </p>
                        <p>
                            <strong>Nombre Pins de Carte :</strong>&nbsp;
                            <span className="material-symbols-outlined">usb</span>&nbsp;
                            {carte.nb_pins}&nbsp;
                        </p>
                        <p>
                            <strong>Nombre des élements connectées :</strong>&nbsp;
                            <span className="material-symbols-outlined">cast_connected</span>&nbsp;
                            {NbElements}&nbsp;
                        </p>
                        <h3>les élemenent connectés :</h3>

                        { connectedDevices && <ConnectedDevices connectedDevices={connectedDevices}/> }

                    </div>
                )}
            </div> 

            <UpdateCarte/>        
        </div>
    );
}
 
export default Carte;