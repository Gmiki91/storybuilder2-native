import { View, Text } from 'react-native';
export const ErrorMessage: React.FC<React.ReactNode> = ({ children }) => <View>
    <Text style={{color:'red', marginLeft:5, fontSize:10}}>{children}</Text>
</View>

