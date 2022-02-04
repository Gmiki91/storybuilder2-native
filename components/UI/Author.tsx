import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

type Props = {
    name:string;
    style?: StyleProp<ViewStyle>
}

export const Author:React.FC<Props> = ({name,style}) => (
        <Pressable style={[styles.authorContainer,style]} onPress={() => console.log(name)}>
            <Text style={styles.authorText}>{name}</Text>
        </Pressable>
)

const styles = StyleSheet.create({
    authorContainer: {
        alignSelf:'flex-end',
        padding: 5,
    },
    authorText: {
        textDecorationLine: 'underline',
        fontStyle: 'italic',
    }
});