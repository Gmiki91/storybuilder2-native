
import { Page } from "../models/Page";
import { View, Text,Pressable, StyleSheet } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Color } from "../Global";
import { Button } from "./UI/Button";
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

  const likeButtonColor = rateByUser?.rate===1 ? Color.lightGreen : Color.darkGreen;
  const dislikeButtonColor = rateByUser?.rate===-1? Color.lightRed : Color.darkRed;
  const positiveBtn = toConfirm ? 'Accept' : <SimpleLineIcons name="like" size={24} color="black" />;
  const negativeBtn = toConfirm ? 'Decline' : <SimpleLineIcons name="dislike" size={24} color="black" />;
  const rating = page.ratings.reduce((sum, rating) => sum + rating.rate, 0);

  return (<View style={styles.container}>
    <Pressable onPress={onRateLevel}><Text style={[styles.level, {backgroundColor:Color[page.level.code]}]}>{page.level.code}</Text></Pressable>
    <Text>{page.text}</Text>

    <View style={styles.footer}>
      <View style={styles.rating}>
        <Button style={{backgroundColor:likeButtonColor }} label={positiveBtn} hidden={ownContent && !toConfirm} onPress={()=>getVote(1)} />
        <Text style={{alignSelf:'center', marginLeft:10, marginRight:10}}>{rating}</Text>
        <Button style={{backgroundColor:dislikeButtonColor}} label={negativeBtn} hidden={ownContent && !toConfirm} onPress={()=>getVote(-1)} />
      </View>
      <Author name={page.authorName}/>
    </View>
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
    padding: 20,
  },
  footer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },

  level: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize:22,
    width: 32
  },
  rating: {
    flexDirection: 'row',
    width:'60%'
  },
  authorName: {
    textAlign: 'right',
    width: '40%',
  },
})
