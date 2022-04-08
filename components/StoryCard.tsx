import moment from "moment";
import { memo } from "react";
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Author } from "./Author";
import { Color } from '../Global';
import { Story } from "../models/Story"

type Props = {
    story: Story,
    favoriteIds: string[],
    onPress: (storyId: string) => void,
    removeFromFavorites: (storyId: string) => void,
    addToFavorites: (storyId: string) => void,
    lastOne?: boolean
    hideFavorite?: boolean,
}

const StoryCard: React.FC<Props> = ({ story, onPress, favoriteIds, addToFavorites, removeFromFavorites, lastOne, hideFavorite }) => {
    const getColor = (rating: string) => {
        switch (rating) {
            case 'Excellent': return '#058700';
            case 'Good': return '#518700';
            case 'Mixed': return '#878700';
            case 'Bad': return '#875600';
            case 'Terrible': return '#870000';
        }
    }
    const listBottom = lastOne ? { marginBottom: '25%' } : null;
    return (
        <Pressable style={[styles.container, listBottom]} onPress={() => onPress(story._id)}>

            <View style={{ padding: 15 }}>
                <View style={styles.row}>
                    <Text style={styles.title}>{story.title}</Text>
                    {!hideFavorite && <View style={{ padding: 5 }} >
                        {favoriteIds.includes(story._id) ?
                            <Pressable onPress={() => removeFromFavorites(story._id)}><MaterialIcons name="favorite" size={36} color={Color.dislikeButton2} /></Pressable> :
                            <Pressable onPress={() => addToFavorites(story._id)}><MaterialIcons name="favorite-outline" size={36} color={Color.dislikeButton2} /></Pressable>}
                    </View>}
                </View>
                <Text>{story.description}</Text>
                <View style={styles.row}>
                    <Text style={{fontSize: 20 }}>{story.language.code}</Text>
                    <Author name={story.authorName} userId={story.authorId} />
                </View>
                <View style={styles.row}>
                    <Text>{story.language.text}: {story.level.code}</Text>
                    <Text>Last update: {moment.utc(story.updatedAt).local().startOf('seconds').fromNow()}</Text>
                </View>
                <Text>Pages: {story.pageIds.length}</Text>
                <View style={styles.row}>
                    <Text>Pending: {story.pendingPageIds.length}</Text>
                    {!story.open && <FontAwesome name="lock" size={24} color="black" />}
                    <View style={{ flexDirection: 'row' }}>
                        {story.rating.total > 10 && <Text style={{ color: getColor(story.rating.average), fontStyle: 'italic' }}>{story.rating.average} ({story.rating.total} votes)</Text>}
                    </View>
                </View>
            </View>

        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
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

    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title: {
        flex: 5,
        fontSize: 32,
        paddingBottom: 15,

    }
});
export default memo(StoryCard)