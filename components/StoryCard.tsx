import { Story } from "../models/Story"
import { Pressable, Text, View, StyleSheet } from 'react-native'
import { Color } from '../Global';
import { Author } from "./UI/Author";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import moment from "moment";

type Props = {
    story: Story,
    favoriteIds: string[],
    onPress: (storyId: string) => void,
    removeFromFavorites: (storyId: string) => void,
    addToFavorites: (storyId: string) => void,
}
export const StoryCard: React.FC<Props> = ({ story, onPress, favoriteIds, addToFavorites, removeFromFavorites }) => (<Pressable style={styles.container}
    onPress={() => onPress(story._id)}>
    <View style={styles.row}>
        <Text style={styles.title}>{story.title}</Text>
        <View style={{ padding: 5 }} >
            {favoriteIds.includes(story._id) ?
                <Pressable onPress={() => removeFromFavorites(story._id)}><MaterialIcons name="favorite" size={36} color={Color.lightRed} /></Pressable> :
                <Pressable onPress={() => addToFavorites(story._id)}><MaterialIcons name="favorite-outline" size={36} color={Color.darkRed} /></Pressable>}
        </View>
    </View>
    <Text>{story.description}</Text>
    <Author name={story.authorName} />
    <View style={styles.row}>
        <Text>{story.language}: {story.level}</Text>
        <Text>Last update: {moment.utc(story.updatedAt).local().startOf('seconds').fromNow()}</Text>
    </View>
    <View style={styles.row}>
        <Text>Pages: {story.pageIds.length}</Text>
        {story.pendingPageIds.length > 0 && <Text>, Pending: {story.pendingPageIds.length}</Text>}
        {!story.openEnded && <FontAwesome name="lock" size={24} color="black" />}
        <View style={{ flexDirection: 'row' }}>
            {story.rating.total > 10 && <Text style={{ color: Color[story.rating.average], fontStyle: 'italic' }}>{story.rating.average} </Text>}<Text>({story.rating.total} votes)</Text>
        </View>
    </View>
</Pressable>
)

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.secondary,
        flex: 1,
        flexDirection: 'column',
        marginBottom: 30,
        padding: 15,
        borderWidth: 1,
        elevation: 3,
        borderRadius: 4,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },

    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    title: {
        flex: 5,
        fontSize: 32,
        paddingBottom: 15,
    }
})