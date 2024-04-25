import {useState, useEffect, useMemo} from "react";
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

    const [isPending,setIsPending] = useState(true);
    const [error,setError] = useState(null);

    useEffect(()=>{

        const fetchData = async () => {
            try{
                const res = await fetch(`/api/carte/${id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                dispatch({type:'SET_CARTE', carte:data });

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


    const NbElements = useMemo(() => {
        if(carte) return carte.lampes.length + carte.stores.length;
    }, [carte]);
    
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
                            {carte.adresseIp}&nbsp;
                        </p>
                        <p>
                            <strong>Nombre Pins de Carte :</strong>&nbsp;
                            <span className="material-symbols-outlined">usb</span>&nbsp;
                            {carte.nbPins}&nbsp;
                        </p>
                        <p>
                            <strong>Nombre des élements connectées :</strong>&nbsp;
                            <span className="material-symbols-outlined">cast_connected</span>&nbsp;
                            {NbElements}&nbsp;
                        </p>
                        <h3>les élemenent connectés :</h3>

                        { carte && <ConnectedDevices carte={carte}/> }
                    </div>
                )}
            </div> 

            <UpdateCarte/>        
        </div>
    );
}
 
export default Carte;