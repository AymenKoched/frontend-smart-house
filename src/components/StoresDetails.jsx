import formatDistanceToNow from "date-fns/formatDistanceToNow";
import useStoresContext from "../hooks/useStoresContext";
import useAuthContext from "../hooks/useAuthContext";

const StoresDeatails = ({store}) => {

    const { user } = useAuthContext();
    const { dispatch } = useStoresContext();

    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }

        try{
            const res = await fetch(`/api/store/${store._id}`,{
                method: 'DELETE',
                headers: {'Authorization': `Bearer ${user.token}`}
            });
            const data = await res.json();

            dispatch({type:'DELETE_STORE' , store:data.store});

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
            const queryParams = new URLSearchParams();
            queryParams.append('pin1', store.pin1);
            queryParams.append('pin2', store.pin2);
            queryParams.append('ip',store.carte.adresse_ip);
            queryParams.append('delai',delai);

            const res = await fetch(`/api/store/up?${queryParams.toString()}`,{
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
            const queryParams = new URLSearchParams();
            queryParams.append('pin1', store.pin1);
            queryParams.append('pin2', store.pin2);
            queryParams.append('ip',store.carte.adresse_ip);
            queryParams.append('delai',delai);

            const res = await fetch(`/api/store/down?${queryParams.toString()}`,{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    }

    const handleSTOP = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }
    
        try{
            const queryParams = new URLSearchParams();
            queryParams.append('pin1', store.pin1);
            queryParams.append('pin2', store.pin2);
            queryParams.append('ip',store.carte.adresse_ip);

            const res = await fetch(`/api/store/stop?${queryParams.toString()}`,{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    }

    return (  
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
            <div className="buttons">
                <button className="error" onClick={handleSTOP}>
                    Stop
                    <span className="material-symbols-outlined">close</span>    
                </button>
            </div>
        </div>
    );
}
 
export default StoresDeatails;