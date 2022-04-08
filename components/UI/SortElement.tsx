import { memo } from "react";
import { Pressable, Text } from "react-native";
import { Color } from "../../Global";
type Props = {
    label: string | JSX.Element,
    icon: JSX.Element,
    showIcon: boolean,
    onPress: () => void
}
const SortElement: React.FC<Props> = ({ label, icon, showIcon, onPress }) => {
    const underline = showIcon ? 'underline' : 'none'
    return(
    <Pressable style={{padding:10, flexDirection: 'row',alignItems: 'center'}} onPress={onPress}>
        <Text style={{textDecorationLine:underline, color:Color.button}}>{label} </Text>{showIcon && icon}
    </Pressable>
    )
}

export default memo(SortElement);