import useAuthContext from "../hooks/useAuthContext";
import useLampesContext from "../hooks/useLampesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const LampeDetails = ({ lampe }) => {

    const { user } = useAuthContext();
    const { dispatch } = useLampesContext();

    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }
        
        try{
            const res = await fetch(`/api/lampe/${lampe._id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'DELETE_LAMPE' , lampe:data.lampe});

        }
        catch(err){
            console.error(err);
        }
    }

    const handleON = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }

        try{
            const queryParams = new URLSearchParams();
            queryParams.append('pin', lampe.pin);
            queryParams.append('ip',lampe.carte.adresse_ip);

            const res = await fetch(`/api/lampe/on?${queryParams.toString()}`,{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    }

    const handleOFF = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }
    
        try{
            const queryParams = new URLSearchParams();
            queryParams.append('pin', lampe.pin);
            queryParams.append('ip',lampe.carte.adresse_ip);

            const res = await fetch(`/api/lampe/off?${queryParams.toString()}`,{
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
        <div className="lampe-detail">
            <h4>{lampe.nom}</h4>
            <p>
                <strong>Etage de lampe :</strong>&nbsp;
                <span className="material-symbols-outlined icon">apartment</span>&nbsp;
                {lampe.etage.nom}&nbsp;
            </p>
            <p>
                <strong>Carte de Lampe :</strong>&nbsp;
                <span className="material-symbols-outlined icon">memory</span>&nbsp;   
                {lampe.carte.nom}&nbsp;
            </p>
            <p>
                <strong>Pin de Lampe :</strong>&nbsp;
                <span className="material-symbols-outlined">usb</span>&nbsp;
                {lampe.pin}&nbsp;
            </p>
            <p>{formatDistanceToNow(new Date(lampe.createdAt) , {addSuffix:true} )}</p>
            <span className="material-symbols-outlined delete" onClick={handleDelete} >delete</span>
            <div className="buttons">
                <button className="info" onClick={handleON}>
                    ON
                    <span className="material-symbols-outlined">flash_on</span>
                </button>
                <button className="error" onClick={handleOFF}>
                    OFF
                    <span className="material-symbols-outlined">flash_off</span>
                </button>
            </div>
        </div>
    );
}
 
export default LampeDetails;