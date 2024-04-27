import formatDistanceToNow from "date-fns/formatDistanceToNow";
import useEtagesContext from "../hooks/useEtagesContext";
import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const EtageDetails = ({ etage }) => {

    const { user } = useAuthContext();
    const { dispatch } = useEtagesContext();

    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }
        
        try{
            const res = await fetch(`/api/etage/${etage.id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'DELETE_ETAGE' , etage:data[0]});

        }
        catch(err){
            console.error(err);
        }
    }

    return (  
        <div className="etage-detail">
            <h4>{etage.nom}</h4>
            <Link to={`/etages/${etage.id}`}>
                <p>
                    <strong>Nombre des Chambres :</strong>&nbsp;
                    <span className="material-symbols-outlined">living</span>&nbsp;
                    {etage.nbChambres}&nbsp;
                </p>
                <p>
                    <strong>Nombre des Lampes :</strong>&nbsp;
                    <span className="material-symbols-outlined ">light</span>&nbsp;     
                    {etage.lampes.length}&nbsp;
                </p>
                <p>
                    <strong>Nombre des Stores :</strong>&nbsp;
                    <span className="material-symbols-outlined">blinds</span>&nbsp;
                    {etage.stores.length}&nbsp;
                </p>
                <p>{formatDistanceToNow(new Date(etage.createdAt) , {addSuffix:true} )}</p>
                <span className="material-symbols-outlined delete" onClick={handleDelete} >delete</span>
            </Link>
        </div>
    );
}
 
export default EtageDetails;