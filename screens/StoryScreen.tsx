import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native'
import { Modal, Portal, Provider, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { FieldValues } from 'react-hook-form';
import { Color , API_URL} from '../Global';
import { useAuth } from '../context/AuthContext';
import { NewPage } from '../components/forms/NewPage';
import { RateLevel } from '../components/forms/RateLevel';
import { PageCard } from '../components/PageCard';
import { Fab } from '../components/UI/Fab';
import Carousel from '../components/UI/Carousel';
import { SadMessageBox } from '../components/UI/SadMessageBox';
import { BackButton } from '../components/UI/BackButton';
import { Words } from '../components/forms/Words';
import { Page, Rate } from '../models/Page';
import { Story } from '../models/Story';
import { User } from '../models/User';
import { EditStory } from '../components/forms/EditStory';
import { Note } from '../models/Note';

type ParamList = {
    Params: { storyId: string };
};

type status = 'pending' | 'confirmed';
type FormTypes = 'filter' | 'newPage' | 'rateLevel' | 'words' | 'editStory' | '';
const StoryScreen = () => {
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [user, setUser] = useState({} as User);
    const [story, setStory] = useState({} as Story);
    const [pages, setPages] = useState<Page[]>([]);
    const [currentInterval, setCurrentInterval] = useState(0);
    const [formType, setFormType] = useState<FormTypes>('');
    const [pageStatus, setPageStatus] = useState<status>('confirmed');
    const [loading, setLoading] = useState(true);
    const [jump, toggleJump] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const pageType = pageStatus === 'pending' ? 'pendingPageIds' : 'pageIds';
    const isFocused = useIsFocused();

    // init user
    useEffect(() => {
        let mounted = true
        if (isFocused) {
            axios.get(`${API_URL}/users/`, { headers })
                .then(result => {
                    if (mounted)
                        setUser(result.data.user)
                })
                .catch(() => setSnackMessage('No user to display'));
        } else {
            setLoading(true);
        }
        return () => { mounted = false }
    }, [isFocused]);

    // init story
    useEffect(() => {
        let mounted = true
        if (!loading) setLoading(true);
        axios.get(`${API_URL}/stories/one/${params.storyId}`)
            .then(result => {
                if (mounted)
                    setStory(result.data.story)
            })
            .catch(() => setSnackMessage('No story to display'));
        return () => { mounted = false }
    }, [params.storyId])

    //init pages
    useEffect(() => {
        let mounted = true
        const storyLength = story[pageType]?.length - 1;
        if (storyLength >= 0) {
            if (!loading) setLoading(true);
            axios.get(`${API_URL}/pages/many/${story[pageType]}`)
                .then(result => {
                    if (mounted) {
                        setPages(result.data.pages);
                        setLoading(false);
                    }
                })
                .catch(() => setSnackMessage('No pages to display'));
        }
        return () => { mounted = false }
    }, [story, pageType]);

    const addPendingPage = async (form: FieldValues) => {
        const page = {
            text: form.text,
            language: story.language,
        }
        const pageId = await axios.post(`${API_URL}/pages/`, page, { headers }).then((result) => result.data.pageId);
        const body = { pageId, storyId: params.storyId };
        if (user._id !== story.authorId) addNotes();

        axios.post(`${API_URL}/stories/pendingPage`, body, { headers })
            .then((result) => {
                setStory(result.data.story);
                if (result.data.tributeCompleted) {
                    setSnackMessage(`You completed your daily task. Well done!`);
                }
                setFormType('');
            })
            .catch(() => setSnackMessage('An error has occurred'));
    }

    // softdelete all pages except the current one
    const removePendingPages = (pageId: string) => {
        const index = story.pendingPageIds.indexOf(pageId)
        const idsToDelete = [...story.pendingPageIds];
        idsToDelete.splice(index, 1);
        axios.patch(`${API_URL}/pages/many/${idsToDelete.join(',')}`, { storyId: story._id }, { headers })
            .then(result => addRejectNotes(result.data.authorIds))
    }

    const removePage = (pageId: string) => {
        //remove page document
        axios.patch(`${API_URL}/pages/${pageId}`, { storyId: story._id }, { headers })
            .then(result => addRejectNotes([result.data.authorId]))
            .catch(() => setSnackMessage('An error has occured while removing the page'));
        //remove pageId from story
        axios.put(`${API_URL}/stories/pendingPage`, { pageId, storyId: params.storyId }, { headers })
            .then(result => {
                setPageStatus('confirmed');
                setStory(result.data.story);
            })
            .catch(() => setSnackMessage('An error has occured while removing the page'));
    }

    const confirmPage = (pageId: string, pageRatings: Rate[], authorId: string) => {
        axios.put(`${API_URL}/stories/page`, { pageId, storyId: story._id, pageRatings, authorId }, { headers })
            .then(result => {
                addConfirmatioNotes(authorId);
                setStory(result.data.story);
                setPageStatus('confirmed');
                setFormType('words');
            })
            .catch(() => setSnackMessage('An error has occured'));
        story.pendingPageIds.length > 1 && removePendingPages(pageId);  //remove all other pending pages   
    }

    const onNewPagePressed = () => {
        if (user.coins >= 3 || (user.markedStoryId === story._id && !user.dailyCompleted)) {
            setFormType('newPage');
        } else {
            setSnackMessage(`You need 3 coins to write a new page. You can get coins by completing the daily task.`)
        }
    }

    const updateOnePage = (newPage: Page) => {
        const updatedPages = [...pages];
        updatedPages[currentInterval] = newPage;
        setPages(updatedPages);
    }

    const handleRateText = async (vote: number, confirming: boolean, pageId: string, ratings: Rate[], authorId: string) => {
        if (confirming) {
            if (vote === -1) removePage(pageId);
            if (vote === 1){
                Alert.alert(
                    "Accepting page",
                    "All other pending pages will be rejected. Are you sure?",
                    [
                        { text: "Cancel"},
                        { text: "Yes", onPress: () =>  confirmPage(pageId, ratings, authorId)}
                    ]
                );
            }
        } else {
            const { newPage } = await axios.put(`${API_URL}/pages/rateText`, { vote, pageId }, { headers })
                .then(result => result.data)
                .catch(() => setSnackMessage('An error has occured'));
            updateOnePage(newPage);
            if (pageStatus === 'confirmed') axios.put(`${API_URL}/stories/rate`, { vote, storyId: params.storyId }, { headers }) // rate only counts if page is not pending
                .catch(() => setSnackMessage('An error has occured'));
        }
    }

    const handleRateLevel = (rate: string) => {
        const body = { rate: rate, storyId: story._id };
        axios.put(`${API_URL}/stories/level`, body, { headers })
            .then(result => {
                setStory(result.data.story);
                setFormType('');
            })
            .catch(() => setSnackMessage('An error has occured'));
    }

    const jumpTo = (amount: number) => {
        if (amount > 0) {
            if (amount + currentInterval <= story[pageType]?.length - 1) {
                setCurrentInterval(prevState => prevState + amount)
            } else {
                setCurrentInterval(story[pageType]?.length - 1)
            }
        } else {
            if (amount + currentInterval >= 0) {
                setCurrentInterval(prevState => prevState + amount)
            } else {
                setCurrentInterval(0)
            }
        }
        toggleJump(prevState => !prevState);
    }

    const toggleItems = (status: 'pending' | 'confirmed') => {
        setCurrentInterval(0);
        setPageStatus(status);
    }

    const setWords = (arr: string[]) => {
        const body = {
            storyId: params.storyId,
            word1: arr[0]?.toLocaleLowerCase().trim(),
            word2: arr[1]?.toLocaleLowerCase().trim(),
            word3: arr[2]?.toLocaleLowerCase().trim()
        }
        axios.put(`${API_URL}/stories/`, body, { headers })
            .then(result => { setStory(result.data.story); setFormType('') })
            .catch(() => setSnackMessage('An error has occured'));
    }

    const addConfirmatioNotes = (id: string) => {
        const note = {
            date: Date.now(),
            message: `Your submition for page #${story.pageIds.length} for story "${story.title}" has been accepted.`,
            code: 'A',
            storyId: story._id
        }
      
        axios.post(`${API_URL}/notifications/${id}`, { note }, { headers });
    }

    const addRejectNotes = (arr: string[]) => {
        const note = {
            date: Date.now(),
            message: `Your submition for page #${story.pageIds.length} for story "${story.title}" has been rejected.`,
            code: 'C',
            storyId: story._id
        }

        axios.post(`${API_URL}/notifications/${arr.join(',')}`, { note }, { headers });
    }

    const addNotes = () => {
        const note: Note = {
            date: Date.now(),
            message: `You've submitted page #${story.pageIds.length} for story "${story.title}". It is pending confirmation.`,
            code: 'B',
            storyId: story._id
        }
       
        axios.post(`${API_URL}/notifications`, { note }, { headers }).catch(error => setSnackMessage(error.response.data.message))
        if (story.authorName!=='Source') {
            note.message = `Page #${story.pageIds.length} has been submitted to your story "${story.title}". It is waiting your confirmation.`;
            axios.post(`${API_URL}/notifications/${story.authorId}`, { note }, { headers }).catch(error => setSnackMessage(error.response.data.message))
        }
    }

    const getForm = () => {
        switch (formType) {
            case 'newPage': return <NewPage words={[story.word1, story.word2, story.word3]} onSubmit={(f) => addPendingPage(f)} onClose={() => setFormType('')} />
            case 'rateLevel': return <RateLevel level={story.level} onSubmit={handleRateLevel} onClose={() => setFormType('')} />
            case 'words': return <Words onSubmit={setWords} onClose={() => setFormType('')} />
            case 'editStory': return <EditStory editable={story.authorId === user._id} story={story} onClose={() => setFormType('')} />
        }
        return null;
    }
    const onLastPage = story[pageType]?.length > 0 ? currentInterval === story[pageType].length - 1 : true;
    const addPageVisible = onLastPage && story.open && pageStatus === 'confirmed';
    const toggleStatus = pageStatus === 'confirmed'
        ? story.pendingPageIds?.length > 0 && <Button style={{ marginTop: '5%' }} mode='contained' color={Color.main} onPress={() => toggleItems('pending')} >Pending: {story.pendingPageIds.length}</Button>
        : <Button style={{ marginTop: '5%' }} mode='contained' color={Color.main} onPress={() => toggleItems('confirmed')} >Confirmed: {story.pageIds.length}</Button>

    const form = getForm();
    const mappedPages = pages.map((page, i) =>
        <PageCard
            key={page._id}
            page={page}
            pageNumber={i + 1}
            totalPageNumber={story[pageType]?.length}
            userId={user._id}
            ownContent={user._id === (page.authorId || story.authorId)}
            toConfirm={pageStatus === 'pending' && story.authorId === user._id}
            onRateText={(rate, confirming) => handleRateText(rate, confirming, page._id, page.ratings, page.authorId)}
            jump={jumpTo}
        />
    )
    return <Provider>
        <Portal>
            <Modal
                visible={formType !== '' || loading}
                onDismiss={() => setFormType('')}>
                {loading ? <ActivityIndicator size={'large'} animating={loading} color={Color.secondary} /> : form}
            </Modal>
        </Portal>
        <View style={styles.container}>
            <Pressable onPress={() => setFormType('editStory')}>
                <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{story.title}</Text>
            </Pressable>
            {story[pageType]?.length === 0 ? <SadMessageBox message={`This story has no ${pageStatus} pages yet`} />
                : <Carousel
                    length={story[pageType]?.length}
                    changeInterval={(value) => setCurrentInterval(prevState => prevState + value)}
                    pageType={pageType}
                    jump={jump}
                    currentInterval={currentInterval}>
                    {mappedPages}
                </Carousel>}

            {toggleStatus}
            <BackButton />
            {addPageVisible && <Fab onPress={onNewPagePressed} />}
            <Button mode='contained' style={styles.level} color={Color[story.level?.code]} onPress={() => setFormType('rateLevel')}><Text style={{ fontSize: 18 }}>{story.level?.code}</Text></Button>
        </View>
        <Snackbar onDismiss={() => setSnackMessage('')} visible={snackMessage != ''} duration={2000}>{snackMessage} </Snackbar>
    </Provider>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        padding: '2%',
        backgroundColor: Color.main,
        borderBottomWidth: 5,
        borderWidth: 1,
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        borderRadius: 15,
    },

    level: {
        borderRadius: 15,
        position: 'absolute',
        marginRight: 10,
        marginTop: 25,
        right: 0,
        top: 0,
    },

    scrollBottom: {
        height: '100%',
        width: '12%'
    }

})
export default StoryScreen;