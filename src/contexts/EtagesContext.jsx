import { createContext, useEffect, useReducer } from "react";
import useAuthContext from "../hooks/useAuthContext";

export const EtagesContext = createContext();

export const EtagesReducer = (state,action) => {
    switch(action.type){
        case 'SET_ETAGES' :
            return {
                ...state,
                etages : action.etages
            }

        case 'SET_ETAGE' : 
            return {
                ...state,
                etage : action.etage
            }

        case 'CREATE_ETAGE' : 
            return {
                ...state,
                etages : [action.etage, ...state.etages]
            }

        case 'DELETE_ETAGE' :
            return {
                ...state,
                etages : state.etages.filter((etage) => etage.id !== action.etage.id)
            }

        default :
            return state;
    }
}

export const EtagesContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(EtagesReducer , {
        etages:null ,
        etage:null
    })

    const { user } = useAuthContext();
    useEffect(()=>{
        const checkEtages = async () => {
            const res = await fetch('/api/etage',{
                headers: {'Authorization': `Bearer ${user.token}`},
            });
            const data = await res.json();

            const etages = data;
            if(etages){
                dispatch({ type:'SET_ETAGES' , etages });
            }
        }
        if(user){
            checkEtages();
        }
    },[user]);

    return(
        <EtagesContext.Provider value={{...state,dispatch}}>
            {children}
        </EtagesContext.Provider>
    );
}
