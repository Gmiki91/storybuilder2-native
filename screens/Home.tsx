import axios from "axios";
import { StyleSheet, View, Pressable, ImageBackground } from 'react-native';
import { Modal, Portal, Provider, Searchbar, Snackbar, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback, memo } from "react";
import { useIsFocused } from '@react-navigation/native';
import StoryList from "../components/StoryList";
import { SortBy } from "../components/SortBy";
import { Story } from "../models/Story";
import { useAuth } from "../context/AuthContext";
import { Color } from "../Global";
import { Filter } from "../components/forms/Filter";
import { NewStory } from "../components/forms/NewStory";
import { Fab } from "../components/UI/Fab";
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
type SearchCriteria = {
    storyName: string,
    sortBy: string,
    sortDirection: number,
    from: string,
    languages: string[],
    levels: string[],
    openEnded: string;
}

type ModalType = 'Filter' | 'NewStory' | '';
const Home = () => {
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const isFocused = useIsFocused();
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        storyName: '',
        sortBy: 'ratingAvg',
        sortDirection: 1,
        from: 'all',
        languages: [],
        levels: [],
        openEnded: 'both'
    });
    const [stories, setStories] = useState<Story[]>([]);
    const [showModal, setShowModal] = useState<ModalType>('');
    const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
    const [loading, isLoading] = useState(false);

    useEffect(() => {
        if (token)
            axios.get(`${LOCAL_HOST}/users/favorites`, { headers }).then(result => setFavoriteIds(result.data.data))
    }, [token]);

    const getList = useCallback(() => {
        console.log(Date.now().toString().slice(8, 10), Date.now().toString().slice(10));
        isLoading(true);
        axios.post(`${LOCAL_HOST}/stories/all`, searchCriteria, { headers }).then(result => {
            setStories(result.data.stories);
            if (showModal) setShowModal('');
            isLoading(false);
        })
    }, [searchCriteria]);

    useEffect(() => {
        if (isFocused) {
            getList();
        }
    }, [isFocused]);

    useEffect(() => {
        let timeOut: NodeJS.Timeout;
        if (searchCriteria.storyName.length > 2) {
            timeOut = setTimeout(() => getList(), 1000);
        }
        return () => clearTimeout(timeOut);
    }, [searchCriteria.storyName]);

    const handleSort = (sortValue: string) => {
        console.log(Date.now().toString().slice(8, 10), Date.now().toString().slice(10));
        if (searchCriteria.sortBy === sortValue) {
            setSearchCriteria(prevState => ({ ...prevState, sortDirection: -searchCriteria.sortDirection }));
        } else {
            setSearchCriteria(prevState => ({ ...prevState, sortBy: sortValue }));
        }
        getList();
    }

    const filtersOn = () => {
        const { from, languages, levels, openEnded } = searchCriteria;
        return from !== 'all' || languages.length > 0 || levels.length > 0 || openEnded !== 'both'
    }

    const onStoryNameSearch = () => {
        if (searchCriteria.storyName.length >= 3) {
            getList();
        } else {
            console.log('length min is 3')
        }
    }

    const handleStoryNameSearch = (name: string) => {
        if (name.length < 3 && searchCriteria.storyName.length >= 3) {
            getList();
        }
        setSearchCriteria(prevState => ({ ...prevState, storyName: name }));
    }

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

    const getForm = () => {
        if (showModal === 'Filter') {
            return <Filter
                onCloseForm={() => setShowModal('')}
                onApply={() => getList()}
                filters={searchCriteria}
                changeFilter={(changes) => setSearchCriteria(prevState => ({ ...prevState, ...changes }))} />
        } else if (showModal === 'NewStory') {
            return <NewStory onCloseForm={() => setShowModal('')} />
        } else {
            return null;
        }
    }
    const form = getForm();
    const filterIcon = filtersOn() ? 'filter-plus' : 'filter';
    return (
        <Provider>

            <View style={styles.container}>
                <Fab onPress={() => setShowModal('NewStory')} />
                <Portal>
                    <Modal
                        visible={showModal !== '' || loading}
                        onDismiss={() => setShowModal('')}>
                        {loading ? <ActivityIndicator size={'large'} animating={loading} color={Color.containedButton} /> : form}
                    </Modal>
                </Portal>
                <Searchbar
                    onIconPress={onStoryNameSearch}
                    style={{ width: '80%', height: 40, borderRadius: 40 }}
                    autoComplete={true}
                    placeholder="Search by title"
                    onChangeText={handleStoryNameSearch}
                    value={searchCriteria.storyName} />
             
                <ImageBackground style={styles.criteriaContainer} source={require('../assets/scrolltop2.png')}>
                    <SortBy
                        direction={searchCriteria.sortDirection}
                        currentCriteria={searchCriteria.sortBy}
                        criteriaChanged={handleSort} />
                    <Pressable style={{ padding: 5 }} onPress={() => setShowModal('Filter')} >
                        <MaterialCommunityIcons name={filterIcon} size={24} color="black" />
                    </Pressable>
                    </ImageBackground>
                <StoryList
                    stories={stories}
                    favoriteIds={favoriteIds}
                    removeFromFavorites={removeFromFavorites}
                    addToFavorites={addToFavorites} />
            </View>
        </Provider>
    )
}


const styles = StyleSheet.create({
    container: {
        
        paddingTop: 30,
        flex: 1,
        alignItems: 'center',
    },

    criteriaContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: Color.main,
        marginTop: '5%'
       
    },
    criteriaBackgroundImage:{
      
        
    }

})
export default memo(Home);