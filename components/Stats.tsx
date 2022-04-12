import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import moment from 'moment';
import { BackButton } from './UI/BackButton';
import { Color, API_URL } from "../Global";
import { LanguageModel } from "../models/LanguageData";
type ParamList = {
    Params: {
        userId: string
    };
};
type Props = {
    userProp: User
}

type StoryData = {
    size: number,
    totalVotes: number,
    upVotes: number,
}
type LangInfo = {
    language: LanguageModel,
    level: string,
    ratio: string
}
type PageData = {
    size: number,
    totalVotes: number,
    upVotes: number,
    langInfo: LangInfo[]
}


const Stats: React.FC<Props> = ({ userProp }) => {
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const { authToken } = useAuth();
    const headers = { Authorization: `Bearer ${authToken}` };

    const [user, setUser] = useState<User>();
    const [error, setError] = useState('');
    const [storyData, setStoryData] = useState<StoryData>({} as StoryData);
    const [pageData, setPageData] = useState<PageData>({} as PageData);
    useEffect(() => {
        let mounted = true
        if (params) {
            axios.get(`${API_URL}/users/user/${params.userId}`, { headers })
                .then(result => {
                    if (mounted)
                        setUser(result.data.user);
                })
                .catch(e => setError('Error while loading the user data.'));
        } else {
            if (mounted)
                setUser(userProp)
        }
        return () => { mounted = false }
    }, [params, userProp]);

    useEffect(() => {
        let mounted = true;
        if (user) {
            axios.get(`${API_URL}/stories/many/${user._id}`, { headers })
                .then(result => {
                    if (mounted)
                        setStoryData({
                            size: result.data.size,
                            totalVotes: result.data.totalVotes,
                            upVotes: result.data.upVotes
                        })
                })
                .catch(e => setError('Error while loading the user data.'));
            axios.get(`${API_URL}/pages/data/${user._id}`, { headers })
                .then(result => {
                    if (mounted)
                        setPageData({
                            size: result.data.size,
                            totalVotes: result.data.totalVotes,
                            upVotes: result.data.upVotes,
                            langInfo: result.data.langInfo
                        })
                })
                .catch(e => setError('Error while loading the user data.'));
        }
        return () => { mounted = false }
    }, [user])
    const storyRating = storyData.totalVotes !== 0 ? `${(storyData.upVotes / storyData.totalVotes * 100).toFixed()}%` : null
    const pageRating = pageData.totalVotes !== 0 ? `${(pageData.upVotes / pageData.totalVotes * 100).toFixed()}%` : null
    const notProfile = !userProp ? { flex: 1 } : null;
    return user ?
        <View style={[styles.container, notProfile]}>
            <View style={[styles.card, { width: userProp ? '100%' : '90%' }]}>
                <View style={styles.group}>
                    <Text style={{ fontSize: 36, }}>{user.name}</Text>
                    <Text style={{ fontSize: 12, }}>{user.email}</Text>
                    <Text style={{ fontSize: 12, }}>Last activity: {moment.utc(user.lastActivity).local().startOf('seconds').fromNow()}</Text>
                    {!user.active && <Text style={{ fontSize: 12, }}>Inactive user</Text>}
                    <View style={{ flexDirection: 'row' }}>
                        <Text >{user.coins}x coin(s)</Text>
                    </View>
                </View>
                <View style={styles.group}>
                    <Text >Stories: {storyData.size}</Text>
                    <Text >Rating: {storyRating} ({storyData.upVotes} / {storyData.totalVotes})</Text>
                </View>
                <View style={styles.group}>
                    <Text>Pages: {pageData.size}</Text>
                    <Text>Rating: {pageRating} ({pageData.upVotes} / {pageData.totalVotes})</Text>
                </View>
                {pageData.langInfo?.length !== 0 &&
                    <View>
                        <Text>Used languages:</Text>
                        {pageData.langInfo?.map(obj => <Text key={obj.language.code}>{obj.language.text}: {obj.ratio}% - {obj.level}</Text>)}
                    </View>}

            </View>
            {!userProp && <BackButton />}

            <Snackbar onDismiss={() => setError('')} visible={error !== ''} duration={2000}>{error}</Snackbar>
        </View>
        : <Text>Loading</Text>
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
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

    group: {
        marginBottom: 15
    }
})

export default Stats;