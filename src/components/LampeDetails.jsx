import useAuthContext from "../hooks/useAuthContext";
import useLampesContext from "../hooks/useLampesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import {da} from "date-fns/locale";
import {useEffect, useState} from "react";

const LampeDetails = ({ lampeId }) => {

    const { user } = useAuthContext();
    const { dispatch } = useLampesContext();

    const [lampe, setLampe] = useState();

    const fetchLampe = async () => {
        if(!user){
            return;
        }
        try{
            const res = await fetch(`/api/lampe/${lampeId}`,{
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'SET_LAMPE' , lampe:data});

            setLampe(data);
        }
        catch(err){
            console.error(err);
        }
    }

    useEffect(() => {
        fetchLampe();
    }, []);

    const handleDelete = async (e) => {
        e.preventDefault();

        if(!user){
            return
        }

        try{
            const res = await fetch(`/api/lampe/${lampe.id}`,{
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                } ,
            });
            const data = await res.json();

            dispatch({type:'DELETE_LAMPE' , lampe:data[0]});

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
            const res = await fetch(`/api/lampe/toggle/on/${lampe.id}`,{
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
            const res = await fetch(`/api/lampe/toggle/off/${lampe.id}`,{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();
            console.log(data);
        }
        catch(err){
            console.error(err);
        }
    }

    return lampe ? (
        <div className="lampe-detail">
            <h4>{lampe.nom}</h4>
            <p>
                <strong>Etage de lampe :</strong>&nbsp;
                <span className="material-symbols-outlined icon">apartment</span>&nbsp;
                {lampe.etage.nom && lampe.etage.nom}&nbsp;
            </p>
            <p>
                <strong>Carte de Lampe :</strong>&nbsp;
                <span className="material-symbols-outlined icon">memory</span>&nbsp;
                {lampe.carte.nom && lampe.carte.nom}&nbsp;
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
    ) : <></> ;
}
 
export default LampeDetails;