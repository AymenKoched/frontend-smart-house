import useTitle from "../hooks/useTitle";
import useCartesContext from "../hooks/useCartesContext";
import {useEffect, useState} from "react";
import CarteDetails from "../components/CarteDetails";
import AddCarte from "../components/AddCarte";
import useAuthContext from "../hooks/useAuthContext";

const Cartes = () => {
    useTitle('Cartes');

    const { user } = useAuthContext();
    const {cartes , dispatch} = useCartesContext();

    const [isPending , setIsPending] = useState(true);
    const [error , setError] = useState(null);


    useEffect(()=>{

        const fetchData = async () => {
            try{
                const res = await fetch('/api/carte',{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                const data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                dispatch({ type: 'SET_CARTES' , cartes:data});

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
        <div className="cartesPages">
            <div className="cartes">
                <h2>Cartes :</h2>
                { error && <div>{error}</div> }
                { isPending && <div>Chargement... </div> }
                { cartes && cartes.length === 0 && <div>Pas de cartes à afficher.</div> }
                { cartes && cartes.map((carte)=>(
                    <CarteDetails key={carte.id} carte={carte}/>
                )) }
            </div>
            <AddCarte />
        </div>
    );
}
 
export default Cartes;