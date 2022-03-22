import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import Stats from "../components/Stats";
import { CustomInput } from "../components/UI/CustomInput";
import { ActivityIndicator, Button, Divider, IconButton, Snackbar } from "react-native-paper";
import { Color } from "../Global";
import { useIsFocused } from "@react-navigation/native";
import { Note } from "../models/Note";

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
    const isFocused = useIsFocused();
    const [tab, setTab] = useState<Tab>('Notifications');
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

    const confirmed = async () => {
        setToken(undefined);
        await AsyncStorage.removeItem('token');
    }
    
    return user ?
    <View style={{ flex: 1, flexDirection: 'column', marginTop: '15%' }}>
            <Snackbar onDismiss={() => setResponse('')} visible={response !== ''} duration={3000}>{response}</Snackbar>
            <ScrollView >
                <View style={styles.header}>
                    <IconButton icon="alert-octagram" onPress={() => setTab('Notifications')} style={{ marginLeft: '2%' }} color={tab === 'Notifications' ? Color.cancelBtn : Color.button} />
                    <IconButton icon="cogs" onPress={() => setTab('Settings')} style={{ marginLeft: '2%' }} color={tab === 'Settings' ? Color.cancelBtn : Color.button} />
                    <IconButton icon="chart-bar" onPress={() => setTab('Stats')} style={{ marginLeft: '2%' }} color={tab === 'Stats' ? Color.cancelBtn : Color.button} />
                    <IconButton icon="exit-to-app" onPress={handleLogout} style={{ marginLeft: '2%' }} color={tab === 'Logout' ? Color.cancelBtn : Color.button} />
                </View>
                {tab === 'Logout' && <Text style={styles.goodbye}> Good-bye! </Text>}
                {tab === 'Stats' && <Stats userProp={user}> </Stats>}
                {tab === 'Notifications' &&
                    <View style={styles.container}>
                        <View style={styles.card}>
                            {notifications.map((notification) =>
                            <View key={notification.date}>
                            <Text >{notification.message}</Text>
                            <Divider/>
                            </View>)}
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
        : <ActivityIndicator style={{justifyContent: 'center', alignItems: 'center', flex:1}} size={'large'} animating={!user} color={Color.secondary} />
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: '5%',
        marginRight: '5%',
        borderWidth: 1,
        backgroundColor: Color.storyCard
    },

    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        padding: '5%',
        backgroundColor: Color.storyCard,
        borderWidth: 1,
        borderRadius: 10,
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