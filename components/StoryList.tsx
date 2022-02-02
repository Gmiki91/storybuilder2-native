import { Story } from "../models/Story";
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { FlatList, ListRenderItem, StyleSheet, Pressable, View, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Color } from '../Global';

type Props = {
    stories: Story[];
    favoriteIds: string[];
    removeFromFavorites: (storyId: string) => void;
    addToFavorites: (storyId: string) => void;
}



export const StoryList: React.FC<Props> = ({ stories, favoriteIds, addToFavorites, removeFromFavorites }) => {
    const navigation = useNavigation();
    const renderItem: ListRenderItem<Story> = ({ item }) => {
        const rate = item.rating.total > 9 ? item.rating.average : item.rating.positive;
        return (
            <Pressable style={styles.container} onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId: item._id } }))}>
                <View style={styles.columnOne}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.author}>{item.authorName}</Text>
                    <Text style={styles.language}>{item.language} : {item.level}</Text>
                    <Text>Pages: {item.pageIds.length}</Text>
                    {item.pendingPageIds.length > 0 && <Text>Pending: {item.pendingPageIds.length}</Text>}
                </View>
                <View style={styles.columnTwo}>
                    {favoriteIds.includes(item._id) ?
                        <Pressable style={styles.favorite} onPress={() => removeFromFavorites(item._id)}><MaterialIcons name="favorite" size={36} color={Color.lightRed} /></Pressable> :
                        <Pressable style={styles.favorite} onPress={() => addToFavorites(item._id)}><MaterialIcons name="favorite-outline" size={36} color={Color.darkRed} /></Pressable>}
                    <View style={styles.rate}>
                        <Text style={{ color: Color[item.rating.average], fontStyle: 'italic' }}>{rate} </Text><Text>({item.rating.total} votes)</Text>
                    </View>
                </View>
            </Pressable>
        )
    }

    return <><FlatList
        style={styles.list}
        data={stories}
        renderItem={renderItem} />
    </>
}

const styles = StyleSheet.create({
    list: {
        marginTop: '10%',
        width: '60%',

    },
    container: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 30,
        padding: 10,
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
    columnOne: {
        flex: 1,
        flexDirection: 'column',
    },

    title: {
        fontSize: 32
    },
    author: {
        fontStyle: 'italic',
        fontSize: 12
    },
    language: {

    },
    columnTwo: {
        flex: 1,
        flexDirection: 'column',
    },
    favorite: {
        alignItems: 'flex-end',
    },
    rate: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    }
})