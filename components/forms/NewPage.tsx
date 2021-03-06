import { View, StyleSheet,Text } from 'react-native';
import { useForm, FieldValues } from 'react-hook-form'
import { Form } from '../UI/Form';
import { AntDesign } from "@expo/vector-icons";
import { Button } from 'react-native-paper'
import { Color } from '../../Global';
import {PageText} from './elements/PageText';
import { ErrorMessage } from '../../components/UI/ErrorMessage';
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


  const changeText=(event:string)=>{
    const eventLC = event.toLocaleLowerCase();
    if(eventLC.includes(words[0]) && !word1) setWord1(true);
    if(!eventLC.includes(words[0]) && word1) setWord1(false);
    if(eventLC.includes(words[1]) && !word2) setWord2(true);
    if(!eventLC.includes(words[1]) && word2) setWord2(false);
    if(eventLC.includes(words[2]) && !word3) setWord3(true);
    if(!eventLC.includes(words[2]) && word3) setWord3(false);
  }

  const isEmpty = (value: string)=> value===null || value===undefined || value.trim()==='';
  const wordsValid = ()=> (isEmpty(words[0]) || word1) && (isEmpty(words[1]) || word2) && (isEmpty(words[2]) || word2);
  
  return (
    <Form>
      <View style={styles.words}>
      {!isEmpty(words[0]) ? word1 ? <Text onPress={()=>setWord1(false)} style={{color:'green'}}>{words[0]} <AntDesign name="checkcircle" /></Text> :  <Text onPress={()=>setWord1(true)} style={{color:'red'}}>{words[0]} <AntDesign name="closecircle"/></Text>:null}
      {!isEmpty(words[1]) ? word2 ? <Text onPress={()=>setWord2(false)} style={{color:'green'}}>{words[1]}  <AntDesign name="checkcircle" /></Text> :  <Text onPress={()=>setWord2(true)}  style={{color:'red'}}>{words[1]} <AntDesign name="closecircle"/></Text>:null}
      {!isEmpty(words[2]) ? word3 ? <Text  onPress={()=>setWord3(false)} style={{color:'green'}}>{words[2]}  <AntDesign name="checkcircle" /></Text> :  <Text onPress={()=>setWord3(true)}  style={{color:'red'}}>{words[2]} <AntDesign name="closecircle"/></Text>:null}
      </View>
     <PageText checkWords={changeText} control={control}/>
      {errors.text && <ErrorMessage>{errors.text.message}</ErrorMessage>}
      <View style={styles.buttonContainer}>
        <Button color={Color.cancelBtn} onPress={onClose}>Cancel</Button>
        <Button disabled={!isValid || !wordsValid()} color={Color.button} onPress={handleSubmit(onSubmit)}>Submit</Button>
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10
  },
  words:{
    alignItems: 'flex-end',
    padding:5
  }
})

