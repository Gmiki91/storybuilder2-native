import { useState } from 'react'
import { View, Text, Pressable } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { CustomInput } from '../../UI/CustomInput';
import styles from "./style"
import sentences from '../../../assets/sentences.json';
type Props = {
    control: Control<FieldValues, object>
    checkWords: (event: string) => void;
}
const MAX_CHAR = 280;
export const PageText: React.FC<Props> = ({ control, checkWords }) => {
    const [randomSentence, setRandomSentence] = useState<string>('Write here...');
    const [hideButton, setHideButton] = useState<boolean>(false);
    const [charCount, setCharCount] = useState(0);

    const getRandomSentence = () => {
        const sentence = sentences.data[Math.floor(Math.random() * sentences.data.length)].sentence;
        setRandomSentence(sentence);
    }
    const valueChange = (value:string)=>{
        checkWords(value);
        setCharCount(value.length);
        if(value.trim()!=='' && !hideButton) setHideButton(true)
        else if(value.trim()==='' && hideButton)setHideButton(false)
    }

    return (
        <View style={styles.controllerContainer}>
             <Text style={MAX_CHAR<charCount ? {color:'red'}:{color:'black'}} >{charCount}/{MAX_CHAR}</Text>
            <Controller
                control={control}
                name="text"
                rules={{
                    required: { value: true, message: 'Required' },
                    minLength: { value: 10, message: 'Minimum length is 10 characters' },
                    maxLength: { value: MAX_CHAR, message: `Maximum length is ${MAX_CHAR} characters` },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                    <CustomInput
                        multiline
                        placeholder={randomSentence}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(value) => { onChange(value), valueChange(value) }} />
                )} />
            {!hideButton && <Pressable  onPress={getRandomSentence}>
            <Text style={{fontSize:12, textDecorationLine: 'underline', marginBottom:5}}>Don't know how to start? Get a random sentence!</Text>
            </Pressable>}
           
        </View>

    )
}
