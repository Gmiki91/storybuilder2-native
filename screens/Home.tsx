import axios from 'axios';
import { StyleSheet, View, Pressable, Keyboard } from 'react-native';
import { Modal, Portal, Provider, Searchbar, Snackbar, ActivityIndicator, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
import { CommonActions, useIsFocused, useNavigation } from '@react-navigation/native';
import { User } from '../models/User';
import { Top } from '../components/UI/Top';
import { Bell } from '../components/UI/Bell';


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
    const navigation = useNavigation();
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
    const [newNotes, setNewNotes] = useState<boolean>();
    const [showModal, setShowModal] = useState<ModalType>('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, isLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        if (isFocused) {
            axios.get(`${API_URL}/notifications/check`, { headers })
                .then(result => {
                    if (mounted)
                        setNewNotes(result.data.isNew);
                }).catch(error => setErrorMessage(error.response.data.message));

        }
        return () => { mounted = false }
    }, [isFocused]);

    const getUser = useCallback(async () => {
        let mounted = true;
        axios.get(`${API_URL}/users/`, { headers })
            .then(result => {
                if (mounted)
                    setUser(result.data.user);
            }).catch(error => setErrorMessage(error.response.data.message));
        return () => { mounted = false }
    }, []);

    const getList = useCallback(async () => {
        if (!loading) isLoading(true);
        Keyboard.dismiss()
        let mounted = true;
        axios.post(`${API_URL}/stories/all`, { ...searchCriteria, sortBy, sortDirection, searchTitle }, { headers }).then(result => {
            if (mounted) {
                setStories(result.data.stories);
                isLoading(false);
                setShowModal('');
            }
        })
            .catch(() => setErrorMessage('An error occured while loading the stories'));
        return () => { mounted = false }
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

    const goToProfile = () => {
        navigation.dispatch(CommonActions.navigate({ name: 'Profile' }))
    }
    const form = getForm();
    const filterIcon = filtersOn() ? 'filter-plus' : 'filter';

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
                    {newNotes && <Pressable onPress={goToProfile} style={{ paddingLeft: '5%', flexDirection: 'row', alignItems: 'center', }} >
                        <Bell />
                    </Pressable>}
                    <SortBy
                        direction={sortDirection}
                        currentCriteria={sortBy}
                        criteriaChanged={handleSort} />
                    <Pressable onPress={() => setShowModal('Filter')} >
                        <MaterialCommunityIcons name={filterIcon} size={24} color='black' />
                    </Pressable>
                </Top>

                {stories.length === 0
                    ? <SadMessageBox message='No stories to show' />
                    : <StoryList stories={stories} />}

                <Fab onPress={onNewStoryClicked} />
            </View>
            <Snackbar onDismiss={() => setErrorMessage('')} visible={errorMessage !== ''} duration={2000}>{errorMessage}</Snackbar>
        </Provider>
    )
}


const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        flex: 1,
        alignItems: 'center',
    },
    searchBar: {
        width: '80%',
        height: 40,
        borderRadius: 40,
        backgroundColor: Color.main
    },

})
export default memo(Home);