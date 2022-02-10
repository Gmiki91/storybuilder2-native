import { View, Text, StyleSheet, ImageBackground, ScrollView, Image, Pressable } from 'react-native';
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
  onRateLevel: (page: Page) => void;
  onRateText: (rate: number, confirming: boolean) => void;
  jump: (amount: number) => void;
}
export const PageCard: React.FC<Props> = ({ page, pageNumber, totalPageNumber, userId, ownContent, toConfirm, onRateLevel, onRateText, jump }) => {

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
    <View style={{ ...styles.container, width: `${100 / totalPageNumber}%` }}>
        { pageNumber === 1 && <Image style={styles.edge} source={require('../assets/scrolls/leftedge.png')} />} 
      <ImageBackground style={{flex:1,  flexDirection: 'row',paddingBottom:'10%', paddingTop:'10%' }} source={require('../assets/scrolls/papir.png')}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <Button mode='outlined' color={Color[page.level.code]} style={styles.level} onPress={() => onRateLevel(page)}><Text style={{ fontSize: 18 }}>{page.level.code}</Text></Button>
          <Text style={{ paddingLeft: 10, paddingRight: 10, flex: 1 }} >{page.text}</Text>
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row' }}>
              {likeButton}
              <Text style={{ alignSelf: 'center', textAlign: 'center', width: 20 }}>{rating}</Text>
              {dislikeButton}
            </View>
            {!toConfirm && author}
          </View>
          {toConfirm && author}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingBottom: 5 }}>
            <Button disabled={pageNumber===1} mode='outlined' color={Color.button} onPress={() => jump(-10)}>{'<<'}</Button>
            <Button disabled={pageNumber===1} mode='outlined' color={Color.button} onPress={() => jump(-1)}>{'<'}</Button>
            <Text style={{textAlignVertical:'center'}}> {pageNumber} / {totalPageNumber}</Text>
            <Button disabled={pageNumber===totalPageNumber} mode='outlined' color={Color.button} onPress={() => jump(1)}>{'>'}</Button>
            <Button  disabled={pageNumber===totalPageNumber} mode='outlined' color={Color.button} onPress={() => jump(10)}>{'>>'}</Button>
          </View>
        </ScrollView>
      </ImageBackground>
        { pageNumber === totalPageNumber && <Image style={styles.edge} source={require('../assets/scrolls/rightedge.png')} /> }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
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
  level: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 22,
    width: 32,
    borderRadius: 50,
    margin: 5
  },
  edge: {
    height: '100%',
    width: '10%',
  }
})
