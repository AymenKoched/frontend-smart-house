
import useTitle from '../hooks/useTitle';
import { useState } from 'react';
import useAuthContext from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';


import lottie from 'lottie-web';
import { defineElement } from 'lord-icon-element';
// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

const LoginChange = () => {
    
    useTitle('Update Mdp');

    const { user , dispatch } = useAuthContext();

    const navigate = useNavigate();

    const [password , setPassword] = useState('');
    const [oldPassword , setOldPassword] = useState('');

    const [isHashed1, setIsHashed1] = useState(true);
    const [isHashed2, setIsHashed2] = useState(true);

    const [isPending , setIsPending] = useState(false);
    const [error,setError] = useState(null);

    const togglePasswordHashing = (n) => {
        if(n === 1){
            setIsHashed1(!isHashed1);
        } else if (n === 2) {
            setIsHashed2(!isHashed2);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = { oldPassword , password };

        setIsPending(true);

        let data ;
        const UpdatePWD = async () => {
            try{
                const res = await fetch('/api/user', {
                    method : 'PUT' ,
                    headers: {
                        'Content-Type':'application/json' , 
                        'Authorization': `Bearer ${user.token}`
                    } , 
                    body : JSON.stringify(body)
                });
                data = await res.json();

                if(!res.ok){
                    throw new Error(data.message);
                }

                setOldPassword('');
                setPassword('');

                setIsPending(false);
                setError(null);

                localStorage.removeItem('user');

                dispatch({ type: 'LOGOUT' });

                navigate('/');
            }
            catch(err){
                console.error(err);
                setIsPending(false);
                setError(err.message);
            }
        }

        if(user){
            UpdatePWD();
        } else {
            setError({login:'if faut se connecter !'});
        }
    }

    const findError = (field) => {
        if (error) {
            const items = error.split(',');
            return  items.filter(item => item.includes(field)).join(' / ');
        }
    }

    return (
        <form className="login" onSubmit={handleSubmit}>
            <h3>Changer mot de passe</h3>

            <div className="input-container">
                <label>Ancien Mot de Passe :</label>
                <div className="input-wrapper">
                    <input 
                        type={isHashed1 ? 'password' : 'text'} 
                        onChange={(e)=>setOldPassword(e.target.value)}
                        value={oldPassword}
                        className={findError('oldPassword') ? 'error' : ''}
                        autoComplete="off"
                    />
                    <div onClick={() => togglePasswordHashing(1)} className="visibility-icon">
                        {isHashed1 ? (
                            <i><span className="material-symbols-outlined">visibility</span></i>
                            ) : (
                            <i><span className="material-symbols-outlined">visibility_off</span></i>
                        )}
                    </div>
                </div>
                {error && findError('oldPassword') && <div className="error">{findError('oldPassword')}</div> }
            </div>

            <div className="input-container">
                <label>Nouveau Mot de Passe :</label>
                <div className="input-wrapper">
                    <input 
                        type={isHashed2 ? 'password' : 'text'} 
                        onChange={(e)=>setPassword(e.target.value)}
                        value={password}
                        className={findError('password') ? 'error' : ''}
                        autoComplete="off"
                    />
                    <div onClick={() => togglePasswordHashing(2)} className="visibility-icon">
                        {isHashed2 ? (
                            <i><span className="material-symbols-outlined">visibility</span></i>
                            ) : (
                            <i><span className="material-symbols-outlined">visibility_off</span></i>
                        )}
                    </div>
                </div>
                {error && findError('password') && <div className="error">{findError('password')}</div> }
            </div>

            { !isPending &&  <button>Changer</button>}
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
 
export default LoginChange;