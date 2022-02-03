import { View, StyleSheet, ScrollView} from "react-native";
import { Color } from "../../Global";


export const Form: React.FC<React.ReactNode>  = ({ children }) => (
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.form}>
            {children}
        </View>
    </ScrollView>
)

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    form: {
        backgroundColor: Color.secondary,
        width: '80%',
        padding: 15,
        borderWidth: 5,
        borderRadius: 10,
    }
});
