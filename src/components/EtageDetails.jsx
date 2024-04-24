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
            const res = await fetch(`/api/etage/${etage._id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'DELETE_ETAGE' , etage:data.etage});

        }
        catch(err){
            console.error(err);
        }
    }

    return (  
        <div className="etage-detail">
            <h4>{etage.nom}</h4>
            <Link to={`/etages/${etage._id}`}>
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
                <p>
                    <strong>Nombre des Stores :</strong>&nbsp;
                    <span className="material-symbols-outlined">blinds</span>&nbsp;
                    {etage.nb_stores}&nbsp;
                </p>
                <p>{formatDistanceToNow(new Date(etage.createdAt) , {addSuffix:true} )}</p>
                <span className="material-symbols-outlined delete" onClick={handleDelete} >delete</span>
            </Link>
        </div>
    );
}
 
export default EtageDetails;