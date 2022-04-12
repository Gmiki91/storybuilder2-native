import React from "react";
import { Text, View } from "react-native";
import { RadioButton as Radiobutton } from "react-native-paper";
import { Color } from "../../Global";

type Props = {
    label: string;
    value:string;
    checked: boolean;
    onPress: (value: boolean) => void;
}
export const RadioButton: React.FC<Props> = ({ label,value, checked, onPress }) => {
    return (<View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Radiobutton
            value={value}
            color={Color.secondary}
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
                onPress(!checked);
            }} />
        <Text>{label}</Text>
    </View>
    )
}