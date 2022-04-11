import { Text, View } from "react-native";
import { Color } from "../Global";
const About = () => (
    <View style={{display:'flex', padding:'5%', backgroundColor:Color.storyCard}}>
        <Text style={{fontSize: 16, textAlign:'center', marginBottom:'5%'}}>Create stories and contribute to others in your target language</Text>
        <Text style={{textAlign:'left'}}>1. Create your first story and set your target language</Text>
        <Text style={{textAlign:'left'}}>2. You'll get a random story every day with your target language</Text>
        <Text style={{textAlign:'left'}}>3. See who contributed to your story and add the pages you like the most</Text>
        <Text style={{marginTop:'5%', marginBottom:'5%'}}>⭐Complete your daily contribution 3 times to get an extra page</Text>
        <Text>⭐Have 3 page accepted to get a new story</Text>
        <Text style={{marginTop:'10%', textAlign:'center'}}>Got any questions or feedback? Or want a language added? Send an email: admin@glyphses.com</Text>
    </View>)
export default About;