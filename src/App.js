import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Etages from "./pages/Etages";
import Etage from "./pages/Etage";
import Cartes from "./pages/Cartes";
import Carte from "./pages/Carte";
import Lampes from "./pages/Lampes";
import Stores from "./pages/Stores";
import Login from "./pages/Login";
import LoginChange from "./pages/LoginChange";

import { BrowserRouter as Router , Routes , Route , Navigate } from 'react-router-dom';
import useAuthContext from "./hooks/useAuthContext";
import { useEffect, useState } from "react";

const App = () => {

    const { user , dispatch } = useAuthContext();

    // handle problem : when i reload a page it took me to the home page
    const [isAuthChecked, setIsAuthChecked] = useState(false);
    
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const { token, nom } = JSON.parse(storedUser);
            const user = { nom, token };
            dispatch({ type: 'LOGIN', user });
        }
        setIsAuthChecked(true);
    }, [dispatch]);

    if (!isAuthChecked) {
        // Wait for the authentication check to complete
        return null;
    }


    return (
        <div className="App">
            <Router>
                <NavBar/>

                <div className="pages">
                    <Routes>
                        <Route path="/" element={ <Home/> } />
                        <Route path="/etages" element={ user ? <Etages/> : <Navigate to="/login" /> } />
                        <Route path="/etages/:id" element={ user ? <Etage/> : <Navigate to="/login" /> } />
                        <Route path="/cartes" element={ user ? <Cartes/> : <Navigate to="/login" /> } />
                        <Route path="/cartes/:id" element={ user ? <Carte/> : <Navigate to="/login" />  }/>
                        <Route path="/lampes" element={ user ? <Lampes/> : <Navigate to="/login" />  } />
                        <Route path="/stores" element={ user ? <Stores/> : <Navigate to="/login" />  } />
                        <Route path="/login" element={ !user ? <Login />  : <Navigate to="/" />  } />
                        <Route path="/login-change" element={ user ? <LoginChange /> : <Navigate to="/login" />} />
                    </Routes>
                </div>

                <Footer/>
            </Router>
        </div>
    );
}
 
export default App;
