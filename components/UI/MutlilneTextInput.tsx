import { useEffect, useRef } from "react";
import { NativeSyntheticEvent, Pressable, TextInput, TextInputFocusEventData } from "react-native";
import { useKeyboard } from "../../hooks/KeyboardVisible";

type Props = {
    value: string,
    placeholder: string
    onBlur: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void,
    onChangeText: (event: string) => void
}
export const MultilineTextInput: React.FC<Props> = ({ value,placeholder, onBlur, onChangeText }) => {
    const isKeyBoardOpen = useKeyboard();
    const descriptionRef = useRef<TextInput>(null);
    const onPressDescription = () => {
        descriptionRef.current?.focus()
      }
    useEffect(() => {
        if (!isKeyBoardOpen) {
            descriptionRef.current?.blur()
        }
    }, [isKeyBoardOpen]);

    return <Pressable onPress={onPressDescription}>
        <TextInput
            style={{ height: 200, borderWidth: 1, textAlign: 'left', textAlignVertical:'top', padding:5, marginBottom:5}}
            onPressIn={() => console.log('hi')}
            ref={descriptionRef}
            multiline
            placeholder={placeholder}
            value={value}
            onBlur={onBlur}
            onChangeText={value => onChangeText(value)} />
    </Pressable>

}