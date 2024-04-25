import useCartesContext from "../hooks/useCartesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {Link} from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";
import {useMemo} from "react";

const CarteDetails = ({carte}) => {

    const { user } = useAuthContext();
    const { dispatch } = useCartesContext();

    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }

        try{
            const res = await fetch(`/api/carte/${carte.id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message);
            }

            dispatch({type:'DELETE_CARTE' , carte:data[0]});
        }
        catch(err){
            console.error(err);
        }
    }

    const NbElements = useMemo(() => {
        return carte.lampes.length + carte.stores.length;
    }, [carte])

    return (  
        <div className="carte-details">
            <h4>{carte.nom}</h4>
            <Link to={`/cartes/${carte.id}`} >
                <p>
                    <strong>Adrees IP de Carte :</strong>&nbsp;
                    <span className="material-symbols-outlined">alternate_email</span>&nbsp;
                    {carte.adresseIp}&nbsp;
                </p>
                <p>
                    <strong>Nombre Pins de Carte :</strong>&nbsp;
                    <span className="material-symbols-outlined">usb</span>&nbsp;
                    {carte.nbPins}&nbsp;
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