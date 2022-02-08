import axios from "axios";
import { View, Text } from 'react-native';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import Stats from "../components/Stats";
import { Form } from "../components/UI/Form";

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
    }, []);

    return user ?
    <View>
            <Stats userProp={user}/>
            <Form>
            <Text>Update password</Text>
            <Text>Delete user</Text>
            </Form>
            </View>
        : <Text>Loading</Text>

}

export default Profile;