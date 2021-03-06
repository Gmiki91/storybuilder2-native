import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ScrollView, StyleSheet, Alert, Pressable, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from "react";
import * as GoogleSignIn from 'expo-google-sign-in';
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import Stats from "../components/Stats";
import { CustomInput } from "../components/UI/CustomInput";
import { ActivityIndicator, Button,  IconButton, Snackbar } from "react-native-paper";
import { Color, API_URL } from "../Global";
import { CommonActions, useIsFocused, useNavigation } from "@react-navigation/native";
import { Note } from "../models/Note";
import moment from "moment";
import { Top } from "../components/UI/Top";
import { SadMessageBox } from "../components/UI/SadMessageBox";
import About from "../components/About";

type Tab = 'Notifications' | 'Stats' | 'Settings' | 'Logout' | 'About';
const Profile = () => {
    const { authToken, setToken } = useAuth();
    const headers = { Authorization: `Bearer ${authToken}` };
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
        if (isFocused) {
            axios.get(`${API_URL}/users/`, { headers })
                .then(result => {
                        setUser(result.data.user);
                }).catch(error => setResponse(error.response.data.message));

            axios.get(`${API_URL}/notifications/`, { headers })
                .then(result => {
                        setNotifications(result.data.notifications);
                }).catch(error => setResponse(error.response.data.message));
        }
    }, [isFocused]);

    const handlePasswordChange = () => {
        axios.patch(`${API_URL}/users/updatePassword`, { currentPassword, newPassword }, { headers })
            .then(result => {
                setResponse('Password has been changed!');
                setToken(result.data.token);
            })
            .catch(error => setResponse(error.response.data.message));
    }

    const handleDeleteUser = () => {

        axios.patch(`${API_URL}/users/`, { deletePassword }, { headers })
            .then(() => {
                axios.delete(`${API_URL}/stories/all`, { headers }).catch(error => setResponse(error.response.data.message));
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
        await GoogleSignIn.signOutAsync();
        await AsyncStorage.removeItem('token');
    }

    return user ?
        <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
            <Snackbar onDismiss={() => setResponse('')} visible={response !== ''} duration={2000}>{response}</Snackbar>
            <Top>
                <IconButton icon="alert-octagram" onPress={() => setTab('Notifications')} style={{ marginLeft: '2%' }} color={tab === 'Notifications' ? Color.cancelBtn : Color.button} />
                <IconButton icon="chart-bar" onPress={() => setTab('Stats')} style={{ marginLeft: '2%' }} color={tab === 'Stats' ? Color.cancelBtn : Color.button} />
                <IconButton icon="cogs" onPress={() => setTab('Settings')} style={{ marginLeft: '2%' }} color={tab === 'Settings' ? Color.cancelBtn : Color.button} />
                <IconButton icon="help-circle-outline" onPress={() => setTab('About')} style={{ marginLeft: '2%' }} color={tab === 'About' ? Color.cancelBtn : Color.button} />
                <IconButton icon="exit-to-app" onPress={handleLogout} style={{ marginLeft: '2%' }} color={tab === 'Logout' ? Color.cancelBtn : Color.button} />
            </Top>
            <ScrollView >
                {tab === 'Logout' && <SadMessageBox message="Good-bye!"/>}
                {tab === 'Stats' && <Stats userProp={user}> </Stats>}
                {tab === 'About' && <About/>}
                {tab === 'Notifications' &&
                    <View style={styles.container}>
                        <View style={styles.card}>
                            {notifications.length>0 ? notifications.map((notification) =>
                                <Pressable onPress={()=>goToStory(notification.storyId)} style={{ padding: '3%', marginBottom: '1%', borderRadius: 10, backgroundColor: Color[notification.code] }} key={notification.date}>
                                    <Text style={{fontWeight:notification.unseen? 'bold':'normal'}}>{notification.message}</Text>
                                    <Text style={{textAlign: 'right'}}>{moment.utc(notification.date).local().startOf('seconds').fromNow()}</Text>
                                </Pressable>)
                                :<Text  style={{ textAlign: 'center' }}>No notifications yet</Text>}
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
        </SafeAreaView>
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