import { View, StyleSheet } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { CustomInput } from '../../UI/CustomInput';

type Props = {
    control: Control<FieldValues, object>
    checkWords:(event:string)=>void;
}
export const PageText: React.FC<Props> = ({ control,checkWords }) => {

    return (
        <View style={styles.controllerContainer}>
            <Controller
                control={control}
                name="text"
                rules={{
                    required: { value: true, message: 'Required' },
                    minLength: { value: 10, message: 'Minimum length is 10 characters' },
                    maxLength: { value: 5000, message: 'Maximum length is 5000 characters' },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                    <CustomInput
                        multiline
                        placeholder={'Write here...'}
                        value={value}
                        onBlur={onBlur}
                        onChangeText={(value)=>{onChange(value), checkWords(value)}} />
                )} />
        </View>

    )
}

const styles = StyleSheet.create({
    controllerContainer: {
        paddingLeft: 5,
        paddingRight: 5,
    }
});