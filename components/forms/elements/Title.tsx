import { View } from 'react-native';
import { Controller, FieldValues, Control } from 'react-hook-form'
import { CustomInput } from '../../UI/CustomInput';
import styles from "./style"
type Props = {
    control: Control<FieldValues, object>
}
export const Title: React.FC<Props> = ({ control }) => {

    return (
        <View style={styles.controllerContainer}>
            <Controller
                control={control}
                name="title"
                rules={{
                    required: { value: true, message: 'Required' },
                    minLength: { value: 3, message: 'Minimum length is 3 characters' },
                    maxLength: { value: 100, message: 'Maximum length is 100 characters' },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                    <CustomInput
                        style={{ fontSize: 22 }}
                        placeholder="Story title"
                        value={value}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)} />
                )} />
        </View>
    )
}