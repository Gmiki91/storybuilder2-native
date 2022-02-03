import { Pressable, Text, StyleSheet } from 'react-native';

type Props = {
    name:string;
}

export const Author:React.FC<Props> = ({name}) => (
        <Pressable style={styles.authorContainer} onPress={() => console.log(name)}>
            <Text style={styles.authorText}>{name}</Text>
        </Pressable>
)

const styles = StyleSheet.create({
    authorContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 5 
    },
    authorText: {
        textDecorationLine: 'underline',
        fontStyle: 'italic',
    }
});