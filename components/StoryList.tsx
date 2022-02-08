import axios from 'axios';
import { memo,useState,useEffect } from 'react';
import { FlatList, StyleSheet, View, Text, ListRenderItem } from "react-native";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Story } from "../models/Story";

import  StoryCard  from './StoryCard';
import { useAuth } from '../context/AuthContext';

type Props = {
    stories: Story[];
}
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const StoryList: React.FC<Props> = ({ stories }) => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('storylist');
    useEffect(() => {
        console.log('49');
        let mounted = true;
        axios.get(`${LOCAL_HOST}/users/favorites`, { headers }).then(result => {
            if (mounted) {
                setFavoriteIds(result.data.data);
            }
        });
        return () => { mounted = false }
    }, []);

    const addToFavorites = (storyId: string) => {
        setFavoriteIds(prevState => ([...prevState, storyId]))
        axios.post(`${LOCAL_HOST}/users/favorites`, { storyId }, { headers });
    }

    const removeFromFavorites = (storyId: string) => {
        const newList = [...favoriteIds];
        const index = newList.indexOf(storyId);
        newList.splice(index, 1);
        setFavoriteIds(newList);
        axios.put(`${LOCAL_HOST}/users/favorites`, { storyId }, { headers });
    }
    const navigation = useNavigation();
    const goToStory = (storyId: string) => {
        navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId } }))
    }

    const renderItem: ListRenderItem<Story> = ({ item }) => <StoryCard
    key={item._id}
        onPress={goToStory}
        removeFromFavorites={removeFromFavorites}
        addToFavorites={addToFavorites}
        story={item}
        favoriteIds={favoriteIds}
        lastOne = {stories.indexOf(item)===stories.length-1}
    />
    return <FlatList
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        data={stories}
        renderItem={renderItem}
        windowSize={10}
        />
}
           


const styles = StyleSheet.create({
    list: {
        width: '80%',
    }

})
export default memo(StoryList);