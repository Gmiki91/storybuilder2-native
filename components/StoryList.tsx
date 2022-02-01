import { Story } from "../models/Story";
import { useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { FlatList, ListRenderItem, StyleSheet, Pressable, View, Text } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'; 
import {Color} from '../Global';

type Props = {
    stories: Story[];
    favoriteIds: string[];
    removeFromFavorites: (storyId: string) => void;
    addToFavorites: (storyId: string) => void;
}

export const StoryList: React.FC<Props> = ({ stories, favoriteIds, addToFavorites, removeFromFavorites }) => {
    const navigation = useNavigation();
    const renderItem: ListRenderItem<Story> = ({ item }) => (
        <Pressable style={styles.container} onPress={() => navigation.dispatch(CommonActions.navigate({ name: 'StoryScreen', params: { storyId: item._id } }))}>
            <View style={styles.columnOne}>
            <Text>{item.title}</Text>
            <Text>by {item.authorName}</Text>
            <Text>{item.language} : {item.level}</Text>
            <Text>Pages: {item.pageIds.length}</Text>
            {item.pendingPageIds.length > 0 &&  <Text>Pending: {item.pendingPageIds.length}</Text>}
            </View>
            <View style={styles.columnTwo}>
            {favoriteIds.includes(item._id) ? <Pressable onPress={() => removeFromFavorites(item._id)}><MaterialIcons name="favorite" size={36} color={Color.lightRed}/></Pressable>
            : <Pressable onPress={() => addToFavorites(item._id)}><MaterialIcons name="favorite-outline" size={36} color={Color.darkRed} /></Pressable>}
            <Text>{item.rating.average} ({item.rating.positive}/{item.rating.total})</Text>
            </View>
        </Pressable>
     
        
 
    )

    return <><FlatList
        style={styles.list}
        data={stories}
        renderItem={renderItem} />
    </>
}

const styles = StyleSheet.create({
    list: {
        marginTop: '10%',
        width: '80%',
        backgroundColor:'black',
        
    },
    container:{
        flex:1,
        flexDirection: 'row',
    },
    columnOne:{
        flex:1,
        flexDirection: 'column',
        backgroundColor:'yellow',
    },
    columnTwo:{
        flex:1,
        flexDirection: 'column',
        backgroundColor:'green',
        alignItems: 'center'

    }
})

