import axios from "axios";
import { View, Text } from 'react-native';
import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";

type ParamList = {
    Params: { 
        userId: string
    };
};
type Props={
    userProp:User
}
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const Stats:React.FC<Props> = ({userProp}) => {
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [user, setUser] = useState<User>();

    useEffect(() => {
        if(!userProp){
            axios.get(`${LOCAL_HOST}/users/user/${params.userId}`, { headers })
                .then(result => {
                    setUser(result.data.user);
                })
            }else{
                setUser(userProp)
            }
    }, [params,headers]);

    return user ?
    <View>
        <Text style={{ fontSize: 36, marginTop: '50%' }}>Üdvözlöm {user.name}  </Text>
        
    </View>
    : <Text>Loading</Text>
}

export default Stats;