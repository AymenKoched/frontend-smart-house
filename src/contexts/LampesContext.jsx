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
                lampes : [...state.lampes,action.lampe] 
            }

        case 'DELETE_LAMPE' :
            return{
                ...state,
                lampes : state.lampes.filter((lampe) => lampe._id !== action.lampe._id)
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