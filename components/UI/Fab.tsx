import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Color } from '../../Global';
type Props = {
    onPress: () => void
}
export const Fab: React.FC<Props> = ({ onPress }) => <FAB
    style={styles.fab}
    
    icon="plus"
    theme={{ colors: { accent: Color.lightGreen } }}
    onPress={onPress} />

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        margin: 4,
        right: 0,
        bottom: 0,

    },
})