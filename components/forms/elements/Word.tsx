import { View, StyleSheet } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { CustomInput } from '../../UI/CustomInput';

type Props = {
    control: Control<FieldValues, object>
    name:string;
    required?:boolean;
    placeholder?:string
}
export const Word: React.FC<Props> = ({ control, name, required,placeholder }) => (
    <View style={styles.controllerContainer}>
        <Controller
                control={control}
                name={name}
                rules={{
                    required: { value: required || false, message: 'Required' },
                    maxLength: { value: 50, message: 'Maximum length is 50 characters' },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                    <CustomInput
                        placeholder={placeholder || ''}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={onChange} />
                )} />
    </View>
    
)

const styles = StyleSheet.create({
    controllerContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    }
});