import { View, Pressable, TextInput, StyleSheet } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker';
import { useRef } from 'react';
import { Form } from '../UI/Form';
import { Button } from '../UI/Button'
import { levels } from '../../models/LanguageLevels';
import { Color } from '../../Global';

type Props = {
  onSubmit: (f: FieldValues) => void;
  onClose: () => void;
}

export const NewPage: React.FC<Props> = ({ onSubmit, onClose }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const descriptionRef = useRef<TextInput>(null);

  const onPressDescription = () => {
    descriptionRef.current?.focus()
  }

  const handleForm = (form: FieldValues) => {
    if (!form.level) form.level = levels[0].code;
    onSubmit(form);
  }

  return (
  <Form>
      <Pressable onPress={onPressDescription} style={[styles.controllerContainer, styles.description]}>
        <Controller
          control={control}
          name="text"
          render={({ field: { onChange, value, onBlur } }) => (
            <TextInput
              ref={descriptionRef}
              multiline
              placeholder="Write here..."
              value={value}
              onBlur={onBlur}
              onChangeText={value => onChange(value)} />
          )} />
      </Pressable>
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
        <Button style={{ backgroundColor: Color.lightRed }} label='Cancel' onPress={onClose} />
        <Button label='Submit' onPress={handleSubmit(handleForm)} />
      </View>
</Form>
  );
};

const styles = StyleSheet.create({
  controllerContainer: {
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: Color.secondary,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 30
  },

  description: {
    height: '65%',
    borderWidth: 1

  }
})

