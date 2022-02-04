import axios from "axios";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native"
import { Modal, Portal, Provider } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FieldValues } from 'react-hook-form';
import { Color } from "../Global";
import { useAuth } from "../context/AuthContext";
import { NewPage } from "../components/forms/NewPage";
import { RateLevel } from "../components/forms/RateLevel";
import { PageCard } from "../components/PageCard";
import { Button } from "../components/UI/Button";
import { Story } from "../models/Story";
import { Page } from "../models/Page";
import { Fab } from "../components/UI/Fab";

type ParamList = {
    Params: { storyId: string };
};

type status = 'pending' | 'confirmed';
type FormTypes = 'filter' | 'newPage' | 'rateLevel' | '';
const LOCAL_HOST = 'http://192.168.31.203:3030/api';
const StoryScreen = () => {
    const { params } = useRoute<RouteProp<ParamList, 'Params'>>();
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const [userId, setUserId] = useState('');
    const [story, setStory] = useState({} as Story);
    const [page, setPage] = useState({} as Page);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [formType, setFormType] = useState<FormTypes>('');
    const [pageStatus, setPageStatus] = useState<status>('confirmed');
    const [loading, isLoading] = useState(false);
    const [error, setError] = useState<string>();
    const pageType = pageStatus === 'pending' ? 'pendingPageIds' : 'pageIds';
    useEffect(() => {
        axios.get(`${LOCAL_HOST}/users/`, { headers })
            .then(result => setUserId(result.data.user._id))
    }, []);

    useEffect(() => {
        isLoading(true);
        axios.get(`${LOCAL_HOST}/stories/${params.storyId}`)
            .then(result => setStory(result.data.story))
            .catch(() => setError('No story to display'));
    }, [params.storyId])

    useEffect(() => {
        !loading && isLoading(true);
        const storyLength = story[pageType]?.length - 1;
        if (storyLength >= 0) {
            let id;
            if (storyLength < currentPageIndex) { //currentIndex is out of bound
                id = story[pageType][storyLength];
                setCurrentPageIndex(storyLength);
            } else {
                id = story[pageType][currentPageIndex];
            }
            axios.get(`${LOCAL_HOST}/pages/${id}`)
                .then(result => {
                    setPage(result.data.page);
                    isLoading(false);
                })
        } else if (pageStatus === 'pending') { // length of pending pages is 0, switch to confirmed
            setPageStatus('confirmed');
            if (story.pageIds?.length === 0) setPage({} as Page); //if confirmed is also 0, empty page state
        } else {
            isLoading(false);
            setPage({} as Page);
        }
    }, [currentPageIndex, story, pageStatus, pageType]);

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
    const removePendingPages = () => {
        const index = story.pendingPageIds.indexOf(page._id)
        const idsToDelete = [...story.pendingPageIds];
        idsToDelete.splice(index, 1);
        axios.delete(`${LOCAL_HOST}/pages/pending/${idsToDelete.join(',')}`, { headers })
    }

    const confirmPage = (vote: number) => {
        const body = { pageId: page._id, storyId: params.storyId };
        if (vote === -1) { //remove Page
            axios.delete(`${LOCAL_HOST}/pages/${page._id}`, { headers }); //remove page document
            axios.put(`${LOCAL_HOST}/stories/pendingPage`, body, { headers })
                .then(result => setStory(result.data.story)) //remove pageId from story

        } else { //add Page
            axios.put(`${LOCAL_HOST}/stories/page`, { ...body, pageRatings: page.ratings }, { headers })
                .then(result => setStory(result.data.story)); //add page to story 
            story.pendingPageIds.length > 1 && removePendingPages();  //remove all other pending pages
            setPageStatus("confirmed");
        }
    }

    const handleRateText = async (vote: number, confirming: boolean) => {
        if (confirming) {
            confirmPage(vote);
        } else {
            const { newPage } = await axios.put(`${LOCAL_HOST}/pages/rateText`, { vote, pageId: page._id }, { headers }).then(result => result.data);
            setPage(newPage);
            if (pageStatus === 'confirmed') axios.put(`${LOCAL_HOST}/stories/rate`, { vote, storyId: params.storyId }, { headers }); // rate only counts if page is not pending
        }
    }

    const handleRateLevel = (rate: string) => {
        const body = { rate: rate, pageId: page._id };
        axios.put(`${LOCAL_HOST}/pages/rateLevel`, body, { headers }).then((result) => {
            setPage(result.data.updatedPage);
            setFormType('');
        });
    }

    const jumpTo = (page: string) => {
        if (page === '') {
            setCurrentPageIndex(0)
        } else {
            const number = parseInt(page) - 1;
            if (!isNaN(number) && number >= 0 && story[pageType]?.length - 1 >= number && currentPageIndex !== number) setCurrentPageIndex(number);
        }
    }

    const toggleItems = (status: 'pending' | 'confirmed') => {
        setCurrentPageIndex(0);
        setPageStatus(status);
    }

    const getForm = () => {
        if (formType === 'newPage') return <NewPage onSubmit={(f) => addPage(f)} onClose={() => setFormType('')} />
        if (formType === 'rateLevel') return <RateLevel level={page.level} onSubmit={handleRateLevel} onClose={() => setFormType('')} />
        return null;
    }
    const onLastPage = story[pageType]?.length > 0 ? currentPageIndex === story[pageType].length - 1 : true;
    const addPageVisible = onLastPage && (story.openEnded || userId === story.authorId);
    const toggleStatus = pageStatus === 'confirmed'
        ? story.pendingPageIds?.length > 0 && <Button label={`Pending: ${story.pendingPageIds.length}`} onPress={() => toggleItems('pending')} />
        : <Button label='Return to confirmed pages' onPress={() => toggleItems('confirmed')} />

    const form = getForm();

    const pageContent = page._id ? <PageCard
        key={page._id}
        page={page}
        userId={userId}
        ownContent={userId === (page.authorId || story.authorId)}
        toConfirm={pageStatus === 'pending' && story.authorId === userId}
        onRateLevel={() => setFormType('rateLevel')}
        onRateText={handleRateText}
    /> : <Text>No pages yet </Text>

    return <Provider>
        <View style={styles.container}>
        {addPageVisible && <Fab onPress={() => setFormType('newPage')} />}
            <Text style={styles.title}>{story.title}</Text>
            {pageContent}
            <Portal>
                <Modal
                    visible={formType !== ''}
                    onDismiss={() => setFormType('')}>
                    {form}
                </Modal>
            </Portal>
            {page._id && <View style={{ justifyContent: 'center' }}><Text> {currentPageIndex + 1 + ''} / {story[pageType]?.length}</Text></View>}
            <View style={styles.footer}>
                {currentPageIndex > 0 && <Button style={{ marginRight: 10 }} label="prev" onPress={() => setCurrentPageIndex(prevState => prevState - 1)} />}
                {!onLastPage && <Button label="next" onPress={() => setCurrentPageIndex(prevState => prevState + 1)} />}
            </View>
            {toggleStatus}
        </View>
    </Provider>
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.main,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    title: {
        fontSize: 32,
        marginBottom: 15,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },

})
export default StoryScreen;