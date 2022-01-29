import {View, Text} from 'react-native';
import {Button} from '../UI/Button';
import { levels } from '../../models/LanguageLevels';
type Props = {
    level: string;
    onSubmit: (rate: string) => void;
    onClose: () => void;
}
export const RateLevel: React.FC<Props> = ({ level, onSubmit, onClose }) => {
    const levelObj = levels.find(l => l.code === level);

    return levelObj ? <View >
        <Text>This text is level {levelObj.code} ({levelObj.text}). Do you agree? </Text>
        <View>
            <Button label='Agree' onPress={() => onSubmit(levelObj.code)}/>
            <Button label='¯\_(ツ)_/¯' onPress={onClose}/>
            <Text>No way, it's level...</Text>
            {levels.map(level => <Button label={`${level.code} (${level.text})`} key={level.code} onPress={() => onSubmit(level.code)}/>)}

        </View>
    </View> : <View><Text>Something went wrong</Text></View>
}