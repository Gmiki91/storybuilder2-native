import axios from 'axios';
import { StyleSheet, View, Pressable, ImageBackground, Keyboard } from 'react-native';
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
import { User } from '../models/User';

const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';

type SearchCriteria = {
    storyName: string,
    from: string,
    languages: string[],
    levels: string[],
    open: string;
}

const defaultSearchCriteria = {
    storyName: '',
    from: 'all',
    languages: [],
    levels: [],
    open: 'both'
}

type ModalType = 'Filter' | 'NewStory' | '';
const Home = () => {
    const isFocused = useIsFocused();
    const { token } = useAuth();
    const [user, setUser] = useState({} as User);
    const headers = { Authorization: `Bearer ${token}` };
    const [searchTitle, setSearchTitle] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [sortDirection, setSortDirection] = useState(1);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria);
    const [tempSearchCriteria, setTempSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria);
    const [stories, setStories] = useState<Story[]>([]);
    const [showModal, setShowModal] = useState<ModalType>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, isLoading] = useState(false);


    useEffect(() => {
        let mounted = true
        axios.get(`${LOCAL_HOST}/users/`, { headers })
            .then(result => {
                if (mounted)
                    setUser(result.data.user)
            })
            .catch((e) => console.log('No user to display', e));
        return () => { mounted = false }
    }, []);

    const getList = useCallback(async () => {
        isLoading(true);
        Keyboard.dismiss()
        let mounted = true;
        axios.post(`${LOCAL_HOST}/stories/all`, { ...searchCriteria, sortBy, sortDirection, searchTitle }, { headers }).then(result => {
            if (mounted) {
                setStories(result.data.stories);
                isLoading(false);
                setShowModal('');
            }
        });
        return () => { mounted = false }
    }, [searchCriteria, sortBy, sortDirection]);

    //  Isfocused is needed if new page is added in storyscreen, which needs to be shown in the StoryCard
    useEffect(() => {
        getList();
    }, [getList, isFocused]);

    const handleSort = (sortValue: string) => {
        if (sortBy === sortValue) {
            setSortDirection(prevState => -prevState);
        } else {
            setSortBy(sortValue)
        }
    }

    const filtersOn = () => {
        const { from, languages, levels, open } = searchCriteria;
        return from !== 'all' || languages.length > 0 || levels.length > 0 || open !== 'both'
    }

    const onClearFilter = () => {
        setTempSearchCriteria(defaultSearchCriteria);
        setSearchCriteria(defaultSearchCriteria);
        getList();
    }

    const onApplyFilter = () => {
        setSearchCriteria(tempSearchCriteria);
        getList();
    }

    const onStoryNameSearch = () => {
        if (searchTitle.length >= 3) {
            setSearchCriteria(prevState => ({ ...prevState, storyName: searchTitle }))
        } else {
            setErrorMessage('Write at least 3 characters in the searchbar');
        }
    }

    const handleSearchBar = (value: string) => {
        if (value.length < 3 && searchCriteria.storyName.length >= 3) {
            setSearchCriteria(prevState => ({ ...prevState, storyName: '' }))
        }
        setSearchTitle(value)
    }
    const onNewStoryClicked = () => {
        if (user.numberOfTablets < 1) {
            setErrorMessage(`You need a tablet to write on. You can get tablets by completing the daily tribute.`)
        } else {
            setShowModal('NewStory')
        }
    }

    const getForm = () => {
        if (showModal === 'Filter') {
            return <Filter
                onClearForm={onClearFilter}
                onApply={onApplyFilter}
                filters={tempSearchCriteria}
                changeFilter={(changes) => setTempSearchCriteria(prevState => ({ ...prevState, ...changes }))} />
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
                        onDismiss={() => setShowModal('')}>
                        {loading ? <ActivityIndicator size={'large'} animating={loading} color={Color.secondary} /> : form}
                    </Modal>
                </Portal>
                <Searchbar
                    onIconPress={onStoryNameSearch}
                    style={styles.searchBar}
                    autoComplete={true}
                    placeholder='Search by title'
                    onChangeText={handleSearchBar}
                    onSubmitEditing={onStoryNameSearch}
                    value={searchTitle} />

                <ImageBackground style={styles.criteriaContainer} source={require('../assets/top.png')}>
                    <SortBy
                        direction={sortDirection}
                        currentCriteria={sortBy}
                        criteriaChanged={handleSort} />
                    <Pressable style={{ paddingRight: '12%', paddingTop: '5%' }} onPress={() => setShowModal('Filter')} >
                        <MaterialCommunityIcons name={filterIcon} size={24} color='black' />
                    </Pressable>
                </ImageBackground>
                {stories.length === 0
                    ? <SadMessageBox message='No stories to show' />
                    : <StoryList stories={stories} />}
            </View>
            <Fab onPress={onNewStoryClicked} />
            <Snackbar onDismiss={() => setErrorMessage('')} visible={errorMessage !== ''} duration={4000}>{errorMessage}</Snackbar>
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
        marginTop: '6%',
        height: 59,
        backgroundColor: 'black',
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    searchBar: {
        width: '80%',
        height: 40,
        borderRadius: 40,
        backgroundColor: Color.main
    }
})
export default memo(Home);