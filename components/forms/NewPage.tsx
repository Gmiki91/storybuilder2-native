import { View, StyleSheet,Text } from 'react-native';
import { useForm, FieldValues } from 'react-hook-form'
import { Form } from '../UI/Form';
import { AntDesign } from "@expo/vector-icons";
import { Button } from 'react-native-paper'
import { Color } from '../../Global';
import { levels } from '../../models/LanguageLevels';
import {PageText} from './elements/PageText';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
import { Level } from './elements/Level';
import { useState } from 'react';

type Props = {
  onSubmit: (f: FieldValues) => void;
  onClose?: () => void;
  words:string[];
}

export const NewPage: React.FC<Props> = ({ onSubmit, onClose, words }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({ mode: 'onBlur' });
  const [word1, setWord1]= useState<boolean>(false);
  const [word2, setWord2]= useState<boolean>(false);
  const [word3, setWord3]= useState<boolean>(false);

  const handleForm = (form: FieldValues) => {
    if (!form.level) form.level = levels[0].code;
    onSubmit(form);
  }

  const changeText=(event:string)=>{
    if(event.includes(words[0]) && !word1) setWord1(true);
    if(!event.includes(words[0]) && word1) setWord1(false);
    if(event.includes(words[1]) && !word2) setWord2(true);
    if(!event.includes(words[1]) && word2) setWord2(false);
    if(event.includes(words[2]) && !word3) setWord3(true);
    if(!event.includes(words[2]) && word3) setWord3(false);
  }

  const isEmpty = (value: string)=> value===null || value===undefined || value.trim()==='';
  const wordsValid = ()=> (isEmpty(words[0]) || word1) && (isEmpty(words[1]) || word2) && (isEmpty(words[2]) || word2);
  
  return (
    <Form>
      <View style={styles.words}>
      {!isEmpty(words[0]) ? word1 ? <Text style={{color:'green'}}>{words[0]} <AntDesign name="checkcircle" /></Text> :  <Text style={{color:'red'}}>{words[0]} <AntDesign name="closecircle"/></Text>:null}
      {!isEmpty(words[1]) ? word2 ? <Text style={{color:'green'}}>{words[1]}  <AntDesign name="checkcircle" /></Text> :  <Text style={{color:'red'}}>{words[1]} <AntDesign name="closecircle"/></Text>:null}
      {!isEmpty(words[2]) ? word3 ? <Text style={{color:'green'}}>{words[2]}  <AntDesign name="checkcircle" /></Text> :  <Text style={{color:'red'}}>{words[2]} <AntDesign name="closecircle"/></Text>:null}
      </View>
     <PageText checkWords={changeText} control={control}/>
      {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}
      <Level control={control}/>
      <View style={styles.buttonContainer}>
        <Button color={Color.cancelBtn} onPress={onClose}>Cancel</Button>
        <Button disabled={!isValid || !wordsValid()} color={Color.button} onPress={handleSubmit(handleForm)}>Submit</Button>
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
  words:{
    alignItems: 'flex-end',
    padding:5
  }
})

