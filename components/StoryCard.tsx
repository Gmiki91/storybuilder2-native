import { Story } from "../models/Story"
import { Pressable, Text, View, StyleSheet, ImageBackground, Image } from 'react-native'
import { Color } from '../Global';
import { Author } from "./Author";
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import moment from "moment";
import { memo } from "react";

type Props = {
    story: Story,
    favoriteIds: string[],
    onPress: (storyId: string) => void,
    removeFromFavorites: (storyId: string) => void,
    addToFavorites: (storyId: string) => void,
}

const StoryCard: React.FC<Props> = ({ story, onPress, favoriteIds, addToFavorites, removeFromFavorites }) => {
    const getColor = (rating: string) => {
        switch (rating) {
            case 'Excellent': return '#058700';
            case 'Good': return '#518700';
            case 'Mixed': return '#878700';
            case 'Bad': return '#875600';
            case 'Terrible': return '#870000';
        }
    }
    return (
        <Pressable style={styles.container} onPress={() => onPress(story._id)}>
            <ImageBackground style={{ width: '100%', height: '100%' }} source={require('../assets/papyrus.jpg')}>
                <View style={{ padding: 15 }}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{story.title}</Text>
                        <View style={{ padding: 5 }} >
                            {favoriteIds.includes(story._id) ?
                                <Pressable onPress={() => removeFromFavorites(story._id)}><MaterialIcons name="favorite" size={36} color={Color.lightRed} /></Pressable> :
                                <Pressable onPress={() => addToFavorites(story._id)}><MaterialIcons name="favorite-outline" size={36} color={Color.darkRed} /></Pressable>}
                        </View>
                    </View>
                    <Text>{story.description}</Text>
                    <Author name={story.authorName} userId={story.authorId} />
                    <View style={styles.row}>
                        <Text>{story.language}: {story.level}</Text>
                        <Text>Last update: {moment.utc(story.updatedAt).local().startOf('seconds').fromNow()}</Text>
                    </View>
                    <Text>Pages: {story.pageIds.length}</Text>
                    <View style={styles.row}>
                        <Text>Pending: {story.pendingPageIds.length}</Text>
                        {!story.openEnded && <FontAwesome name="lock" size={24} color="black" />}
                        <View style={{ flexDirection: 'row' }}>
                            {story.rating.total > 10 && <Text style={{ color: getColor(story.rating.average), fontStyle: 'italic' }}>{story.rating.average} </Text>}<Text>({story.rating.total} votes)</Text>
                        </View>
                    </View>
                </View>
               <Image style={styles.scrollBottom} source={require('../assets/scrolls/between.png')} />
            </ImageBackground>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        //  marginBottom: 20,
        elevation: 3,
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

    },
    scrollBottom: {
        width:'100%',
        height:25
    }
});
export default memo(StoryCard)