import axios from "axios";
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from "react";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { User } from "../models/User";
import { Form } from './UI/Form';
import moment from 'moment';
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
    language: string,
    level: string,
    ratio: string
}
type PageData = {
    size: number,
    totalVotes: number,
    upVotes: number,
    langInfo: LangInfo[]
}

const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const Stats: React.FC<Props> = ({ userProp, children }) => {
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };

    const [user, setUser] = useState<User>();
    const [storyData, setStoryData] = useState<StoryData>({} as StoryData);
    const [pageData, setPageData] = useState<PageData>({} as PageData);
    useEffect(() => {
        if (params) {
            axios.get(`${LOCAL_HOST}/users/user/${params.userId}`, { headers })
                .then(result => {
                    setUser(result.data.user);
                })
        } else {
            setUser(userProp)
        }
    }, [params]);

    useEffect(() => {
        if (user) {
            axios.get(`${LOCAL_HOST}/stories/all/${user._id}`, { headers })
                .then(result => setStoryData({
                    size: result.data.size,
                    totalVotes: result.data.totalVotes,
                    upVotes: result.data.upVotes
                }));
            axios.get(`${LOCAL_HOST}/pages/all/${user._id}`, { headers })
                .then(result => {
                    setPageData({
                        size: result.data.size,
                        totalVotes: result.data.totalVotes,
                        upVotes: result.data.upVotes,
                        langInfo: result.data.langInfo
                    })
                });
        }
    }, [user])
    const storyRating = storyData.totalVotes !== 0 ? `${(storyData.upVotes / storyData.totalVotes * 100).toFixed()}%` : null
    const pageRating = pageData.totalVotes !== 0 ? `${(pageData.upVotes / pageData.totalVotes * 100).toFixed()}%` : null
    return user ?
        <View style={styles.container}>
            <Form>
                <View style={styles.group}>
                    <Text style={{ fontSize: 36, }}>{user.name}</Text>
                    <Text style={{ fontSize: 12, }}>{user.email}</Text>
                    <Text style={{ fontSize: 12, }}>Logged in: {moment.utc(user.lastLoggedIn).local().startOf('seconds').fromNow()}</Text>
                    {!user.active && <Text style={{ fontSize: 12, }}>Inactive user</Text>}
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
                        {pageData.langInfo?.map(obj => <Text key={obj.language}>{obj.language}: {obj.ratio}% - {obj.level}</Text>)}
                    </View>}
                {children}
            </Form>
        </View>
        : <Text>Loading</Text>
}

const styles = StyleSheet.create({
    container: {
        marginTop: '15%'
    },
    group: {
        marginBottom: 15
    }
})

export default Stats;