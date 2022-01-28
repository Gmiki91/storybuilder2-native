
import { Page } from "../models/Page";
import {View, Text} from 'react-native';

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
  const positiveBtn = toConfirm ? 'Accept' : 'Great';
  const negativeBtn = toConfirm ? 'Decline' : 'Awful';
  const rating = page.ratings.reduce((sum, rating) => sum + rating.rate, 0);
  return (<View>
      <Text>{page.level}</Text>
      <Text>{page.text}</Text>
      <Text>{rating}</Text>
      
  </View>)
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
}