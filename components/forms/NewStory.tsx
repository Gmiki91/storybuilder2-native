import axios from 'axios';
import { useRef } from 'react';
import { StyleSheet, Pressable, View, TextInput } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker';
import { default as languages } from '../../assets/languages.json';
import { Color } from '../../Global';
import { levels } from '../../models/LanguageLevels';
import { useAuth } from '../../context/AuthContext';
import { Form } from '../UI/Form';
import { Divider,Button } from 'react-native-paper';

type Props = {
    onCloseForm: () => void;
}

export const NewStory: React.FC<Props> = ({ onCloseForm }) => {
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
            .then(() => onCloseForm())
            .catch(error => console.log('hiba!!', error))
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
            <Divider />
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
            <Divider />
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
            <Divider />
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
            <Divider />
            <View style={styles.buttonContainer}>
                <Button color= {Color.lightRed }  onPress={onCloseForm} >Cancel</Button>
                <Button color={Color.button} onPress={handleSubmit(handleNewStory)} >Submit</Button>
            </View>
        </Form>
    );
};

const styles = StyleSheet.create({
    controllerContainer: {
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: Color.secondary,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop: 10,
    },
    description: {
        justifyContent: 'center',
        borderColor: Color.secondary,
        paddingBottom: '40%'
    }
})