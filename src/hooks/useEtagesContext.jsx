import { useContext } from "react";
import { EtagesContext } from "../contexts/EtagesContext";

const useEtagesContext = () => {
    const context = useContext(EtagesContext);
    
    if(!context){
        throw new Error('useEtagesContext must be uses inside an EtagesContextProvider');
    }
    
    return ( context );
}
 
export default useEtagesContext;