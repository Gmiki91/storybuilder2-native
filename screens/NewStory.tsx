import { default as languages } from '../assets/languages.json';
import { Color } from '../Global';
import { levels } from '../models/LanguageLevels';
import { Picker } from '@react-native-picker/picker';
import { StyleSheet, Pressable, View, TextInput, Button } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useRef } from 'react';
import Config from 'react-native-config';
// import { LOCAL_HOST } from 'constants/constants';

//const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
export const NewStory = () => {
    //   const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const descriptionRef = useRef<TextInput>(null);
    
    const handleNewStory = (form: FieldValues) => {
        // const form = event.currentTarget;
        const story = {
            title: form.title,
            description: form.description,
            language: form.language,
            level: form.level,
        }
        axios.post(`${Config.LOCAL_HOST}/stories/`, story)
            .then(() => console.log('done'))
        //  axios.post(`${LOCAL_HOST}/stories/`, story, { headers })
        //  .then(()=>navigate('/'))
        // .catch(error=>console.log(error))
    }

    const onPressDescription = () => {
        descriptionRef.current?.focus()
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
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
                <Button title='Submit' onPress={handleSubmit(handleNewStory)} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        width: '90%',
        backgroundColor: Color.main,
        padding: 25,
        borderWidth: 5,
        borderColor: Color.secondary,
        borderRadius: 10,
    },

    controllerContainer: {
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: 'white'
    },
    description: {
        height: '40%',

    }
})