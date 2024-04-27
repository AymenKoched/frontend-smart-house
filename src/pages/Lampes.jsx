import { useState , useEffect } from "react";
import useLampesContext from "../hooks/useLampesContext";
import useTitle from "../hooks/useTitle";
import LampeDetails from "../components/LampeDetails";
import AddLampe from "../components/AddLampe";
import useAuthContext from "../hooks/useAuthContext";

const Lampes = () => {
    
    useTitle('Lampes');

    const { user } = useAuthContext();
    const { lampes , dispatch } = useLampesContext();

    const [isPending , setIsPending] = useState(true);
    const [error , setError] = useState(null);

    useEffect(()=>{

        const fetchData = async () => {
            try{
                const res = await fetch('/api/lampe',{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                dispatch({ type: 'SET_LAMPES' , lampes:data});

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
        <div className="lampesPages">
            <div className="lampes">
                <h2>Lampes :</h2>
                { error && <div>{error}</div> }
                { isPending && <div>Chargement... </div> }
                { lampes && lampes.length === 0 && <div>Pas de lampes à afficher.</div> }
                { lampes && lampes.map((lampe)=>(
                    <LampeDetails key={lampe.id} lampeId={lampe.id}/>
                )) }
            </div>

            <AddLampe/>
        </div>
    );
}
 
export default Lampes;