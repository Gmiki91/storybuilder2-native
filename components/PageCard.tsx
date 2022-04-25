import { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { Page } from "../models/Page";
import { API_URL, Color } from "../Global";
import { Button, IconButton,Snackbar } from 'react-native-paper';
import { Author } from "./Author";
import { CustomText } from './UI/CustomText';
import { CustomInput } from './UI/CustomInput';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

type Props = {
  page: Page;
  pageNumber: number;
  totalPageNumber: number;
  userId: String;
  ownContent: boolean;
  toConfirm: boolean;
  archived: boolean;
  onRateText: (rate: number, confirming: boolean) => void;
  jump: (amount: number) => void;
}
export const PageCard: React.FC<Props> = ({ page, pageNumber, totalPageNumber, userId, ownContent, toConfirm, archived, onRateText, jump }) => {
  const { authToken } = useAuth();
  const [flipped, isFlipped] = useState(false);
  const [errorInput, setErrorInput] = useState('');
  const [correctionInput, setCorrectionInput] = useState('');
  const [snackMessage,setSnackMessage] = useState('');
  const rateByUser = page.ratings.find(rating => rating.userId === userId);
  const headers = { Authorization: `Bearer ${authToken}` };

  const getVote = (n: number) => {
    let vote = n;
    switch (rateByUser?.rate) {
      case 1: vote = n === 1 ? 0 : -2; break;
      case -1: vote = n === 1 ? 2 : 0; break;
    }
    onRateText(vote, toConfirm);
  }

  const submitCorrection = () =>{
    axios.post(`${API_URL}/pages/one/${page._id}`,{error:errorInput,correction:correctionInput}, { headers })
    .then(result => {
        if (result.data.status === "success") {
            page.corrections.push(result.data.correction);
            setErrorInput('');
            setCorrectionInput('');
          }
        })
        .catch(() => setSnackMessage('An error occured'));
  }

  const likeButtonColor = rateByUser?.rate === 1 ? Color.likeButton2 : Color.likeButton1;
  const likeButton = toConfirm ?
    <Button color={likeButtonColor} icon='check-circle-outline' disabled={ownContent && !toConfirm} onPress={() => getVote(1)} > Accept </Button>
    : <IconButton icon='arrow-up-bold-circle-outline' disabled={ownContent && !toConfirm} color={likeButtonColor} size={20} onPress={() => getVote(1)} />
  const dislikeButtonColor = rateByUser?.rate === -1 ? Color.dislikeButton2 : Color.dislikeButton1;
  const dislikeButton = toConfirm ?
    <Button color={dislikeButtonColor} icon='close-circle-outline' onPress={() => getVote(-1)} > Decline </Button>
    : <IconButton icon='arrow-down-bold-circle-outline' disabled={ownContent && !toConfirm} color={dislikeButtonColor} size={20} onPress={() => getVote(-1)} />
  const rating = page.ratings.reduce((sum, rating) => sum + rating.rate, 0);
  const author = <Author style={{ padding: 15 }} name={page.authorName} userId={page.authorId} />
  const corrections = page.corrections.map(correction => <View style={{ flexDirection: 'row', width:'100%', alignItems: 'flex-start', flexWrap:'wrap'}} key={correction.correction}>
    <Text style={{ color: Color.C }}>{correction.error} </Text>
    <Text style={{ color: 'black' }}>{' -> '}</Text>
    <Text style={{ color: Color.A }}>{correction.correction}</Text>
  </View>)
  return (
    <View style={{ ...styles.container, width: `${100 / totalPageNumber}%` }}>
      <ImageBackground resizeMode="stretch" style={{ padding: '3%', flex: 1, margin: '1%' }} source={require('../assets/pagecard.jpg')}>
        {!flipped && <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <CustomText lang={page.language} style={{ paddingLeft: 20, paddingRight: 20, flex: 1, fontSize: 16, textAlignVertical: 'center' }} >{page.text}</CustomText>
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row' }}>
              {likeButton}
              <Text style={{ alignSelf: 'center', textAlign: 'center', width: 20 }}>{rating}</Text>
              {dislikeButton}
            </View>
            <IconButton icon='spellcheck'  color={Color.A} size={20} onPress={() => isFlipped(true)}/>
            {!toConfirm && !archived && author}
          </View>
          {toConfirm && author}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 5 }}>
            <Button disabled={pageNumber === 1} mode='outlined' color={Color.button} onPress={() => jump(-10)}>{'<<'}</Button>
            <Button disabled={pageNumber === 1} mode='outlined' color={Color.button} onPress={() => jump(-1)}>{'<'}</Button>
            <Text style={{ textAlignVertical: 'center' }}> {pageNumber} / {totalPageNumber}</Text>
            <Button disabled={pageNumber === totalPageNumber} mode='outlined' color={Color.button} onPress={() => jump(1)}>{'>'}</Button>
            <Button disabled={pageNumber === totalPageNumber} mode='outlined' color={Color.button} onPress={() => jump(10)}>{'>>'}</Button>
          </View>
        </ScrollView>}
        {flipped && <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          {corrections}
          <CustomInput style={{width:200, backgroundColor:Color.main}} onChangeText={setErrorInput} placeholder="Error" ></CustomInput>
          <CustomInput style={{width:200, backgroundColor:Color.main}} onChangeText={setCorrectionInput} placeholder="Correction"></CustomInput>
          <Button disabled={errorInput.trim()==='' || correctionInput.trim()===''} color={Color.button} onPress={submitCorrection}>Add Correction</Button>
          <IconButton
            style={styles.backButton}
            icon="keyboard-return"
            color={Color.button}
            size={20}
            onPress={() => isFlipped(false)}
          />
       
        </ScrollView>}
      </ImageBackground>
      <Snackbar onDismiss={() => setSnackMessage('')} visible={snackMessage != ''} duration={2000}>{snackMessage} </Snackbar>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    marginBottom: 15,
  },
  backButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  }

})
