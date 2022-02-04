import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Page } from "../models/Page";
import { Color } from "../Global";
import { Button, IconButton } from 'react-native-paper';
import { Author } from "./UI/Author";

type Props = {
  page: Page;
  userId: String;
  ownContent: boolean;
  toConfirm: boolean;
  onRateLevel: () => void;
  onRateText: (rate: number, confirming: boolean) => void;
}
export const PageCard: React.FC<Props> = ({ page, userId, ownContent, toConfirm, onRateLevel, onRateText }) => {

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
  :<IconButton icon='arrow-up-bold-circle-outline' disabled={ownContent && !toConfirm} color={likeButtonColor} size={20} onPress={() => getVote(1)} />
  const dislikeButtonColor = rateByUser?.rate === -1 ? Color.lightRed : Color.darkRed;
  const dislikeButton = toConfirm ? 
  <Button color={dislikeButtonColor} icon='close-circle-outline'  onPress={() => getVote(-1)} > Decline </Button> 
  :<IconButton icon='arrow-down-bold-circle-outline' disabled={ownContent && !toConfirm} color={dislikeButtonColor} size={20} onPress={() => getVote(-1)} />
  const rating = page.ratings.reduce((sum, rating) => sum + rating.rate, 0);

  return (<View style={styles.container}>
    <Button mode='outlined' color={Color[page.level.code]} style={[styles.level,{borderRadius:50}]} onPress={onRateLevel}><Text style={{fontSize:18}}>{page.level.code}</Text></Button>
    <Text>{page.text}</Text>

    <View style={styles.footer}>
      <View style={{flexDirection: 'row'}}>
        {likeButton}
        <Text style={{ alignSelf: 'center', textAlign: 'center',width:20 }}>{rating}</Text>
       {dislikeButton}
      </View>
    </View>
      <Author name={page.authorName} />
  </View>)

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Color.secondary,
    height: '70%',
    width: '80%',
    borderWidth: 1,
    borderRadius: 10,
    padding:10
  },
  footer: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  level: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 22,
    width: 32
  }
})
