import { Pressable, StyleProp, Text, ViewStyle, StyleSheet } from "react-native";
import { Color } from '../../Global';
type Props = {
    label: string | JSX.Element,
    onPress: () => void
    hidden?: boolean
    style?: StyleProp<ViewStyle>
}

export const Button: React.FC<Props> = ({ label, style, onPress, hidden }) => (
    hidden ? null
        : <Pressable style={[styles.button, style]} onPress={onPress}><Text style={styles.text}>{label}</Text></Pressable>)

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderRadius: 4,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        backgroundColor: Color.button,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: Color.secondary,
    },
})