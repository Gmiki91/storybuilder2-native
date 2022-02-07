import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';
import { Color } from '../../Global';
type Props = {
    onPress: () => void
}
export const Fab: React.FC<Props> = ({ onPress }) => <FAB
    style={styles.fab}
    
    icon="plus"
    theme={{ colors: { accent: Color.secondaryButton } }}
    onPress={onPress} />

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        marginRight: 4,
        marginBottom:30,
        right: 0,
        bottom: 0,

    },
})