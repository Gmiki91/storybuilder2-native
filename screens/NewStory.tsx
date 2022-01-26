import data from '../assets/languages.json';
import { levels } from '../models/LanguageLevels';
import { StyleSheet, Text, SafeAreaView, TextInput, Button } from 'react-native';
import { useForm, Controller, FieldValues, SubmitHandler } from 'react-hook-form'
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
// import { LOCAL_HOST } from 'constants/constants';

//const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
export const NewStory = () => {
    //   const navigate = useNavigate();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

    const handleNewStory = (form: FieldValues) => {
        console.log(form)
        // const form = event.currentTarget;
        // const story = {
        //     title: form.titel.value,
        //     description: form.description.value,
        //     language: form.language.value,
        //     level: form.level.value,
        // }
        // axios.post(`${LOCAL_HOST}/stories/`, story, { headers })
        // .then(()=>navigate('/'))
        // .catch(error=>console.log(error))
    }

    return (
        <SafeAreaView style={styles.container}>
            <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        placeholder="Story title"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)} />
                )} />
            <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        multiline
                        placeholder="Write a short description"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)} />
                )} />
            <Controller
                control={control}
                name="language"
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        placeholder="Language"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)} />
                )} />
            <Controller
                control={control}
                name="proficiency"
                render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                        placeholder="Proficiency"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)} />
                )} />
            <Button title='Submit' onPress={handleSubmit(handleNewStory)} />
        </SafeAreaView>
        // <form className="form-box" onSubmit={handleNewStory}>

        //   <input id="titel" placeholder="Story title" />
        //   <textarea id="description" placeholder="Write a short synopsis to the story" />

        //   <div className="drop-down">
        //     <label htmlFor="language">Language </label>
        //     <select id='language'>
        //       {data.map(lang => <option key={lang.code} value={lang.name}>{lang.name}</option>)}
        //     </select>
        //   </div>

        //   <div className="drop-down">
        //     <label htmlFor="level">Proficiency </label>
        //     <select id='level'>
        //       {levels.map(level => <option key={level.code} value={level.code}>{level.code} - {level.text}</option>)}
        //     </select>
        //   </div>

        //   <div className='button-container'>
        //     <button onClick={()=>navigate('/')}>Cancel</button>
        //     <button type="submit">
        //       Submit
        //     </button>
        //   </div>
        // </form>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})