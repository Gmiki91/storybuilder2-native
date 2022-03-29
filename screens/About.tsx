import { View, Text, ImageBackground } from "react-native";

const About = () => (
    <ImageBackground style={{display:'flex', justifyContent: 'center', alignItems: 'center', marginTop:'1%', padding:'5%'}} resizeMode="stretch" source={require('../assets/pagecard.jpg')}>
        <Text style={{fontSize: 16}}>Welcome!</Text>
        <Text style={{fontSize: 16}}>Whats all this? How the fuck should I know!</Text>
    </ImageBackground>)

export default About;