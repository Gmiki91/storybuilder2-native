import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Page } from "../models/Page";
import { Color } from "../Global";
import { Button, IconButton } from 'react-native-paper';
import { Author } from "./UI/Author";
import React from 'react';

type Props = {
  page: Page;
  pageNumber:string;
  userId: String;
  ownContent: boolean;
  toConfirm: boolean;
  onRateLevel: () => void;
  onRateText: (rate: number, confirming: boolean) => void;
}
export const PageCard: React.FC<Props> = ({ page,pageNumber, userId, ownContent, toConfirm, onRateLevel, onRateText }) => {

  const rateByUser = page.ratings.find(rating => rating.userId === userId);

  const getVote = (n: number) => {
    let vote = n;
    switch (rateByUser?.rate) {
      case 1: vote = n === 1 ? 0 : -2; break;
      case -1: vote = n === 1 ? 2 : 0; break;
    }
    onRateText(vote, toConfirm);
  }


  const likeButtonColor = rateByUser?.rate === 1 ? Color.lightGreen : Color.darkGreen;
  const likeButton = toConfirm ?
    <Button color={likeButtonColor} icon='check-circle-outline' disabled={ownContent && !toConfirm} onPress={() => getVote(1)} > Accept </Button>
    : <IconButton icon='arrow-up-bold-circle-outline' disabled={ownContent && !toConfirm} color={likeButtonColor} size={20} onPress={() => getVote(1)} />
  const dislikeButtonColor = rateByUser?.rate === -1 ? Color.lightRed : Color.darkRed;
  const dislikeButton = toConfirm ?
    <Button color={dislikeButtonColor} icon='close-circle-outline' onPress={() => getVote(-1)} > Decline </Button>
    : <IconButton icon='arrow-down-bold-circle-outline' disabled={ownContent && !toConfirm} color={dislikeButtonColor} size={20} onPress={() => getVote(-1)} />
  const rating = page.ratings.reduce((sum, rating) => sum + rating.rate, 0);

  return (
    <View style={styles.container}>
      <ImageBackground style={{ width: '100%', height: '100%' }} imageStyle={{ borderRadius: 10 }} source={require('../assets/papyrus.jpg')}>
        <Button mode='outlined' color={Color[page.level.code]} style={styles.level} onPress={onRateLevel}><Text style={{ fontSize: 18 }}>{page.level.code}</Text></Button>
        <Text style={{ paddingLeft: 10, paddingRight: 10 }} >{page.text}</Text>

        <View style={styles.footer}>
          <View style={{ flexDirection: 'row' }}>
            {likeButton}
            <Text style={{ alignSelf: 'center', textAlign: 'center', width: 20 }}>{rating}</Text>
            {dislikeButton}
          </View>
        {!toConfirm && <Author name={page.authorName} />}
        </View>
        {toConfirm && <Author name={page.authorName} />}
          <Text style={{ alignSelf: 'center',}}> {pageNumber}</Text>
      </ImageBackground>
    </View>)

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '70%',
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
  },
  
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 32,
    marginBottom: 15,
},
  level: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 22,
    width: 32,
    borderRadius: 50,
    margin:5
  }
})
