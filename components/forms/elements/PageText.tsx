import { useState } from 'react'
import { View, Text, Pressable } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { CustomInput } from '../../UI/CustomInput';
import styles from "./style"
import sentences from '../../../assets/sentences.json';
type Props = {
    control: Control<FieldValues, object>
    checkWords: (event: string) => void;
    newStory?:boolean;
}
export const PageText: React.FC<Props> = ({ control, checkWords,newStory }) => {
    const [randomSentence, setRandomSentence] = useState<string>('Write here...');
    const [hideButton, setHideButton] = useState<boolean>(false);
    const [charCount, setCharCount] = useState(0);
    const maxChar = newStory ? 2800 : 560;
    const minChar = 28;
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
             <Text style={(maxChar<charCount || minChar>charCount)  ? {color:'red'}:{color:'green'}} >{charCount}/{maxChar}</Text>
            <Controller
                control={control}
                name="text"
                rules={{
                    required: { value: true, message: 'Required' },
                    minLength: { value: 10, message: `Minimum length is ${minChar} characters` },
                    maxLength: { value: maxChar, message: `Maximum length is ${maxChar} characters` },
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
