import { View } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { levels } from '../../../models/LanguageLevels';
import { CheckBox } from '../../UI/CheckBox';

import styles from "./style";
type Props = {
  control: Control<FieldValues, object>
}
export const Level: React.FC<Props> = ({ control}) => {
  const list = levels.map(level =>
    <Controller
      key={level.code}
      control={control}
      name={level.code}
      render={({ field: { onChange, value } }) => 
        
          <CheckBox
            label={`${level.text} (${level.code})`}
            checked={value}
            onPress={onChange} />
        
      } />
  )
  
  return (
    <View style={styles.controllerContainer}>
     {list}
    </View>
  )
}

