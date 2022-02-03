import { View, Text } from 'react-native';
import { Button } from '../UI/Button';
import { Form } from '../UI/Form';
import { Color } from '../../Global';
import { Level, levels } from '../../models/LanguageLevels';
type Props = {
    level: Level;
    onSubmit: (rate: string) => void;
    onClose: () => void;
}
export const RateLevel: React.FC<Props> = ({ level, onSubmit, onClose }) => {
    const levelObj = levels.find(l => l.code === level.code);

    return levelObj ? <Form>
        <Text>This text is level {levelObj.code} ({levelObj.text}). </Text>
        <Text>Do you agree?</Text>
        <View style={{ flexDirection: 'column'}}>
            <View style={{ flexDirection: 'row', justifyContent: 'center'}}>
                <Button style={{  margin:15 }} label='Agree' onPress={() => onSubmit(levelObj.code)} />
                <Button style={{ backgroundColor: 'grey', margin:15 }} label={'Can\'t tell'} onPress={onClose} />
            </View>
            <Text>No way, it's level...</Text>
            <View style={{ flexDirection: 'column', }}>
                {levels.map(level => <Button style={{  margin:5, backgroundColor:Color[level.code]}} label={`${level.code} (${level.text})`} key={level.code} onPress={() => onSubmit(level.code)} />)}
            </View>
        </View>
    </Form>
        : <View><Text>Something went wrong</Text></View>
}

