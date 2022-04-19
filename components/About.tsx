import { Text, View } from "react-native";
import { Color } from "../Global";
const About = () => (
    <View style={{display:'flex', padding:'5%', backgroundColor:Color.storyCard}}>
        <Text style={{fontSize: 16, fontWeight:'bold', textAlign:'center', marginBottom:'1%'}}>Glyphses - A collaborative storywriting app</Text>
        <Text style={{fontSize: 12, textAlign:'center', marginBottom:'5%'}}>Create stories together with other users, one small paragraph at a time</Text>
        <Text style={{marginBottom:'1%'}}>1. Begin a story with just a couple of sentences (or a whole page if you prefer)</Text>
        <Text style={{marginBottom:'1%'}}>2. You'll get a random story every day. Add a couple of sentences to expand it</Text>
        <Text >3. See who contributed to your story and add the pages you like the most</Text>
        <Text style={{marginTop:'5%', marginBottom:'5%'}}>⭐Complete your daily contribution 3 times to get an extra page</Text>
        <Text>⭐Have 3 page accepted to get a new story</Text>
        <Text style={{marginTop:'10%', textAlign:'center'}}>Got any questions or feedback?</Text>
        <Text style={{textAlign:'center'}}>Want a language added?</Text>
        <Text style={{textAlign:'center'}}>Found a bug?!</Text>
        <Text style={{marginTop:'3%',textAlign:'center'}}>admin@glyphses.com</Text>
    </View>)
export default About;