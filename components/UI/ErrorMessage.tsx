import { View, Text } from 'react-native';
export const ErrorMessage: React.FC<React.ReactNode> = ({ children }) => <View>
    <Text style={{color:'red'}}>{children}</Text>
</View>

