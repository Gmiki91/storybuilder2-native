import { View, StyleSheet } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker';
import { levels } from '../../../models/LanguageLevels';

type Props = {
    control: Control<FieldValues, object>
}
export const Level: React.FC<Props> = ({ control }) => (
    <View style={styles.controllerContainer}>
        <Controller
          control={control}
          name="level"
          render={({ field: { onChange, value, onBlur } }) => (
            <Picker
              selectedValue={value}
              onBlur={onBlur}
              onValueChange={value => onChange(value)} >
              {levels.map(level => {
                return <Picker.Item key={level.code} value={level.code} label={`${level.text} (${level.code})`} />
              })}
            </Picker>
          )} />
      </View>
    
)

const styles = StyleSheet.create({
    controllerContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    }
});