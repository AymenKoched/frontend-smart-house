import { createContext, useReducer } from "react";

export const StoresContext = createContext();

export const StoresReducer = (state,action) => {
    switch(action.type){
        case 'SET_STORES' :
            return{
                ...state,
                stores : action.stores 
            }

        case 'SET_STORE' : 
            return{
                ...state,
                store : action.store
            }
        
        case 'CREATE_STORE' :
            return{
                ...state,
                stores : [...state.stores,action.store] 
            }

        case 'DELETE_STORE' :
            return{
                ...state,
                stores : state.stores.filter((store) => store._id !== action.store._id)
            }

        default :
            return state;
    }
}

export const StoresContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(StoresReducer , {
        stores : null ,
        store : null                    
    })

    return(
        <StoresContext.Provider value={{...state,dispatch}}>
            {children}
        </StoresContext.Provider>
    );
}