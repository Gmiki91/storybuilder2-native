import axios from "axios";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Modal, Portal, Provider, Button } from 'react-native-paper';
import { useRoute, RouteProp } from '@react-navigation/native';
import { FieldValues } from 'react-hook-form';
import { Color } from "../Global";
import { useAuth } from "../context/AuthContext";
import { NewPage } from "../components/forms/NewPage";
import { RateLevel } from "../components/forms/RateLevel";
import { PageCard } from "../components/PageCard";
import { Story } from "../models/Story";
import { Page } from "../models/Page";
import { Fab } from "../components/UI/Fab";
import Carousel from "../components/Carousel";

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
    const [pages, setPages] = useState<Page[]>([]);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [formType, setFormType] = useState<FormTypes>('');
    const [pageStatus, setPageStatus] = useState<status>('confirmed');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const pageType = pageStatus === 'pending' ? 'pendingPageIds' : 'pageIds';
    useEffect(() => {
        axios.get(`${LOCAL_HOST}/users/`, { headers })
            .then(result => setUserId(result.data.user._id))
    }, []);

    useEffect(() => {
        setLoading(true);
        axios.get(`${LOCAL_HOST}/stories/${params.storyId}`)
            .then(result => setStory(result.data.story))
            .catch(() => setError('No story to display'));
    }, [params.storyId])

    useEffect(() => {
        if (!loading) setLoading(true);
        axios.get(`${LOCAL_HOST}/pages/many/${story[pageType]}`)
            .then(result => {
                setPages(result.data.pages);
                setLoading(false);
            })
        // const storyLength = story[pageType]?.length - 1;
        // if (storyLength >= 0) {
        // let id;
        // if (storyLength < currentPageIndex) { //currentIndex is out of bound
        //     id = story[pageType][storyLength];
        //     setCurrentPageIndex(storyLength);
        // } else {
        //     id = story[pageType][currentPageIndex];
        // }
        // axios.get(`${LOCAL_HOST}/pages/${id}`)
        //     .then(result => {
        //         setPage(result.data.page);
        //         isLoading(false);
        //     })
        // } else if (pageStatus === 'pending') { // length of pending pages is 0, switch to confirmed
        //     setPageStatus('confirmed');
        //     if (story.pageIds?.length === 0) setPage({} as Page); //if confirmed is also 0, empty page state
        // } else {
        //     isLoading(false);
        //     setPage({} as Page);
        // }
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
        axios.delete(`${LOCAL_HOST}/pages/many/${idsToDelete.join(',')}`, { headers })
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
        ? story.pendingPageIds?.length > 0 && <Button mode='contained' color={Color.containedButton} onPress={() => toggleItems('pending')} >Pending: {story.pendingPageIds.length}</Button>
        : <Button mode='contained' color={Color.containedButton} onPress={() => toggleItems('confirmed')} >Return to confirmed pages</Button>

    const form = getForm();

    const mappedPages = pages.map(page =>
        <PageCard
            batch={story[pageType]?.length}
            key={page._id}
            page={page}
            pageNumber={`${currentPageIndex + 1 + ''} / ${story[pageType]?.length}`}
            userId={userId}
            ownContent={userId === (page.authorId || story.authorId)}
            toConfirm={pageStatus === 'pending' && story.authorId === userId}
            onRateLevel={() => setFormType('rateLevel')}
            onRateText={handleRateText}
        />
    )

    return <Provider>
        <View style={styles.container}>
            {addPageVisible && <Fab onPress={() => setFormType('newPage')} />}
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{story.title}</Text>
            <Carousel
                length={story[pageType]?.length}>
                {mappedPages}
            </Carousel>
            <Portal>
                <Modal
                    visible={formType !== ''}
                    onDismiss={() => setFormType('')}>
                    {form}
                </Modal>
            </Portal>

            <View style={styles.footer}>
                {currentPageIndex > 0 && <Button style={{ marginRight: 10 }} mode='contained' color={Color.containedButton} onPress={() => setCurrentPageIndex(prevState => prevState - 1)} >prev</Button>}
                {!onLastPage && <Button mode='contained' color={Color.containedButton} onPress={() => setCurrentPageIndex(prevState => prevState + 1)} >next</Button>}
            </View>
            {toggleStatus}
        </View>
    </Provider>
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        backgroundColor: Color.secondaryButton,
        textAlign: 'center',
        borderRadius: 15,
        fontSize: 20,
        marginBottom: 15,
        padding: 5

    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },

})
export default StoryScreen;