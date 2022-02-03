import axios from 'axios';
import { useRef } from 'react';
import { StyleSheet, Pressable, View, TextInput } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../App';
import { default as languages } from '../assets/languages.json';
import { Color } from '../Global';
import { levels } from '../models/LanguageLevels';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/UI/Button';
import { Form } from '../components/UI/Form';

type NavigationProp = {
    navigation: StackNavigationProp<RootStackParamList, 'NewStory'>;
}
export const NewStory: React.FC<NavigationProp> = ({ navigation }) => {
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const descriptionRef = useRef<TextInput>(null);
    const LOCAL_HOST = 'http://192.168.31.203:3030/api';
    const handleNewStory = (form: FieldValues) => {
        const story = {
            title: form.title,
            description: form.description,
            language: form.language || languages[0].name,
            level: form.level || levels[0].code,
        }
        axios.post(`${LOCAL_HOST}/stories/`, story, { headers })
            .then(() => navigation.navigate('Stories'))
            .catch(error => console.log('hiba!!',error))
    }

    const onPressDescription = () => {
        descriptionRef.current?.focus()
    }

    return (
       <Form>
                <View style={styles.controllerContainer}>
                    <Controller
                        control={control}
                        name="title"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <TextInput
                                style={{ fontSize: 22 }}
                                placeholder="Story title"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)} />
                        )} />
                </View>

                <Pressable onPress={onPressDescription} style={[styles.controllerContainer, styles.description]}>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <TextInput
                                ref={descriptionRef}
                                multiline
                                placeholder="Write a short description"
                                value={value}
                                onBlur={onBlur}
                                onChangeText={value => onChange(value)} />
                        )} />
                        
                </Pressable>
                <View style={styles.controllerContainer}>
                    <Controller
                        control={control}
                        name="language"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <Picker
                                selectedValue={value}
                                onBlur={onBlur}
                                onValueChange={value => onChange(value)} >
                                {languages.map(language => {
                                    return <Picker.Item key={language.code} value={language.name} label={language.name} />
                                })}
                            </Picker>
                        )} />
                </View>
                <View style={styles.controllerContainer}>
                    <Controller
                        control={control}
                        name="level"
                        render={({ field: { onChange, value, onBlur } }) => (
                            <Picker
                                selectedValue={value}
                                onBlur={onBlur}
                                onValueChange={value => onChange(value)} >
                                {levels.map(level => {
                                    return <Picker.Item key={level.code} value={level.code} label={`${level.text} (${level.code})`} />
                                })}
                            </Picker>
                        )} />
                </View>
                <Button  label='Submit' onPress={handleSubmit(handleNewStory)} />
    </Form>
    );
};

const styles = StyleSheet.create({
    controllerContainer: {
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: Color.secondary,
        borderBottomWidth: 1,
    },

    description: {
        height: '40%',
        justifyContent: 'center',
        borderColor: Color.secondary

    }
})