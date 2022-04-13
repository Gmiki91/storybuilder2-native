import axios from 'axios';
import { StyleSheet, View, Keyboard } from 'react-native';
import { Modal, Portal, Provider, Searchbar, Snackbar, ActivityIndicator, Button } from 'react-native-paper';
import React, { useEffect, useState, useCallback, memo } from 'react';
import StoryList from '../components/StoryList';
import { SortBy } from '../components/SortBy';
import { Story } from '../models/Story';
import { useAuth } from '../context/AuthContext';
import { Color, API_URL} from '../Global';
import { Filter } from '../components/forms/Filter';
import { NewStory } from '../components/forms/NewStory';
import { Fab } from '../components/UI/Fab';
import { SadMessageBox } from '../components/UI/SadMessageBox';
import {  useIsFocused } from '@react-navigation/native';
import { User } from '../models/User';
import { Top } from '../components/UI/Top';


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
    const { authToken } = useAuth();
    const [user, setUser] = useState({} as User);
    const headers = { Authorization: `Bearer ${authToken}` };
    const [searchTitle, setSearchTitle] = useState('');
    const [sortBy, setSortBy] = useState('title');
    const [sortDirection, setSortDirection] = useState(1);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria);
    const [tempSearchCriteria, setTempSearchCriteria] = useState<SearchCriteria>(defaultSearchCriteria);
    const [stories, setStories] = useState<Story[]>([]);
    const [showModal, setShowModal] = useState<ModalType>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, isLoading] = useState(true);

    const getUser = useCallback(async () => {
        axios.get(`${API_URL}/users/`, { headers })
            .then(result => {
                    setUser(result.data.user);
            }).catch(error => setErrorMessage(error.response.data.message));
    }, []);

    const getList = useCallback(async () => {
        if (!loading) isLoading(true);
        Keyboard.dismiss()
        const controller = new AbortController();
        axios.post(`${API_URL}/stories/all`, { ...searchCriteria, sortBy, sortDirection, searchTitle }, { headers, signal:controller.signal }).then(result => {
         
                setStories(result.data.stories);
                isLoading(false);
                setShowModal('');
    
        })
            .catch(() => setErrorMessage('An error occured while loading the stories'));
        return () => { controller.abort() }
    }, [searchCriteria, sortBy, sortDirection]);

    //  Isfocused is needed if new page is added in storyscreen, which needs to be shown in the StoryCard
    useEffect(() => {
        if (!isFocused) isLoading(true);
        else {
            getList();
            getUser();
        }
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
        setSearchCriteria({ ...defaultSearchCriteria });

    }

    const onApplyFilter = () => {
        setSearchCriteria({ ...tempSearchCriteria });

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
        if (user.frogcoins < 3) {
            setErrorMessage(`You need ${3 - user.frogcoins} more accepted pages to start a new story. `)
        } else {
            setShowModal('NewStory')
        }
    }
    const newStoryClosed = (submitted: boolean) => {
        if (submitted)
            getUser();
        setShowModal('');
    }

    const getForm = () => {
        if (showModal === 'Filter') {
            return <Filter
                onClearForm={onClearFilter}
                onApply={onApplyFilter}
                filters={tempSearchCriteria}
                changeFilter={(changes) => setTempSearchCriteria(prevState => ({ ...prevState, ...changes }))} />
        } else if (showModal === 'NewStory') {
            return <NewStory onCloseForm={newStoryClosed} />
        }
    }

    const form = getForm();
    const filterIcon = filtersOn() ? 'filter' : 'filter-outline';

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={showModal !== '' || loading}
                    onDismiss={() => setShowModal('')}>
                    {loading ? <ActivityIndicator size={'large'} animating={loading} color={Color.secondary} /> : form}
                </Modal>
            </Portal>
            <View style={styles.container}>
                <Searchbar
                    onIconPress={onStoryNameSearch}
                    style={styles.searchBar}
                    autoComplete={true}
                    placeholder='Search by title'
                    onChangeText={handleSearchBar}
                    onSubmitEditing={onStoryNameSearch}
                    value={searchTitle} />
                <Top >
                    <SortBy
                        direction={sortDirection}
                        currentCriteria={sortBy}
                        criteriaChanged={handleSort} />
                        <View style={styles.filter}>
                    <Button  style={styles.filter} icon={filterIcon} color={Color.button} onPress={() => setShowModal('Filter')} >
                    {filterIcon==='filter' ? 'Filtered' : 'Filter'}
                    </Button>
                    </View>
                </Top>
                {stories.length === 0
                    ? <SadMessageBox message='No stories to show' />
                    : <StoryList stories={stories} />}

                <Fab label='Add story' onPress={onNewStoryClicked} />
            </View>
            <Snackbar onDismiss={() => setErrorMessage('')} visible={errorMessage !== ''} duration={2000}>{errorMessage}</Snackbar>
        </Provider>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    searchBar: {
        width: '80%',
        height: 40,
        borderRadius: 40,
        borderBottomWidth: 3,
        borderWidth: 1,
        backgroundColor: Color.main
    },
    filter:{
        borderBottomWidth: 3,
        borderWidth: 1,
        borderRadius:20,
        backgroundColor:Color.main,
    }

})
export default memo(Home);