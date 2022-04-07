import axios from 'axios';
import { memo, useState, useEffect } from 'react';
import { FlatList, StyleSheet,ListRenderItem } from "react-native";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Story } from "../models/Story";

import StoryCard from './StoryCard';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../Global';

type Props = {
    stories: Story[];
}
const StoryList: React.FC<Props> = ({ stories }) => {
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const { authToken } = useAuth();
    const headers = { Authorization: `Bearer ${authToken}` };
    const navigation = useNavigation();
    useEffect(() => {
        let mounted = true;
        axios.get(`${API_URL}/users/favorites`, { headers }).then(result => {
            if (mounted) {
                setFavoriteIds(result.data.data);
            }
        });
        return () => { mounted = false }
    }, []);

    const addToFavorites = (storyId: string) => {
        setFavoriteIds(prevState => ([...prevState, storyId]))
        axios.post(`${API_URL}/users/favorites`, { storyId }, { headers });
    }

    const removeFromFavorites = (storyId: string) => {
        const newList = [...favoriteIds];
        const index = newList.indexOf(storyId);
        newList.splice(index, 1);
        setFavoriteIds(newList);
        axios.put(`${API_URL}/users/favorites`, { storyId }, { headers });
    }
   
    const goToStory = (storyId: string) => {
        navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId } }))
    }

    const renderItem: ListRenderItem<Story> = ({ item, index }) => <StoryCard
        key={item._id}
        onPress={goToStory}
        removeFromFavorites={removeFromFavorites}
        addToFavorites={addToFavorites}
        story={item}
        favoriteIds={favoriteIds}
        lastOne = {stories.length-1===index}
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
        width: '100%'
    }
})

export default memo(StoryList);