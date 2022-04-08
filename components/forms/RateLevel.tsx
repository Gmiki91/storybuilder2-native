import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { Form } from '../UI/Form';
import { Color } from '../../Global';
import { Level, levels } from '../../models/LanguageData';
type Props = {
    level: Level;
    onSubmit: (rate: string) => void;
    onClose: () => void;
}
export const RateLevel: React.FC<Props> = ({ level, onSubmit, onClose }) => {
    const currentLevel = levels.find(l => l.code === level.code);
    return currentLevel ? <Form>
        <Text>This story is level {currentLevel.code} ({currentLevel.text}). </Text>
        <Text>Do you agree?</Text>
        <View style={{ flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Button style={{ margin: 15 }} color={Color.button} onPress={() => onSubmit(currentLevel.code)} >Agree</Button>
                <Button style={{ margin: 15 }} color={Color.button} onPress={onClose} >Can't tell</Button>
            </View>
            <Text>No way, it's level...</Text>
            <View style={{ flexDirection: 'column', }}>
                {levels.map(level => {
                    if (level.code !== currentLevel.code)
                        return <Button color={Color[level.code]} style={{ margin: 5 }} key={level.code} onPress={() => onSubmit(level.code)}>
                            {level.code} ({level.text})
                            </Button>
                })}
            </View>
        </View>
    </Form>
        : <View><Text>Something went wrong</Text></View>
}
