import { useContext } from "react";
import { StoresContext } from "../contexts/StoresContext";

const useStoresContext = () => {
    const context = useContext(StoresContext);

    if(!context){
        throw new Error('useStoresContext must be uses inside an StoresContextProvider');
    }
    return ( context );
}
 
export default useStoresContext;