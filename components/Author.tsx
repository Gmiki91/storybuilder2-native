import { CommonActions, useNavigation } from '@react-navigation/native';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type Props = {
    name: string,
    userId: string,
    style?: StyleProp<ViewStyle>
}

export const Author: React.FC<Props> = ({ name, userId, style }) => {
    const navigation = useNavigation();
    const gotoUser = () => {
        navigation.dispatch(CommonActions.navigate({ name: 'Stats', params: { userId } }))
    }

    return (
        <Pressable style={[styles.authorContainer, style]} onPress={gotoUser}>
            <Text style={styles.authorText}>{name}</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    authorContainer: {
        alignSelf: 'flex-end',
    },
    authorText: {
        textDecorationLine: 'underline',
        fontStyle: 'italic',
    }
});