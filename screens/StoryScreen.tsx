import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native'
import { Modal, Portal, Provider, Button, ActivityIndicator, IconButton } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FieldValues } from 'react-hook-form';
import { Color } from '../Global';
import { useAuth } from '../context/AuthContext';
import { NewPage } from '../components/forms/NewPage';
import { RateLevel } from '../components/forms/RateLevel';
import { PageCard } from '../components/PageCard';
import { Story } from '../models/Story';
import { Page, Rate } from '../models/Page';
import { Fab } from '../components/UI/Fab';
import Carousel from '../components/UI/Carousel';
import { SadMessageBox } from '../components/UI/SadMessageBox';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';

type NavigationProp = {
    navigation: StackNavigationProp<RootStackParamList, 'StoryScreen'>;
}

type ParamList = {
    Params: { storyId: string };
};

type status = 'pending' | 'confirmed';
type FormTypes = 'filter' | 'newPage' | 'rateLevel' | '';
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const StoryScreen: React.FC<NavigationProp> = ({ navigation }) => {
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [userId, setUserId] = useState('');
    const [story, setStory] = useState({} as Story);
    const [pages, setPages] = useState<Page[]>([]);
    const [currentInterval, setCurrentInterval] = useState(0);
    const [formType, setFormType] = useState<FormTypes>('');
    const [pageStatus, setPageStatus] = useState<status>('confirmed');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const pageType = pageStatus === 'pending' ? 'pendingPageIds' : 'pageIds';

    // init userId
    useEffect(() => {
        let mounted = true
        axios.get(`${LOCAL_HOST}/users/`, { headers })
            .then(result => setUserId(result.data.user._id))
            .catch(() => console.log('No user to display'));
        return () => { mounted = false }
    }, []);

    // init story
    useEffect(() => {
        let mounted = true
        setLoading(true);
        axios.get(`${LOCAL_HOST}/stories/${params.storyId}`)
            .then(result => setStory(result.data.story))
            .catch(() => console.log('No story to display'));
        return () => { mounted = false }
    }, [params.storyId])

    //init pages
    useEffect(() => {
        let mounted = true
        if (!loading) setLoading(true);
        const storyLength = story[pageType]?.length - 1;
        if (storyLength >= 0) {
            axios.get(`${LOCAL_HOST}/pages/many/${story[pageType]}`)
                .then(result => {
                    setPages(result.data.pages);
                    setLoading(false);
                })
                .catch(() => console.log('No pages to display'));
        } else {
            setLoading(false);
        }
        return () => { mounted = false }
    }, [story, pageType]);



    const addPage = async (form: FieldValues) => {
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
            setFormType('');
        });
    }

    // remove all pages except the current one
    const removePendingPages = (pageId: string) => {
        const index = story.pendingPageIds.indexOf(pageId)
        const idsToDelete = [...story.pendingPageIds];
        idsToDelete.splice(index, 1);
        axios.delete(`${LOCAL_HOST}/pages/many/${idsToDelete.join(',')}`, { headers })
    }

    const confirmPage = (vote: number, pageId: string, pageRatings: Rate[]) => {
        const body = { pageId, storyId: params.storyId };
        if (vote === -1) { //remove Page
            axios.delete(`${LOCAL_HOST}/pages/${pageId}`, { headers }); //remove page document
            axios.put(`${LOCAL_HOST}/stories/pendingPage`, body, { headers })
                .then(result => setStory(result.data.story)) //remove pageId from story

        } else { //add Page
            axios.put(`${LOCAL_HOST}/stories/page`, { ...body, pageRatings }, { headers })
                .then(result => {
                    setStory(result.data.story);
                    setPageStatus('confirmed');
                });
            story.pendingPageIds.length > 1 && removePendingPages(pageId);  //remove all other pending pages
        }
    }

    const updateOnePage = (newPage: Page) => {
        const updatedPages = [...pages];
        updatedPages[currentInterval] = newPage;
        setPages(updatedPages);
    }
    const handleRateText = async (vote: number, confirming: boolean, pageId: string, ratings: Rate[]) => {
        if (confirming) {
            confirmPage(vote, pageId, ratings);
        } else {
            const { newPage } = await axios.put(`${LOCAL_HOST}/pages/rateText`, { vote, pageId }, { headers }).then(result => result.data);
            updateOnePage(newPage);
            if (pageStatus === 'confirmed') axios.put(`${LOCAL_HOST}/stories/rate`, { vote, storyId: params.storyId }, { headers }); // rate only counts if page is not pending
        }
    }

    const handleRateLevel = (rate: string) => {
        const body = { rate: rate, pageId: pages[currentInterval]._id };
        axios.put(`${LOCAL_HOST}/pages/rateLevel`, body, { headers }).then((result) => {
            updateOnePage(result.data.updatedPage)
            setFormType('');
        });
    }

    const openRateLevelModule = () => {
        setFormType('rateLevel');
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
    }

    const toggleItems = (status: 'pending' | 'confirmed') => {
        setCurrentInterval(0);
        setPageStatus(status);
    }

    const getForm = () => {
        if (formType === 'newPage') return <NewPage onSubmit={(f) => addPage(f)} onClose={() => setFormType('')} />
        if (formType === 'rateLevel') return <RateLevel level={pages[currentInterval].level} onSubmit={handleRateLevel} onClose={() => setFormType('')} />
        return null;
    }
    const onLastPage = story[pageType]?.length > 0 ? currentInterval === story[pageType].length - 1 : true;
    const addPageVisible = onLastPage && (story.openEnded || userId === story.authorId);
    const toggleStatus = pageStatus === 'confirmed'
        ? story.pendingPageIds?.length > 0 && <Button style={{ marginTop: '5%' }} mode='contained' color={Color.main} onPress={() => toggleItems('pending')} >Pending: {story.pendingPageIds.length}</Button>
        : <Button style={{ marginTop: '5%' }} mode='contained' color={Color.main} onPress={() => toggleItems('confirmed')} >Return to confirmed pages</Button>

    const form = getForm();
    const mappedPages = pages.map((page, i) =>
        <PageCard
            key={page._id}
            page={page}
            pageNumber={i + 1}
            totalPageNumber={story[pageType]?.length}
            userId={userId}
            ownContent={userId === (page.authorId || story.authorId)}
            toConfirm={pageStatus === 'pending' && story.authorId === userId}
            onRateLevel={openRateLevelModule}
            onRateText={(rate, confirming) => handleRateText(rate, confirming, page._id, page.ratings)}
            jump={jumpTo}
        />
    )
    return <Provider>
        <View style={styles.container}>

            <View style={{ backgroundColor: Color.secondary, borderRadius: 20, alignSelf: 'flex-start' }}>
                <IconButton
                    icon="keyboard-return"
                    color={Color.button}
                    size={20}
                    onPress={() =>navigation.navigate('Home')}
                />
            </View>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{story.title}</Text>
            {story[pageType]?.length > 0 ?
                <Carousel
                    length={story[pageType]?.length}
                    changeInterval={(value) => setCurrentInterval(prevState => prevState + value)}
                    pageType={pageType}
                    currentInterval={currentInterval}>
                    {mappedPages}
                </Carousel>
                : <SadMessageBox message={`This story has no ${pageStatus} pages yet`} />}
            <Portal>
                <Modal
                    visible={formType !== '' || loading}
                    onDismiss={() => setFormType('')}>
                    {loading ? <ActivityIndicator size={'large'} animating={loading} color={Color.secondary} /> : form}
                </Modal>
            </Portal>

            {toggleStatus}
        </View>
        {addPageVisible && <Fab onPress={() => setFormType('newPage')} />}
    </Provider>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        backgroundColor: Color.main,
        textAlign: 'center',
        borderRadius: 15,
        fontSize: 20,
        marginBottom: 5,
        padding: 5,
        borderBottomWidth: 5,
        borderWidth: 1,
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
    },
    scrollBottom: {
        height: '100%',
        width: '12%'
    }

})
export default StoryScreen;