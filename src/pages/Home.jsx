import useTitle from "../hooks/useTitle";
import image from "../images/image1.png";
import TypingEffect from '../components/TypingEffect';

const Home = () => {

    useTitle('Accueil');
    const text = "At Smart House, our vision is to redefine everyday living through innovative and sustainable technology. We are committed to enhancing the quality of life by automating essential functions that save time and reduce energy consumption. Our approach ensures that convenience does not come at the cost of security. With Smart House, you gain a secure and efficient system to automate and monitor your home's devices and systems. Whether you are at home or away, enjoy the peace of mind that comes with having complete control at your fingertips.";
    
    return (
        <div className="home">
            <div className="image">
                <img src={image} alt="Smart House Technology" />
            </div>
            
            <div>
                <h1>Welcome to Smart House</h1>
                <TypingEffect text={text} speed={50} />
            </div>
        </div>
    );
}
 
export default Home;