import { useEffect, useRef } from "react";
import { NativeSyntheticEvent,StyleSheet, Pressable, TextInput, TextInputFocusEventData,StyleProp,ViewStyle, TextStyle } from "react-native";
import { useKeyboard } from "../../hooks/KeyboardVisible";

type Props = {
    value: string,
    placeholder: string
    multiline?:boolean
    secureTextEntry?:boolean
    style?: StyleProp<TextStyle>
    onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onChangeText: (event: string) => void
}
export const CustomInput: React.FC<Props> = ({ value,placeholder,multiline,style,secureTextEntry, onBlur, onChangeText }) => {
    const isKeyBoardOpen = useKeyboard();
    const ref = useRef<TextInput>(null);
    const onPressDescription = () => {
        ref.current?.focus()
      }

    useEffect(() => {
        if (!isKeyBoardOpen) {
            ref.current?.blur()
        }
    }, [isKeyBoardOpen]);

    const onChange = (value:string) => {
        onChangeText(value)
    }
    const linestyle = multiline ? styles.multiline : styles.oneline
    return <Pressable onPress={onPressDescription}>
        <TextInput
            style={[linestyle, style]}
            ref={ref}
            multiline={multiline}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={onChange} />
    </Pressable>

}

const styles = StyleSheet.create({
    multiline: {
        height: 200,borderWidth: 1, textAlign: 'left', textAlignVertical:'top', padding:5, marginBottom:5
    },
    oneline:{
        padding:5,
        textAlignVertical:'bottom',
        borderBottomWidth:1

    }
})