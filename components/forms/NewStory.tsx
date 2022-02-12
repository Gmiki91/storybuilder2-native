import axios from 'axios';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker';
import { default as languages } from '../../assets/languages.json';
import { Color } from '../../Global';
import { levels } from '../../models/LanguageLevels';
import { useAuth } from '../../context/AuthContext';
import { Form } from '../UI/Form';
import { Divider, Button, Switch } from 'react-native-paper';
import { CustomInput } from '../UI/CustomInput';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
type Props = {
    onCloseForm: () => void;
    onNewStoryAdded: () => void;
}

export const NewStory: React.FC<Props> = ({ onCloseForm, onNewStoryAdded }) => {
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
    const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
    const handleNewStory = (form: FieldValues) => {
        const story = {
            title: form.title.trim(),
            description: form.description?.trim(),
            language: form.language || languages[0].name,
            level: form.level || levels[0].code,
            openEnded:form.openEnded
        }
        axios.post(`${LOCAL_HOST}/stories/`, story, { headers })
            .then(onNewStoryAdded)
            .catch(error => console.log('hiba!!', error))
    }

    return (
        <Form>
            <View style={styles.controllerContainer}>
                <Controller
                    control={control}
                    name="title"
                    rules={{
                        required: {value:true, message:'Required'},
                        minLength:{value:3, message:'Minimum length is 3 characters'},
                        maxLength: {value:100, message:'Maximum length is 100 characters'},
                       }}
                    render={({ field: { onChange, value, onBlur } }) => (
                        <CustomInput
                            style={{ fontSize: 22 }}
                            placeholder="Story title"
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)} />
                    )} />
            </View>
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            <Divider />
            <Pressable style={styles.controllerContainer}>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <CustomInput
                            multiline
                            placeholder="Write a short description (optional)"
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
            <View style={[styles.controllerContainer,{flexDirection:'row', justifyContent:'space-around', alignItems:'center'}]}>
            <Text>May others contribute?</Text>
                <Controller
                    control={control}
                    name="openEnded"
                    render={({ field: { onChange, value, onBlur } }) => (

                        <Switch value={value} onValueChange={value => onChange(value)} />
                    )} />

            </View>
            <View style={styles.buttonContainer}>
                <Button color={Color.cancelBtn} onPress={onCloseForm} >Cancel</Button>
                <Button disabled={!isValid} color={Color.button} onPress={handleSubmit(handleNewStory)} >Submit</Button>
            </View>
        </Form>
    );
};

const styles = StyleSheet.create({
    controllerContainer: {
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop: 10,
    },
})