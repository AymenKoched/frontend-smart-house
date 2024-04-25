import useTitle from "../hooks/useTitle";
import image from "../images/elite robotique.jpg"

const Home = () => {

    useTitle('Accueil');
    
    return (
        <div className="home">
            
            <div className ="image">
                <img src={image} alt="image elite robotique" />
            </div>

            <div className="desc">
                <p>Smart House application</p>
            </div>

        </div>
    );
}
 
export default Home;