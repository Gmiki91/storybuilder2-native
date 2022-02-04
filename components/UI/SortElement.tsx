import { Pressable, Text } from "react-native";
type Props = {
    label: string | JSX.Element,
    icon: JSX.Element,
    showIcon: boolean,
    onPress: () => void
}
export const SortElement: React.FC<Props> = ({ label, icon, showIcon, onPress }) => {
    const underline = showIcon ? 'underline' : 'none'
    return(
    <Pressable style={{paddingRight:10, flexDirection: 'row',alignItems: 'center'}} onPress={onPress}>
        <Text style={{textDecorationLine:underline}}>{label} </Text>{showIcon && icon}
    </Pressable>
    )
}