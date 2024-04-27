import { createContext, useReducer } from "react";

export const LampesContext = createContext();

export const LampesReducer = (state,action) => {
    switch(action.type){
        case 'SET_LAMPES' :
            return{
                ...state,
                lampes : action.lampes 
            }

        case 'SET_LAMPE' : 
            return{
                ...state,
                lampe : action.lampe
            }
        
        case 'CREATE_LAMPE' :
            return{
                ...state,
                lampes : [action.lampe, ...state.lampes]
            }

        case 'DELETE_LAMPE' :
            return{
                ...state,
                lampes : state.lampes.filter((lampe) => lampe.id !== action.lampe.id)
            }

        default :
            return state;
    }
}

export const LampesContextProvider = ({children}) => {
    const [state , dispatch] = useReducer(LampesReducer , {
        lampes : null ,
        lampe : null                    
    })

    return(
        <LampesContext.Provider value={{...state,dispatch}}>
            {children}
        </LampesContext.Provider>
    );
}