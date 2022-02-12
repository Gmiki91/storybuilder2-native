import { View, StyleSheet } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker';
import { Form } from '../UI/Form';
import { Button } from 'react-native-paper'
import { Color } from '../../Global';
import { levels } from '../../models/LanguageLevels';
import {CustomInput} from '../UI/CustomInput';
import { ErrorMessage } from '../../components/UI/ErrorMessage';

type Props = {
  onSubmit: (f: FieldValues) => void;
  onClose: () => void;
}

export const NewPage: React.FC<Props> = ({ onSubmit, onClose }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });

  const handleForm = (form: FieldValues) => {
    if (!form.level) form.level = levels[0].code;
    onSubmit(form);
  }

  return (
    <Form>
      <View  style={styles.controllerContainer}>
        <Controller
          control={control}
          name="text"
          rules={{
            required: {value:true, message:'Required'},
            minLength:{value:10, message:'Minimum length is 10 characters'},
            maxLength: {value:5000, message:'Maximum length is 5000 characters'},
           }}
          render={({ field: { onChange, value, onBlur } }) => (
            <CustomInput
            multiline
            placeholder={'Write here...'}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange} />
          )} />
      </View>
      {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}
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
      <View style={styles.buttonContainer}>
        <Button color={Color.cancelBtn} onPress={onClose}>Cancel</Button>
        <Button disabled={!isValid} color={Color.button} onPress={handleSubmit(handleForm)}>Submit</Button>
      </View>
    </Form>
  );
};

const styles = StyleSheet.create({
  controllerContainer: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  buttonContainer: {
    borderTopWidth:1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10
  },
})

