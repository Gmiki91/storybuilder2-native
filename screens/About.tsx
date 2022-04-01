import { Text, ImageBackground } from "react-native";

const About = () => (
    <ImageBackground style={{display:'flex',  marginTop:'1%', padding:'5%'}} resizeMode="stretch" source={require('../assets/pagecard.jpg')}>
        <Text style={{fontSize: 32,textAlign:'center', marginBottom:'5%'}}>Glyphses</Text>
        <Text style={{fontSize: 16, textAlign:'center', marginBottom:'5%'}}>Create stories and contribute to others in your target language</Text>
        <Text style={{textAlign:'left'}}>1. Create your first story and set your target language</Text>
        <Text style={{textAlign:'left'}}>2. You'll get a random story every day with your target language</Text>
        <Text style={{textAlign:'left'}}>3. See who contributed to your story and add the pages you like the most</Text>
        <Text style={{marginTop:'5%', marginBottom:'5%'}}>⭐Complete your daily contribution 3 times to get an extra page</Text>
        <Text>⭐Have 3 page accepted to get a new story</Text>
    </ImageBackground>)

export default About;