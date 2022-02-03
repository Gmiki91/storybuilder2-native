import { Text, View, } from 'react-native';
import { RadioButton,  } from 'react-native-paper';

type Props = {
    label: string,
    value: string
    status: 'checked' | 'unchecked',
    onPress: () => void
}

export const Radio: React.FC<Props> = ({ label, value, status, onPress }) => (
    <View style={{flexDirection: 'row'}}>
        <Text style={{ textAlignVertical: 'center' }}>{label}</Text>
        <RadioButton
            value={value}
            status={status}
            onPress={onPress}
        />
    </View>
)

