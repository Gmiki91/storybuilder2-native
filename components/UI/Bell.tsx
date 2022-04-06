import { View } from 'react-native'
import { Badge } from 'react-native-elements';
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface Props {
    notes: number,
    size:number,
    color:string
}
export const Bell = ({ notes, size, color }: Props) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <MaterialCommunityIcons size={size} color={color} name="human-child" />
            <Badge status="error" value={notes}></Badge>
        </View>)
}