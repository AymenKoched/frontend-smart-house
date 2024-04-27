import formatDistanceToNow from "date-fns/formatDistanceToNow";
import useStoresContext from "../hooks/useStoresContext";
import useAuthContext from "../hooks/useAuthContext";
import {useEffect, useState} from "react";

const StoresDeatails = ({storeId}) => {

    const { user } = useAuthContext();
    const { dispatch } = useStoresContext();

    const [store, setStore] = useState();

    const fetchStore = async () => {
        if(!user){
            return;
        }
        try{
            const res = await fetch(`/api/store/${storeId}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'SET_STORE' , store:data});

            setStore(data);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        fetchStore();
    }, []);


    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }

        try{
            const res = await fetch(`/api/store/${store.id}`,{
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${user.token}`}
            });
            const data = await res.json();

            dispatch({type:'DELETE_STORE' , store:data[0]});
        }
        catch(err){
            console.error(err);
        }
    }

    const handleUP = async (e,delai) => {
        e.preventDefault();

        if(!user){
            return
        }
    
        try{
            const res = await fetch(`/api/store/toggle/up/${delai}/${store.id}`,{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    }

    const handleDOWN = async (e,delai) => {
        e.preventDefault();
    
        if(!user){
            return
        }

        try{
            const res = await fetch(`/api/store/toggle/down/${delai}/${store.id}`,{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    }

    return store ? (
        <div className="store-detail">
            <h4>{store.nom}</h4>
            <p>
                <strong>Etage de Store :</strong>&nbsp;
                <span className="material-symbols-outlined icon">apartment</span>&nbsp;
                {store.etage.nom}&nbsp;
            </p>
            <p>
                <strong>Carte de Store :</strong>&nbsp;
                <span className="material-symbols-outlined icon">memory</span>&nbsp;   
                {store.carte.nom}&nbsp;
            </p>
            <p>
                <strong>Pin1 de Store :</strong>&nbsp;
                <span className="material-symbols-outlined">usb</span>&nbsp;
                {store.pin1}&nbsp;
            </p>
            <p>
                <strong>Pin2 de Store :</strong>&nbsp;
                <span className="material-symbols-outlined">usb</span>&nbsp;
                {store.pin2}&nbsp;
            </p>
            <p>{formatDistanceToNow(new Date(store.createdAt) , {addSuffix:true} )}</p>
            <span className="material-symbols-outlined delete" onClick={handleDelete} >delete</span>
            <div className="buttons">
                <button className="info" onClick={(e) => handleUP(e,5000)}>
                    UP
                    <span className="material-symbols-outlined">keyboard_arrow_up</span>    
                </button>
                <button className="info" onClick={(e) => handleUP(e,15000)}>
                    UP All
                    <span className="material-symbols-outlined">north</span>
                </button>
                <button className="info" onClick={(e) => handleDOWN(e,5000)}>
                    Down
                    <span className="material-symbols-outlined">keyboard_arrow_down</span>    
                </button>
                <button className="info" onClick={(e) => handleDOWN(e,15000)}>
                    Down All
                    <span className="material-symbols-outlined">south</span>
                </button>
            </div>
        </div>
    ) : <></>;
}
 
export default StoresDeatails;