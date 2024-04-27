import { useEffect, useState } from "react";
import useTitle from "../hooks/useTitle";
import useEtagesContext from "../hooks/useEtagesContext";
import EtageDetails from "../components/EtageDetails";
import AddEtage from "../components/AddEtage";
import useAuthContext from "../hooks/useAuthContext";

const Etages = () => {

    useTitle('Etages');

    const { user } = useAuthContext();
    const {etages , dispatch} = useEtagesContext();

    const [isPending , setIsPending] = useState(true);
    const [error , setError] = useState(null);

    useEffect(()=>{

        const fetchData = async () => {
            try{
                const res = await fetch('/api/etage',{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                dispatch({ type: 'SET_ETAGES' , etages:data});

                setIsPending(false);
                setError(null);
            }
            catch(err){
                console.error(err);
                setIsPending(false);
                setError(err.message);
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
                <h2>Etages :</h2>
                { error && <div>{error}</div> }
                { isPending && <div>Chargement... </div> }
                { etages && etages.length === 0 && <div>Pas d'etages à afficher.</div> }
                { etages && etages.map((etage)=>(
                    <EtageDetails key={etage.id} etage={etage} />
                )) }
            </div>

            <AddEtage/>
        </div>
    );
}
 
export default Etages;