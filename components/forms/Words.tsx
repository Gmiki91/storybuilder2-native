import { Text, View, StyleSheet } from 'react-native';
import { useForm, FieldValues } from 'react-hook-form'
import { Button } from 'react-native-paper'
import { Color } from '../../Global';
import { Form } from '../UI/Form';
import { Word } from './elements/Word';

type Props = {
    onSubmit: (array: string[]) => void;
}

export const Words: React.FC<Props> = ({ onSubmit }) => {
    const { control, handleSubmit, formState: {  isValid } } = useForm({ mode: 'onBlur' });

    const handleForm = (f: FieldValues) => {
        const array = [f.word1.toLowerCase(), f.word2.toLowerCase(), f.word3?.toLowerCase()];
        onSubmit(array);
    }

    return <Form>
        <Text>Add 2+1 words/phrases for the next page</Text>
        <Word required name='word1' placeholder='#1' control={control} />
        <Word required name='word2' placeholder='#2' control={control} />
        <Word name='word3' placeholder='#3 (optional)' control={control} />
        <View style={styles.buttonContainer}>
            <Button disabled={!isValid} color={Color.button} onPress={handleSubmit(handleForm)}>Ok</Button>
        </View>
    </Form>
};

const styles = StyleSheet.create({
    controllerContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10
    },
})
