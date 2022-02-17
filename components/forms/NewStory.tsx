import axios from 'axios';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Divider, Button, Switch } from 'react-native-paper';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { default as languages } from '../../assets/languages.json';
import { useAuth } from '../../context/AuthContext';
import { Color } from '../../Global';
import { Form } from '../UI/Form';
import { CustomInput } from '../UI/CustomInput';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { PageText } from './elements/PageText';
import { Level } from './elements/Level';
import { Title } from './elements/Title';
import { levels } from '../../models/LanguageLevels';
import { Word } from './elements/Word';

type Props = {
    onCloseForm: () => void;
    tokenProp?: string
}

export const NewStory: React.FC<Props> = ({ onCloseForm, tokenProp }) => {
    const { token, setToken } = useAuth();
    const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

    const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
    const navigation = useNavigation();

    const handleNewStory = async (form: FieldValues) => {
        const realToken = token || tokenProp;
        const headers = { Authorization: `Bearer ${realToken}` };
        const page = {
            text: form.text,
            level: form.level || levels[0].code,
            language: form.language || languages[0].name,
            rating: []
        }
        const pageId = await axios.post(`${LOCAL_HOST}/pages/`, page, { headers }).then((result) => result.data.pageId)
            .catch(error => console.log('postPage error', error));
        const story = {
            title: form.title.trim(),
            description: form.description?.trim(),
            language: form.language || languages[0].name,
            pageId: pageId,
            level: form.level || levels[0].code,
            word1: form.word1?.toLowerCase().trim(),
            word2: form.word2?.toLowerCase().trim(),
            word3: form.word3?.toLowerCase().trim()
        };

        axios.post(`${LOCAL_HOST}/stories/`, story, { headers })
            .then(result => {
                if (tokenProp) setToken(tokenProp);
                else navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId: result.data.storyId }}))
            })
            .catch(error => console.log('postStory error', error))
    }

    return (
        <Form>
            {tokenProp && <Text style={{justifyContent:'center'}}>Create your first story</Text>}
            <Title control={control}/>
            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
            <Text style={{ paddingLeft: 5, paddingTop: 15, paddingBottom: 5 }}>Short description (optional)</Text>
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
            <Text style={{ paddingLeft: 5, paddingTop: 15, paddingBottom: 5 }}>First page</Text>
            <PageText checkWords={() => { }} control={control} />
            {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}
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
            <Level control={control} />
            <Divider />
            <Text style={{ paddingLeft: 5, paddingTop: 15 }}>Here you can specify 3 mandatory words/phrases for the next page (optional):</Text>
            <Word name='word1' placeholder='#1' control={control} />
            <Word name='word2' placeholder='#2' control={control} />
            <Word name='word3' placeholder='#3' control={control} />
            {/* <View style={[styles.controllerContainer, { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }]}>
                <Text>May others contribute?</Text>
                <Controller
                    control={control}
                    name="open"
                    render={({ field: { onChange, value, onBlur } }) => (

                        <Switch value={value} onValueChange={value => onChange(value)} />
                    )} />
            </View> */}
            <View style={styles.buttonContainer}>
                {!tokenProp && <Button color={Color.cancelBtn} onPress={onCloseForm} >Cancel</Button>}
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
    }
})