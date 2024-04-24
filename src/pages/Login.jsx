import { useState } from "react";
import useTitle from "../hooks/useTitle";
import useAuthContext from "../hooks/useAuthContext";

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const Login = () => {
    
    useTitle('Log-in');

    const { dispatch } = useAuthContext();

    const [nom,setNom] = useState('');
    const [mdp , setMdp] = useState('');

    const [isHashed, setIsHashed] = useState(true); // State for hashing password

    const [isPending , setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = { nom , mdp };

        setIsPending(true);
        
        let data ;
        const login = async () => {
            try{
                const res = await fetch('/api/user/login', {
                    method : 'POST' ,
                    headers: {'Content-Type':'application/json'} , 
                    body : JSON.stringify(body)
                });
                data = await res.json();
                
                if(!res.ok){
                    throw new Error('could not fetch the data for that resource.');
                }

                setIsPending(false);
                setError(null);

                setNom('');
                setMdp('');

                localStorage.setItem('user', JSON.stringify({token : data.token, nom : data.user.nom}));

                const user = { nom : data.user.nom , token : data.token};
                dispatch({type:'LOGIN' , user});
            }
            catch(err){
                console.error(err);
                setIsPending(false);
                setError(data.errors);
            }
        }
        login();
    }

    const togglePasswordHashing = () => {
        setIsHashed(!isHashed);
    };

    return ( 
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log In</h3>

            <label>UserName :</label>
            <input 
                type="text"
                onChange={(e)=> setNom(e.target.value)}
                value={nom}
                className={error?.nom ? 'error' : ''}
            />
            {error?.nom && <div className="error">{error.nom}</div> }

            <div className="input-container">
                <label>Mot de Passe :</label>
                <div className="input-wrapper">
                    <input 
                        type={isHashed ? 'password' : 'text'} // Toggle password input type
                        onChange={(e)=>setMdp(e.target.value)}
                        value={mdp}
                        className={error?.mdp ? 'error' : ''}
                        autoComplete="off"
                    />
                    <div onClick={togglePasswordHashing} className="visibility-icon">
                        {isHashed ? (
                            <i><span className="material-symbols-outlined">visibility</span></i>
                            ) : (
                            <i><span className="material-symbols-outlined">visibility_off</span></i>
                        )}
                    </div>
                </div>
                {error?.mdp && <div className="error">{error.mdp}</div> }
            </div>

            { !isPending &&  <button>Se Connecter</button>}
            { isPending &&  <button className="LoadingButthon" disabled>
                    <span>En Cours...</span>
                    <lord-icon
                        src="https://cdn.lordicon.com/nxooksci.json"
                        trigger="loop"
                        colors="primary:#ffffff"
                        state="loop"
                        style={{width:"25px" , height:"25px"}}>
                    </lord-icon>
                </button>
            }

        </form>
    );
}
 
export default Login;