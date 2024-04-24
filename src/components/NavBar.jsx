import { Link } from 'react-router-dom';
import useAuthContext from '../hooks/useAuthContext';
import { useState } from 'react';

const NavBar = () => {

    const { user , dispatch } = useAuthContext();

    const [showSidebar, setShowSidebar] = useState(false);

    const handlelogout = () => {
        localStorage.removeItem('user');

        dispatch({ type: 'LOGOUT' });
    }

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    return (
        <header>
            <div className="container">

                <span className="material-symbols-outlined sidebar-toggle" onClick={toggleSidebar}>
                    menu
                </span>

                <Link to='/' >
                    <h1>Elite Robotique</h1>
                </Link>
                
                <nav>

                    { user && (
                        <div>
                            Bienvenue <span>{user.nom}</span> !
                        </div>
                    )}
                    
                    <div>
                        <Link to='etages'>
                            <span className="material-symbols-outlined icon">apartment</span>&nbsp;
                            <span>Etages</span>
                        </Link>
                        <Link to='cartes'>
                            <span className="material-symbols-outlined icon">memory</span>&nbsp;
                            <span>Cartes</span>
                        </Link>
                        <Link to='lampes'>
                            <span className="material-symbols-outlined icon">light</span>&nbsp;  
                            <span>Lampes</span>
                        </Link>
                        <Link to='stores'>
                            <span className="material-symbols-outlined icon">blinds</span>&nbsp;
                            <span>Stores</span>
                        </Link>
                    </div>

                    <div className='user'>
                        { user && <button onClick={handlelogout}>Log out</button> }
                        { !user && <Link to='/login'>Login</Link>}
                    </div>

                </nav>
            </div>

            <div className={`sidebar ${showSidebar ? "active" : ""}`}>
                <nav>
                    <li><Link to="login-change">Changer mot de passe</Link></li>
                </nav>
            </div>

        </header>
    );
}
 
export default NavBar;