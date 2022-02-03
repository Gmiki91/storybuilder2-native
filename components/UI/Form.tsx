import { View, StyleSheet } from "react-native";
import { Color } from "../../Global";


export const Form: React.FC<React.ReactNode> = ({ children }) => (
    <View style={styles.container}>
        <View style={styles.form}>
            {children}
        </View>
    </View>
)

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.main,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    form: {
        marginTop: '10%',
        backgroundColor: Color.secondary,
        width: '90%',
        padding: 25,
        borderWidth: 5,
        borderRadius: 10,
    }
});
