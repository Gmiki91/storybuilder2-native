import { View, Text, StyleSheet, ImageBackground, ScrollView, Image } from 'react-native';
import { Page } from "../models/Page";
import { Color } from "../Global";
import { Button, IconButton } from 'react-native-paper';
import { Author } from "./Author";
import React from 'react';

type Props = {
  page: Page;
  pageNumber: number;
  totalPageNumber: number;
  userId: String;
  ownContent: boolean;
  toConfirm: boolean;
  onRateLevel: (page:Page) => void;
  onRateText: (rate: number, confirming: boolean) => void;
}
export const PageCard: React.FC<Props> = ({ page, pageNumber, totalPageNumber, userId, ownContent, toConfirm, onRateLevel, onRateText }) => {

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
  const author = <Author style={{ padding: 15 }} name={page.authorName} userId={page.authorId} />

  return (
    <View style={{...styles.container,width: `${100 / totalPageNumber}%` }}>
      <ImageBackground style={{ height: '100%', flexDirection:'row'}} source={require('../assets/papyrus.jpg')}>
      {pageNumber===1 && <Image style={styles.scroll} source={require('../assets/scrolls/left.png')} />}
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Button mode='outlined' color={Color[page.level.code]} style={styles.level} onPress={()=>onRateLevel(page)}><Text style={{ fontSize: 18 }}>{page.level.code}</Text></Button>
          <Text style={{ paddingLeft: 10, paddingRight: 10, flex: 1 }} >{page.text}</Text>

          <View style={styles.footer}>
            
            <View style={{ flexDirection: 'row' }}>
              {likeButton}
              <Text style={{ alignSelf: 'center', textAlign: 'center', width: 20 }}>{rating}</Text>
              {dislikeButton}
            </View>
            {!toConfirm&&author}
          </View>
          {toConfirm&&author}
          <Text style={{ alignSelf: 'center', }}> {pageNumber} / {totalPageNumber}</Text>
        </ScrollView>
        {pageNumber===totalPageNumber && <Image style={styles.scroll} source={require('../assets/scrolls/right.png')} />}
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    borderBottomWidth: 5,
    borderWidth: 1,
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
  level: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 22,
    width: 32,
    borderRadius: 50,
    margin: 5
  },
  scroll: {
    height:'100%',
    width:25
}
})
