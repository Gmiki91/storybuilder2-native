import { View,StyleSheet } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Color } from '../../Global'
import { useNavigation,CommonActions } from '@react-navigation/native';

export const BackButton = () => {
    const navigation = useNavigation();
    return <View style={styles.backButton}>
        <IconButton
            icon="keyboard-return"
            color={Color.button}
            size={20}
            onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Home'}))}
        />
    </View>
}

const styles = StyleSheet.create({
    backButton:{
        backgroundColor: Color.secondary, borderRadius: 20,
        position: 'absolute',
        marginLeft: 10,
        marginBottom:20,
        left: 0,
        bottom: 0,
    }
})