import { ImageBackground , StyleSheet} from "react-native";
export const Top:React.FC<React.ReactNode>=({children})=>(
    <ImageBackground style={styles.header} source={require('../../assets/top.png')}>
        {children}
        </ImageBackground>
)

const styles = StyleSheet.create({
    header: {
        width: '100%',
        marginTop:'1%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: 'black',
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
})

