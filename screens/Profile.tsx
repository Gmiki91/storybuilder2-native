import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text,ScrollView } from 'react-native';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import Stats from "../components/Stats";
import { CustomInput } from "../components/UI/CustomInput";
import { Button, Divider, Snackbar } from "react-native-paper";
import { Color } from "../Global";

const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const Profile = () => {
    const { token, setToken } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [user, setUser] = useState<User>();
    const [currentPassword, setCurrentPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [response, setResponse] = useState('');

    useEffect(() => {
        axios.get(`${LOCAL_HOST}/users/`, { headers })
            .then(result => {
                setUser(result.data.user);
            })
    }, []);

    const handlePasswordChange = () => {
        axios.patch(`${LOCAL_HOST}/users/updatePassword`, { currentPassword, newPassword }, { headers })
            .then(result => {
               setResponse(result.data.message);
                setToken(result.data.token);
            })
            .catch(error => setResponse(error.response.data.message));
    }

    const handleDeleteUser = () => {
        axios.patch(`${LOCAL_HOST}/users/`, {deletePassword}, { headers })
            .then(() => {
                AsyncStorage.removeItem('token');
                setToken(undefined);
            })
            .catch(error => setResponse(error.response.data.message));
    }


    return user ?
        <ScrollView>
            <Stats userProp={user}>
                <View style={{paddingTop:40,marginTop:40, borderTopWidth:1}}>
                    <Text>Update password:</Text>
                    <CustomInput secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder='Current password' />
                    <CustomInput secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder='New password' />
                    <Button mode="outlined" color={Color.button} onPress={handlePasswordChange}>Update</Button>
                </View>
                <View style={{marginTop:30}}>
                    <Text>Delete account:</Text>
                    <CustomInput secureTextEntry value={deletePassword} onChangeText={setDeletePassword} placeholder='Current password' />
                    <Button mode="outlined" color={Color.button} onPress={handleDeleteUser}>Delete</Button>
                </View>
            <Snackbar onDismiss={() => setResponse('')} visible={response !== ''} duration={3000}>{response}</Snackbar>
            </Stats>
        </ScrollView>
        : <Text>Loading</Text>

}

export default Profile;