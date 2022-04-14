import axios from 'axios';
import { useState } from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Divider, Button } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import { Color, API_URL } from '../../Global';
import { Form } from '../UI/Form';
import { CustomInput } from '../UI/CustomInput';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { PageText } from './elements/PageText';
import { Title } from './elements/Title';
import { levels, languages, LevelCode } from '../../models/LanguageData';
import { Word } from './elements/Word';
import { RadioButton } from '../UI/RadioButton';
import { Snackbar } from 'react-native-paper';
import { Note } from '../../models/Note';
type Props = {
    onCloseForm: (submitted: boolean) => void;
    tokenProp?: string
}

export const NewStory: React.FC<Props> = ({ onCloseForm, tokenProp }) => {
    const [selectedLevel, setSelectedLevel] = useState<LevelCode>('A');
    const [error, setError] = useState('');
    const { authToken, setToken } = useAuth();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

    const navigation = useNavigation();

    const handleNewStory = async (form: FieldValues) => {
        const realToken = authToken || tokenProp;
        const headers = { Authorization: `Bearer ${realToken}` };

        const page = {
            text: form.text,
            language: form.language || languages[0].code,
        }

        const pageId = await axios.post(`${API_URL}/pages/`, page, { headers }).then((result) => result.data.pageId)
            .catch(() => setError('An error occured while saving the page'));
        const story = {
            title: form.title.trim(),
            description: form.description?.trim(),
            language: form.language || languages[0].code,
            pageId: pageId,
            level: selectedLevel,
            word1: form.word1.toLowerCase().trim(),
            word2: form.word2.toLowerCase().trim(),
            word3: form.word3?.toLowerCase().trim()
        };
        axios.post(`${API_URL}/stories/`, story, { headers })
            .then(result => {
                const note: Note = {
                    date: Date.now(),
                    message: `Story "${form.title.trim()}" has been added`,
                    code: 'B',
                    storyId: result.data.storyId,
                    unseen:false,
                }
                axios.post(`${API_URL}/notifications/`, { note }, { headers })
                if (tokenProp) {
                    setToken(tokenProp);
                    navigation.dispatch(CommonActions.navigate({ name: 'Home' }));
                } else {
                    onCloseForm(true);
                }
            })
            .catch(() => setError('An error occured while saving the story'))
    }

    return (
        <Form>
            {tokenProp && <Text style={{ fontSize:16,textAlign: 'center',marginBottom:'3%' }}>Create your first story</Text>}
            <Title control={control} />
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            <Text style={{ paddingTop: 15 }}>Select your language and your proficiency</Text>
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
                                return <Picker.Item key={language.text} value={language.code} label={`${language.code} ${language.text}`} />
                            })}
                        </Picker>
                    )} />
            </View>
            <View>
                {levels.map(level => (
                    <RadioButton
                        key={level.code}
                        label={`${level.text} (${level.code})`}
                        value={level.code}
                        checked={selectedLevel === level.code}
                        onPress={() => setSelectedLevel(level.code)}
                    />
                ))}

            </View>
            <Divider />
            <Text style={{ paddingLeft: 5, paddingTop: 15, paddingBottom: 5 }}>Short description (optional, you can change this later)</Text>
            <Pressable style={styles.controllerContainer}>
                <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value, onBlur } }) => (
                        <CustomInput
                            multiline
                            placeholder='Write here...'
                            value={value}
                            onBlur={onBlur}
                            onChangeText={value => onChange(value)} />
                    )} />
            </Pressable>
            <Text style={{ paddingLeft: 5, paddingTop: 15, paddingBottom: 5 }}>The beginning of your story</Text>
            <PageText newStory checkWords={() => { }} control={control} />
            {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}

            <Text style={{ paddingLeft: 5, paddingTop: 15 }}>Add 2+1 words/phrases to include on the next page</Text>
            <Word required name='word1' placeholder='#1' control={control} />
            {errors.word1 && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            <Word required name='word2' placeholder='#2' control={control} />
            {errors.word1 && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            <Word name='word3' placeholder='#3 (optional)' control={control} />

            <View style={styles.buttonContainer}>
                {!tokenProp && <Button color={Color.cancelBtn} onPress={() => onCloseForm(false)} >Cancel</Button>}
                <Button disabled={!isValid} color={Color.button} onPress={handleSubmit(handleNewStory)} >Submit</Button>
            </View>
            <Snackbar onDismiss={() => setError('')} visible={error !== ''} duration={2000}>{error}</Snackbar>
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
    }
})