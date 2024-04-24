import { useContext } from "react";
import { LampesContext } from "../contexts/LampesContext";

const useLampesContext = () => {
    const context = useContext(LampesContext);

    if(!context){
        throw new Error('useLampesContext must be uses inside an LampesContextProvider');
    }
    return ( context );
}
 
export default useLampesContext;