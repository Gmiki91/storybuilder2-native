import { Text, View } from "react-native";
import { Checkbox } from "react-native-paper";
import { Color } from "../../Global";

type Props = {
    label: string;
    checked: boolean;
    onPress: (value:boolean) => void;
}
export const CheckBox: React.FC<Props> = ({ label,checked, onPress }) => {
    return (<View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Checkbox
        color={Color.secondary}
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                onPress(!checked);
            }} />
             <Text>{label}</Text>
    </View>
    )
}