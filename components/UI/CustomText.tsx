import { Text, StyleProp, TextStyle,StyleSheet } from "react-native";
type Props = {
    lang:string
    style?: StyleProp<TextStyle>
}
const rtlLanguages = ['ar', 'fa', 'he']
export const CustomText: React.FC<Props> = ({ lang, style, children }) => {
    const dir = rtlLanguages.indexOf(lang)===-1 ? styles.ltr : styles.rtl
    return <Text style={[style,dir]}>{children}</Text>
}

const styles = StyleSheet.create({
    ltr:{
        textAlign: 'justify'
    },
    rtl:{ 
        flexDirection:'row-reverse'
    }
})