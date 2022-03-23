import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, StyleSheet, Alert, Pressable } from 'react-native';
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import Stats from "../components/Stats";
import { CustomInput } from "../components/UI/CustomInput";
import { ActivityIndicator, Button,  IconButton, Snackbar } from "react-native-paper";
import { Color } from "../Global";
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { Note } from "../models/Note";
import moment from "moment";
import { Top } from "../components/UI/Top";
import { SadMessageBox } from "../components/UI/SadMessageBox";

const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
type Tab = 'Notifications' | 'Stats' | 'Settings' | 'Logout';
const Profile = () => {
    const { token, setToken } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [user, setUser] = useState<User>({} as User);
    const [notifications, setNotifications] = useState<Note[]>([])
    const [currentPassword, setCurrentPassword] = useState('');
    const [deletePassword, setDeletePassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [response, setResponse] = useState('');
    const [tab, setTab] = useState<Tab>('Notifications');
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    useEffect(() => {
        let mounted = true;
        if (isFocused) {
            axios.get(`${LOCAL_HOST}/users/`, { headers })
                .then(result => {
                    if (mounted)
                        setUser(result.data.user);
                }).catch(error => setResponse(error.response.data.message));

            axios.get(`${LOCAL_HOST}/notifications/`, { headers })
                .then(result => {
                    if (mounted)
                        setNotifications(result.data.notifications);
                }).catch(error => setResponse(error.response.data.message));
        }
        return () => { mounted = false }
    }, [isFocused]);

    const handlePasswordChange = () => {
        axios.patch(`${LOCAL_HOST}/users/updatePassword`, { currentPassword, newPassword }, { headers })
            .then(result => {
                setResponse(result.data.message);
                setToken(result.data.token);
            })
            .catch(error => setResponse(error.response.data.message));
    }

    const handleDeleteUser = () => {

        axios.patch(`${LOCAL_HOST}/users/`, { deletePassword }, { headers })
            .then(() => {
                axios.delete(`${LOCAL_HOST}/stories/all`, { headers }).catch(error => setResponse(error.response.data.message));
                AsyncStorage.removeItem('token');
                setToken(undefined);
            })
            .catch(error => setResponse(error.response.data.message));
    }
    const handleLogout = () => {
        setTab('Logout');
        Alert.alert(
            "Logging out",
            "",
            [
                { text: "Cancel", onPress: () => setTab('Notifications') },
                { text: "OK", onPress: () => confirmed() }
            ]
        );
    }

    
    const goToStory = (storyId: string) => {
        navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId } }))
    }

    const confirmed = async () => {
        setToken(undefined);
        await AsyncStorage.removeItem('token');
    }

    return user ?
        <View style={{ flex: 1, flexDirection: 'column', marginTop: '15%' }}>
            <Snackbar onDismiss={() => setResponse('')} visible={response !== ''} duration={3000}>{response}</Snackbar>
            <Top>
                <IconButton icon="alert-octagram" onPress={() => setTab('Notifications')} style={{ marginLeft: '2%' }} color={tab === 'Notifications' ? Color.cancelBtn : Color.button} />
                <IconButton icon="cogs" onPress={() => setTab('Settings')} style={{ marginLeft: '2%' }} color={tab === 'Settings' ? Color.cancelBtn : Color.button} />
                <IconButton icon="chart-bar" onPress={() => setTab('Stats')} style={{ marginLeft: '2%' }} color={tab === 'Stats' ? Color.cancelBtn : Color.button} />
                <IconButton icon="exit-to-app" onPress={handleLogout} style={{ marginLeft: '2%' }} color={tab === 'Logout' ? Color.cancelBtn : Color.button} />
            </Top>
            <ScrollView >
                {tab === 'Logout' && <SadMessageBox message="Good-bye!"/>}
                {tab === 'Stats' && <Stats userProp={user}> </Stats>}
                {tab === 'Notifications' &&
                    <View style={styles.container}>
                        <View style={styles.card}>
                            {notifications.map((notification) =>
                                <Pressable onPress={()=>goToStory(notification.storyId)} style={{ padding: '3%', marginBottom: '1%', borderRadius: 10, backgroundColor: Color[notification.code] }} key={notification.date}>
                                    <Text>{notification.message}</Text>
                                    <Text style={{textAlign: 'right'}}>{moment.utc(notification.date).local().startOf('seconds').fromNow()}</Text>
                                </Pressable>)}
                        </View>
                    </View>}
                {tab === 'Settings' &&
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <Text>Update password:</Text>
                            <CustomInput secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder='Current password' />
                            <CustomInput secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder='New password' />
                            <Button color={Color.button} onPress={handlePasswordChange}>Update</Button>
                            <Text>Delete account:</Text>
                            <CustomInput secureTextEntry value={deletePassword} onChangeText={setDeletePassword} placeholder='Current password' />
                            <Button color={Color.button} onPress={handleDeleteUser}>Delete</Button>
                        </View>
                    </View>}
            </ScrollView>
        </View>
        : <ActivityIndicator style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }} size={'large'} animating={!user} color={Color.secondary} />
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        padding: '5%',
        backgroundColor: Color.storyCard,
        borderWidth: 1,
        elevation: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    goodbye: {
        fontSize: 64,
        color: Color.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    }
})

export default Profile;