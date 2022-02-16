import axios from 'axios';
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from "react-native"
import { Provider, Modal, Portal, ActivityIndicator } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useIsFocused, useNavigation, CommonActions } from '@react-navigation/native';
import StoryCard from '../components/StoryCard';
import { Story } from '../models/Story';
import { Color } from '../Global';

const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
type Data = {
    story: Story,
    time: number,
}
const DailyTribute = () => {
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [data, setData] = useState<Data>({} as Data);
    const [loading, isLoading] = useState(true);
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    useEffect(() => {
        if (isFocused) {
            let mounted = true;
            isLoading(true);
            axios.get(`${LOCAL_HOST}/stories/tribute/data`, { headers })
                .then(result => {

                    if (mounted) {
                        setData({ story: result.data.story, time: result.data.markedStoryAt });
                        isLoading(false)
                    }
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

    const openStory = (storyId: string) => {
        navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId } }))
    }
    return <Provider>
        <Portal>
            <Modal
                visible={loading}>
                <ActivityIndicator size={'large'} animating={loading} color={Color.secondary} />
            </Modal>
        </Portal>
        {data.story &&
            <View style={styles.container}>
              
                <StoryCard
                
                    story={data.story}
                    onPress={openStory}
                    favoriteIds={[]}
                    addToFavorites={() => { }}
                    removeFromFavorites={() => { }}
                    hideFavorite
                />
                <View style={{backgroundColor: Color.secondary, padding:10,borderRadius:10 }}>
                  <Text >{24 - ((Date.now() - data.time) / 1000 / 60 / 60 / 24)} hour(s) left</Text>
                  </View>
            </View>
        }
    </Provider>
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default DailyTribute;