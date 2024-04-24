import { useContext } from "react";
import { CartesContext } from "../contexts/CartesContext";

const useCartesContext = () => {
    const context = useContext(CartesContext);

    if(!context){
        throw new Error('useCartesContext must be uses inside an CartesContextProvider');
    }

    return (context);
}
 
export default useCartesContext;