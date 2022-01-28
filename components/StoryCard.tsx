import { Story } from "../models/Story"
import {View, Pressable, Text} from 'react-native';

type Props = {
    story: Story,
    favorite: boolean,
    onClick: () => void,
    removeFromFavorites:()=>void,
    addToFavorites:()=>void
}

export const StoryCard: React.FC<Props> = ({ story, favorite, onClick, removeFromFavorites, addToFavorites }) => {
    return <View>
        <Pressable onPress={onClick}>
           <Text> {story.title} {story.language}:{story.level} {story.updatedAt.toString().slice(14, 19)} {story.rating}</Text>
        </Pressable>
        {favorite ? <Pressable onPress={removeFromFavorites}><Text>Remove from favorite</Text></Pressable>: <Pressable onPress={addToFavorites}><Text>Add to favorites</Text></Pressable>}
        {story.pendingPageIds.length > 0 && <Text>Pending items: {story.pendingPageIds.length}</Text>}
    </View>
}