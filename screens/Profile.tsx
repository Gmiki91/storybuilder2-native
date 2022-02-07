import axios from "axios";
import { View, Text } from 'react-native';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import Stats from "../components/Stats";

const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const Profile = () => {
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [user, setUser] = useState<User>();

    useEffect(() => {
        axios.get(`${LOCAL_HOST}/users/`, { headers })
            .then(result => {
                setUser(result.data.user);
            })
    }, [headers]);

    return user ?
        <View>
            <Text style={{ fontSize: 36, marginTop: '50%' }}>Szia {user.name}  </Text>
            <Stats userProp={user}/>
        </View>
        : <Text>Loading</Text>

}

export default Profile;