import { View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Color } from '../../Global'
import { useNavigation,CommonActions } from '@react-navigation/native';

export const BackButton = () => {
    const navigation = useNavigation();
    return <View style={{ backgroundColor: Color.secondary, borderRadius: 20, alignSelf: 'flex-start' }}>
        <IconButton
            icon="keyboard-return"
            color={Color.button}
            size={20}
            onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'Home'}))}
        />
    </View>
}