import { createContext, useEffect, useReducer } from "react";
import useAuthContext from "../hooks/useAuthContext";

export const CartesContext = createContext();

export const CartesReducer = (state,action) => {
    switch(action.type){
        case 'SET_CARTES':
            return{
                ...state,
                cartes: action.cartes,
            }

        case 'SET_CARTE': 
            return{
                ...state,
                carte: action.carte,
            }

        case 'CREATE_CARTE' :
            return{
                ...state,
                cartes : [action.carte, ...state.cartes]
            }

        case 'DELETE_CARTE':
            return{
                ...state,
                cartes : state.cartes.filter((carte) => carte.id !== action.carte.id)
            }

        default :
            return state;
    }
}

export const CartesContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(CartesReducer , {
        cartes : null ,
        carte : null
    })

    const { user } = useAuthContext();

    useEffect(()=>{
        const checkCartes = async () => {
            const res = await fetch('/api/carte',{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();

            const cartes = data;
            if(cartes){
                dispatch({ type:'SET_CARTES' , cartes });
            }
        }
        if(user){
            checkCartes();
        }
        
    },[user]);

    return(
        <CartesContext.Provider value={{...state,dispatch}}>
            {children}
        </CartesContext.Provider>
    )
}