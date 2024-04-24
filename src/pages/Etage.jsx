import { useParams } from "react-router-dom";
import useTitle from "../hooks/useTitle";
import { useEffect, useState } from "react";
import useEtagesContext from "../hooks/useEtagesContext";
import StoresDeatails from "../components/StoresDetails";
import LampeDetails from "../components/LampeDetails";
import UpdateEtage from "../components/UpdateEtage";
import useAuthContext from "../hooks/useAuthContext";

const Etage = () => {

    useTitle('Etage');

    const { id } = useParams();

    const { user } = useAuthContext();
    const { etage , dispatch } = useEtagesContext();

    const [lampes , setLampes] = useState([]);
    const [stores , setStores] = useState([]);

    const [isPending , setIsPending] = useState(true);
    const [error , setError] = useState(null);

    useEffect(()=>{
        const fetchData = async () => {
            try{
                const res = await fetch(`/api/etage/${id}`,{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                if(!res.ok){
                    throw Error('could not fetch the data for that resource.');
                }
                const data = await res.json();

                dispatch({type:'SET_ETAGE', etage:data.etage });

                setLampes(data.lampes);
                setStores(data.stores);

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

    return (
        <div className="etagesPage">
            <div className="etages">
                { error && <div>{error}</div> }
                { isPending && <div>Chargement... </div> }  
                {etage && (
                    <div className="etage-details-update">
                        <h2>{etage.nom}</h2>
                        <p>
                            <strong>Nombre des Chambres :</strong>&nbsp;
                            <span className="material-symbols-outlined">living</span>&nbsp;
                            {etage.nb_chambres}&nbsp;
                        </p>

                        <p>
                            <strong>Nombre des Lampes :</strong>&nbsp;
                            <span className="material-symbols-outlined ">light</span>&nbsp;     
                            {etage.nb_Lampes}&nbsp;
                        </p>
                        { lampes && lampes.map((lampe)=>(
                            <LampeDetails key={lampe._id} lampe={lampe}/>
                        )) }

                        <p>
                            <strong>Nombre des Stores :</strong>&nbsp;
                            <span className="material-symbols-outlined">blinds</span>&nbsp;
                            {etage.nb_stores}&nbsp;
                        </p>
                        { stores && stores.map((store)=>(
                            <StoresDeatails key={store._id} store={store} />
                        )) }

                    </div>
                )}
            </div>

            <UpdateEtage/>
        </div>
    );
}
 
export default Etage;