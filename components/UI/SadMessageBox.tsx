import { View, Text,StyleSheet } from 'react-native';
import { Color } from '../../Global';
import { Entypo } from '@expo/vector-icons';
type Props = {
    message: string
}
export const SadMessageBox = ({ message }: Props) => (
    <View style={styles.card}>
        <Text>{message}</Text>
        <Entypo name="emoji-sad" size={24} color="black" />
    </View>
)

const styles = StyleSheet.create({
    card:{
        width: '90%', alignSelf: 'center', alignItems: 'center', backgroundColor: Color.secondary, borderRadius: 50,padding:5,
        marginTop:'1%',
        borderBottomWidth:5,
        borderWidth: 1,
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    }
})