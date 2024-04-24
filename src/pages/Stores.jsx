import useTitle from "../hooks/useTitle";
import useStoresContext from "../hooks/useStoresContext";
import { useEffect, useState } from "react";
import StoresDeatails from "../components/StoresDetails";
import AddStore from "../components/AddStores";
import useAuthContext from "../hooks/useAuthContext";


const Stores = () => {

    useTitle('Stores');

    const { user } = useAuthContext();
    const { stores , dispatch } = useStoresContext();

    const [isPending , setIsPending] = useState(true);
    const [error , setError] = useState(null);

    useEffect(()=>{

        const fetchData = async () => {
            try{
                const res = await fetch('/api/store',{
                    headers: {'Authorization': `Bearer ${user.token}`},
                });
                if(!res.ok){
                    throw Error('could not fetch the data for that resource.');
                }
                const data = await res.json();

                dispatch({ type: 'SET_STORES' , stores:data.stores});

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
        <div className="storesPage">
            <div className="stores">
            <h2>Stores :</h2>
                { error && <div>{error}</div> }
                { isPending && <div>Chargement... </div> }
                { stores && stores.length === 0 && <div>Pas de stores à afficher.</div> }
                { stores && stores.map((store)=>(
                    <StoresDeatails key={store._id} store={store} />
                )) }
            </div>

            <AddStore />
        </div>
    );
}
 
export default Stores;