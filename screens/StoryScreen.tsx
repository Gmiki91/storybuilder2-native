import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native'
import { Modal, Portal, Provider, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { FieldValues } from 'react-hook-form';
import { Color } from '../Global';
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

type ParamList = {
    Params: { storyId: string };
};

type status = 'pending' | 'confirmed';
type FormTypes = 'filter' | 'newPage' | 'rateLevel' | 'words' | 'editStory' | '';
const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
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
            axios.get(`${LOCAL_HOST}/users/`, { headers })
                .then(result => {
                    if (mounted)
                        setUser(result.data.user)
                })
                .catch((e) => console.log('No user to display', e));
        } else {
            setLoading(true);
        }
        return () => { mounted = false }
    }, [isFocused]);

    // init story
    useEffect(() => {
        let mounted = true
        if (!loading) setLoading(true);
        axios.get(`${LOCAL_HOST}/stories/one/${params.storyId}`)
            .then(result => {
                if (mounted)
                    setStory(result.data.story)
            })
            .catch((e) => console.log('No story to display', e));
        return () => { mounted = false }
    }, [params.storyId])

    //init pages
    useEffect(() => {
        let mounted = true
        const storyLength = story[pageType]?.length - 1;
        if (storyLength >= 0) {
            if (!loading) setLoading(true);
            axios.get(`${LOCAL_HOST}/pages/many/${story[pageType]}`)
                .then(result => {
                    if (mounted) {
                        setPages(result.data.pages);
                        setLoading(false);
                    }
                })
                .catch((e) => console.log('No pages to display', e));
        }
        return () => { mounted = false }
    }, [story, pageType]);

    const addPendingPage = async (form: FieldValues) => {
        const page = {
            text: form.text,
            level: form.level,
            language: story.language,
            rating: []
        }
        const pageId = await axios.post(`${LOCAL_HOST}/pages/`, page, { headers }).then((result) => result.data.pageId);
        const body = { pageId, storyId: params.storyId };
        axios.post(`${LOCAL_HOST}/stories/pendingPage`, body, { headers }).then((result) => {
            setStory(result.data.story);
            if (result.data.tributeCompleted) {
                setSnackMessage('You completed your daily tribute and have recieved 1 clay tablet. Well done!');
            }
            setFormType('');
        });
    }

    // softdelete all pages except the current one
    const removePendingPages = (pageId: string) => {
        const index = story.pendingPageIds.indexOf(pageId)
        const idsToDelete = [...story.pendingPageIds];
        idsToDelete.splice(index, 1);
        axios.delete(`${LOCAL_HOST}/pages/many/${idsToDelete.join(',')}`, { headers })
    }

    const removePage = (pageId: string) => {
        axios.delete(`${LOCAL_HOST}/pages/${pageId}`, { headers })
            .catch(e => console.log('removePage error', e)); //remove page document
        axios.put(`${LOCAL_HOST}/stories/pendingPage`, { pageId, storyId: params.storyId }, { headers })
            .then(result => {
                setPageStatus('confirmed');
                setStory(result.data.story);
            }) //remove pageId from story
            .catch(e => console.log('removePageId from story error', e));
    }

    const confirmPage = (pageId: string, pageRatings: Rate[]) => {
        const pageIds = [...story.pageIds, pageId]
        axios.put(`${LOCAL_HOST}/stories/page`, { pageId, storyId: story._id, pageRatings, pageIds }, { headers })
            .then(result => {
                setStory(result.data.story);
                setPageStatus('confirmed');
                setFormType('words');
            })
            .catch(e => console.log('confirm Page error', e));
        story.pendingPageIds.length > 1 && removePendingPages(pageId);  //remove all other pending pages   
    }

    const onNewPagePressed = () => {
        if (user.numberOfTablets >= 1 || (user.markedStoryId === story._id && !user.dailyCompleted)) {
            setFormType('newPage');
        } else {
            setSnackMessage(`You need a tablet to write on. You can get tablets by completing the daily tribute.`)
        }
    }

    const updateOnePage = (newPage: Page) => {
        const updatedPages = [...pages];
        updatedPages[currentInterval] = newPage;
        setPages(updatedPages);
    }

    const handleRateText = async (vote: number, confirming: boolean, pageId: string, ratings: Rate[]) => {
        if (confirming) {
            if (vote === -1) removePage(pageId);
            if (vote === 1) confirmPage(pageId, ratings);
        } else {
            const { newPage } = await axios.put(`${LOCAL_HOST}/pages/rateText`, { vote, pageId }, { headers }).then(result => result.data);
            updateOnePage(newPage);
            if (pageStatus === 'confirmed') axios.put(`${LOCAL_HOST}/stories/rate`, { vote, storyId: params.storyId }, { headers }); // rate only counts if page is not pending
        }
    }

    const handleRateLevel = (rate: string) => {
        const body = { rate: rate, storyId: story._id };
        axios.put(`${LOCAL_HOST}/stories/level`, body, { headers })
            .then(result => {
                setStory(result.data.story);
                setFormType('');
            })
            .catch((error) => console.log('rateStoryLevel error ', error))
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
        axios.put(`${LOCAL_HOST}/stories/`, body, { headers })
            .then(result => { setStory(result.data.story); setFormType('') })
            .catch(err => console.log('setWords error: ', err));
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
    const addPageVisible = onLastPage && story.open;
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
            onRateText={(rate, confirming) => handleRateText(rate, confirming, page._id, page.ratings)}
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
        <Snackbar onDismiss={() => setSnackMessage('')} visible={snackMessage != ''} duration={4000}>{snackMessage} </Snackbar>
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