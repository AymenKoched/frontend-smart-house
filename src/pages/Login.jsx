import {useEffect, useState} from "react";
import useTitle from "../hooks/useTitle";
import useAuthContext from "../hooks/useAuthContext";

import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const Login = () => {
    
    useTitle('Log-in');

    const { dispatch } = useAuthContext();

    const [username,setUserName] = useState('');
    const [password , setPassword] = useState('');

    const [isHashed, setIsHashed] = useState(true);

    const [isPending , setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = { username , password };

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
                    throw new Error(data.message);
                }

                setIsPending(false);
                setError(null);

                setUserName('');
                setPassword('');

                localStorage.setItem('user', JSON.stringify({token : data.token, username : data.username}));

                const user = { username : data.username , token : data.token};
                dispatch({type:'LOGIN' , user});
            }
            catch(err){
                console.error(err);
                setIsPending(false);
                setError(err.message);
            }
        }
        login();
    }

    const togglePasswordHashing = () => {
        setIsHashed(!isHashed);
    };

    const findError = (field) => {
        if (error) {
            const items = error.split(',');
            return items.find(item => item.includes(field));
        }
    }

    return ( 
        <form className="login" onSubmit={handleSubmit}>
            <h3>Log In</h3>

            <label>UserName :</label>
            <input 
                type="text"
                onChange={(e)=> setUserName(e.target.value)}
                value={username}
                className={findError('username') ? 'error' : ''}
            />
            {error && findError('username') && <div className="error">{findError('username')}</div> }

            <div className="input-container">
                <label>Mot de Passe :</label>
                <div className="input-wrapper">
                    <input 
                        type={isHashed ? 'password' : 'text'} // Toggle password input type
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        className={findError('password') ? 'error' : ''}
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
                {error && findError('password') && <div className="error">{findError('password')}</div> }
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