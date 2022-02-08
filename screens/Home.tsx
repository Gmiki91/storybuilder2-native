import axios from 'axios';
import { StyleSheet, View, Pressable, ImageBackground, Image } from 'react-native';
import { Modal, Portal, Provider, Searchbar, Snackbar, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState, useCallback, memo } from 'react';
import StoryList from '../components/StoryList';
import { SortBy } from '../components/SortBy';
import { Story } from '../models/Story';
import { useAuth } from '../context/AuthContext';
import { Color } from '../Global';
import { Filter } from '../components/forms/Filter';
import { NewStory } from '../components/forms/NewStory';
import { Fab } from '../components/UI/Fab';
import { SadMessageBox } from '../components/UI/SadMessageBox';
import { useIsFocused } from '@react-navigation/native';

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

const defaultSearchCriteria = {
    storyName:'',
    sortBy: 'ratingAvg',
    sortDirection: 1,
    from: 'all',
    languages: [],
    levels: [],
    openEnded: 'both'
}

type ModalType = 'Filter' | 'NewStory' | '';
const Home = () => {
    const isFocused = useIsFocused();
    console.log('home')
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [searchTitle, setSearchTitle] = useState('');
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria);
    const [stories, setStories] = useState<Story[]>([]);
    const [showModal, setShowModal] = useState<ModalType>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, isLoading] = useState(false);

    const getList = useCallback(async () => {
        isLoading(true);
        if (showModal) setShowModal('');
        let mounted = true;
        const stories = await axios.post(`${LOCAL_HOST}/stories/all`,searchCriteria, { headers }).then(result => result.data.stories)
        if (mounted) {
            setStories(stories);
            isLoading(false);
        }
        return () => { mounted = false }
    }, [searchCriteria]);

    
    //  if Filter is shown, searchCrteria might change without applying it. 
    //  Isfocused is needed if new page is added in storyscreen, which needs to be shown in the StoryCard
    useEffect(() => {
        if (showModal !== 'Filter') 
            getList();
    }, [getList,isFocused]);

    const handleSort = (sortValue: string) => {
        if (searchCriteria.sortBy === sortValue) {
            setSearchCriteria(prevState => ({ ...prevState, sortDirection: -searchCriteria.sortDirection }));
        } else {
            setSearchCriteria(prevState => ({ ...prevState, sortBy: sortValue }));
        }
    }

    const filtersOn = () => {
        const { from, languages, levels, openEnded } = searchCriteria;
        return from !== 'all' || languages.length > 0 || levels.length > 0 || openEnded !== 'both'
    }

    const onStoryNameSearch = () => {
        if (searchTitle.length >= 3) {
            setSearchCriteria(prevState => ({ ...prevState,storyName: searchTitle}))
        } else {
            setErrorMessage('Write at least 3 characters in the searchbar');
        }
    }

    const handleSearchBar = (value:string) =>{
        if(value.length<3 && searchCriteria.storyName.length>=3){
            setSearchCriteria(prevState => ({ ...prevState,storyName: ''}))
        }
        setSearchTitle(value)
    }

    const dismissModal=()=>{
        if(showModal==='Filter') getList() //filter might already been set, returning to original is cumbersome, so we'll apply
        else setShowModal('');
    }

    const getForm = () => {
        if (showModal === 'Filter') {
            return <Filter
                onClearForm={() => setSearchCriteria(defaultSearchCriteria)}
                onApply={getList}
                filters={searchCriteria}
                changeFilter={(changes) => setSearchCriteria(prevState => ({ ...prevState, ...changes }))} />
        } else if (showModal === 'NewStory') {
            return <NewStory onCloseForm={() => setShowModal('')} />
        }
    }
    const form = getForm();
    const filterIcon = filtersOn() ? 'filter-plus' : 'filter';
    return (
        <Provider>
            <View style={styles.container}>
                <Portal>
                    <Modal
                        visible={showModal !== '' || loading}
                        onDismiss={dismissModal}>
                        {loading ? <ActivityIndicator size={'large'} animating={loading} color={Color.containedButton} /> : form}
                    </Modal>
                </Portal>
                <Searchbar
                    onIconPress={onStoryNameSearch}
                    style={{ width: '80%', height: 40, borderRadius: 40 }}
                    autoComplete={true}
                    placeholder='Search by title'
                    onChangeText={handleSearchBar}
                    onSubmitEditing={onStoryNameSearch}
                    onKeyPress={(e)=>console.log(e.nativeEvent)}
                    value={searchTitle} />

                <ImageBackground style={styles.criteriaContainer} source={require('../assets/scrolls/top.png')}>
                    <SortBy
                        direction={searchCriteria.sortDirection}
                        currentCriteria={searchCriteria.sortBy}
                        criteriaChanged={handleSort} />
                    <Pressable style={{ paddingRight:'12%', paddingTop:'2%' }} onPress={() => setShowModal('Filter')} >
                        <MaterialCommunityIcons name={filterIcon} size={24} color='black' />
                    </Pressable>
                </ImageBackground>
                {stories.length === 0
                    ? <SadMessageBox message='No stories to show'/>
                    : <StoryList stories={stories} />}
                      <Image style={styles.scrollBottom} source={require('../assets/scrolls/bottom.png')} />
            </View>
            <Fab onPress={() => setShowModal('NewStory')} />
            <Snackbar onDismiss={()=>setErrorMessage('')} visible={errorMessage!==''} duration={4000}>{errorMessage}</Snackbar>
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
        marginTop: '5%'
    },
    scrollBottom: {
        width:'100%',
        height:'8%'
    }
})
export default memo(Home);