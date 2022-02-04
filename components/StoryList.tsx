import { memo } from 'react';
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Story } from "../models/Story";
import { Entypo } from '@expo/vector-icons';
import { StoryCard } from './StoryCard';
import { Color } from '../Global';

type Props = {
    stories: Story[];
    favoriteIds: string[];
    removeFromFavorites: (storyId: string) => void;
    addToFavorites: (storyId: string) => void;
}

const StoryList: React.FC<Props> = ({ stories, favoriteIds, addToFavorites, removeFromFavorites }) => {
    const navigation = useNavigation();
    const goToStory = (storyId: string) => {
        navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId } }))
    }

    return <FlatList
        initialNumToRender={5}
        showsVerticalScrollIndicator={false}
        style={styles.list}
        data={stories}
        renderItem={({ item }) => <StoryCard
            onPress={goToStory}
            removeFromFavorites={removeFromFavorites}
            addToFavorites={addToFavorites}
            story={item}
            favoriteIds={favoriteIds}
        />}
        ListEmptyComponent={
            <View style={{  width:'50%', alignSelf:'center',alignItems: 'center',backgroundColor: Color.main, borderRadius:50, }}>
                <Text>No story to show </Text>
                <Entypo name="emoji-sad" size={24} color="black" />
            </View>} />


}
const styles = StyleSheet.create({
    list: {
        marginTop: '10%',
        marginRight: '9%',
        width: '80%',
    }

   
})
export default memo(StoryList);