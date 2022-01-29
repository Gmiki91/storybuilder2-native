import { levels } from '../../models/LanguageLevels';
import { View,Text, Button, Pressable, TextInput, StyleSheet } from 'react-native';
import { useForm, Controller, FieldValues } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker';
import { Color } from '../../Global';
import { useRef } from 'react';

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
   
    if(!form.level) form.level=levels[0].code;
    onSubmit(form);
  }

  return (<View style={styles.container}>
    <View style={styles.form}>
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
              style={styles.controllerContainer}
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
      <Button title='Cancel' onPress={onClose} />
      <Button title='Submit' onPress={handleSubmit(handleForm)} />
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.main,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
 
  form: {
    marginTop:'10%',
    backgroundColor: 'white',
    width: '90%',
    padding: 25,
    borderWidth: 5,
    borderRadius: 10,
  },

  controllerContainer: {
  
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  buttonContainer:{
    flexDirection:'row',
    justifyContent: 'space-around',
    paddingTop:30
  },
  description: {
    height: '65%',
    borderWidth:1

  }
})

