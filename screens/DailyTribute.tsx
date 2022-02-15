import axios from 'axios';
import { useState, useEffect } from 'react'
import { View, Text } from "react-native"
import { useAuth } from '../context/AuthContext';
import { useIsFocused } from '@react-navigation/native';
const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
const DailyTribute = () => {
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [lastTribute, setLastTribute] = useState();
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            let mounted = true;
            axios.get(`${LOCAL_HOST}/stories/tribute/data`, { headers })
                .then(result => {
                    console.log('szia')
                    if (mounted)
                        console.log(result.data);
                })
            return () => { mounted = false }
        }
    }, [isFocused]);

    // useEffect(() => {
    //     // if last tribute + 24 hours < new Date - active
    //     // else inactive
    //     // if active : findMarkedStory. If null, mark one.
    //     axios.get(`${LOCAL_HOST}/stories/`, { headers })
    //         .then(result => {

    //         })
    // },[lastTribute]);

    return <View>
        <Text>Szia</Text>
    </View>
}

export default DailyTribute;