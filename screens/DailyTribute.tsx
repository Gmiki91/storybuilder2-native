import axios from 'axios';
import { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from "react-native"
import { Provider, Modal, Portal, ActivityIndicator, Snackbar} from 'react-native-paper';
import { useAuth } from '../context/AuthContext';
import { useIsFocused, useNavigation, CommonActions } from '@react-navigation/native';
import StoryCard from '../components/StoryCard';
import { Story } from '../models/Story';
import { Color, API_URL } from '../Global';
import { Timer } from '../components/UI/Timer';

type Data = {
    story: Story,
    hoursLeft: number,
    minutesLeft: number
}
const DailyTribute = () => {
    const { authToken } = useAuth();
    const headers = { Authorization: `Bearer ${authToken}` };
    const isFocused = useIsFocused();
    const navigation = useNavigation();

    const [data, setData] = useState<Data>({} as Data);
    const [error, setError] = useState('');
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        if (isFocused) {
            isLoading(true);
            axios.get(`${API_URL}/stories/tribute/data`, { headers })
                .then(result => {
                    if (mounted) {
                        const { story, minutesLeft, hoursLeft } = result.data;
                        setData({ story, hoursLeft, minutesLeft });
                        isLoading(false)
                    }
                })
                .catch(() => setError('An error has occured'))
        } else {
            isLoading(true);
        }
        return () => { mounted = false }
    }, [isFocused]);

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
        {data.story ?
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>Contribute to this story to get 1 coin</Text>
                </View>
                <View style={styles.cardContainer}>
                    <StoryCard
                        story={data.story}
                        onPress={openStory}
                        favoriteIds={[]}
                        addToFavorites={() => { }}
                        removeFromFavorites={() => { }}
                        hideFavorite />
                </View>
                <Timer text={''} minutes={data.minutesLeft} hours={data.hoursLeft} />
            </View>
            :
            <View style={styles.container}>
                <Timer text={'until next story'} minutes={data.minutesLeft} hours={data.hoursLeft} />
            </View>}
        <Snackbar onDismiss={() => setError('')} visible={error !== ''} duration={2000}>{error}</Snackbar>
    </Provider>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    header: {
        backgroundColor: Color.secondary, padding: 5, borderRadius: 5, marginBottom: 5, flexDirection: 'row', alignItems: 'center',borderBottomWidth: 3,
        borderWidth: 1,
    },
    cardContainer: {
        width: '95%'
    }
})

export default DailyTribute;