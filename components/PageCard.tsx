
import { Page } from "../models/Page";
import { View, Text,Pressable, StyleSheet } from 'react-native';
import { SimpleLineIcons } from '@expo/vector-icons'; 
import { Color } from "../Global";
import { Button } from "./UI/Button";

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

  const getColor = () => {
    switch (page.level) {
      case 'A': return '#8fffba';
      case 'A+': return '#5fd48c';
      case 'B': return '#fffc80';
      case 'B+': return '#ffba3b';
      case 'C': return '#ff8080';
      case 'N': return '#d6d6d6';
    }
  }

  const backgroundColor = getColor();
  const positiveBtn = toConfirm ? 'Accept' : <SimpleLineIcons name="like" size={24} color="black" />;
  const negativeBtn = toConfirm ? 'Decline' : <SimpleLineIcons name="dislike" size={24} color="black" />;
  const rating = page.ratings.reduce((sum, rating) => sum + rating.rate, 0);
  return (<View style={styles.container}>
    <Pressable onPress={onRateLevel}><Text style={[styles.level, {backgroundColor:backgroundColor}]}>{page.level}</Text></Pressable>
    <Text>{page.text}</Text>

    <View style={styles.footer}>
      <View style={styles.rating}>
        <Button label={positiveBtn} hidden={ownContent && !toConfirm} onPress={()=>getVote(1)} />
        <Text style={{alignSelf:'center', marginLeft:10, marginRight:10}}>{rating}</Text>
        <Button label={negativeBtn} hidden={ownContent && !toConfirm} onPress={()=>getVote(-1)} />
      </View>
      <Text style={styles.authorName}>{page.authorName}</Text>
    </View>
  </View>)

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: 'white',
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

//   return <>
//     <div className="card">
//       <div className="card-level" style={{ backgroundColor: backgroundColor }} onClick={onRateLevel}>
//         {page.level}</div>
//       <h2 className="card-text">{page.text}</h2>
//       <div className="card-rate">
//         <button disabled={ownContent && !toConfirm} onClick={() => getVote(1)}>{positiveBtn}</button>
//         <p>{rating}</p>
//         <button disabled={ownContent && !toConfirm} onClick={() => getVote(-1)}>{negativeBtn}</button>
//       </div>
//     </div>
//   </>
