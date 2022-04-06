import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Color } from '../../Global';
type Props = {
    onPress: () => void
    label:string,
}
export const Fab: React.FC<Props> = ({ onPress,label }) => <FAB
    style={styles.fab}
    icon="plus"
    label={label}
    color={Color.button}
    theme={{ colors: { accent: Color.secondary } }}
    onPress={onPress} />

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        marginRight: 1,
        marginBottom:3,
        right: 0,
        bottom: 0,
    },
})