import useCartesContext from "../hooks/useCartesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { Link } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const CarteDetails = ({carte}) => {

    const { user } = useAuthContext();
    const { dispatch } = useCartesContext();

    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }

        try{
            const res = await fetch(`/api/carte/${carte._id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'DELETE_CARTE' , carte:data.carte});

        }
        catch(err){
            console.error(err);
        }
    }

    const nonZeroInputs = Object.values(carte.elementsConnectes).filter(value => value !== 0);
    const uniqueNonZeroInputs = Array.from(new Set(nonZeroInputs));
    const NbElements = uniqueNonZeroInputs.length;

    return (  
        <div className="carte-details">
            <h4>{carte.nom}</h4>
            <Link to={`/cartes/${carte._id}`} >
                <p>
                    <strong>Adrees IP de Carte :</strong>&nbsp;
                    <span className="material-symbols-outlined">alternate_email</span>&nbsp;
                    {carte.adresse_ip}&nbsp;
                </p>
                <p>
                    <strong>Nombre Pins de Carte :</strong>&nbsp;
                    <span className="material-symbols-outlined">usb</span>&nbsp;
                    {carte.nb_pins}&nbsp;
                </p>
                <p>
                    <strong>Nombre des élements connectées:</strong>&nbsp;
                    <span className="material-symbols-outlined">cast_connected</span>&nbsp;
                    {NbElements}&nbsp;
                </p>
                <p>{formatDistanceToNow(new Date(carte.createdAt) , {addSuffix:true} )}</p>
                <span className="material-symbols-outlined delete" onClick={handleDelete}>delete</span>
            </Link>
        </div>
    );
}
 
export default CarteDetails;