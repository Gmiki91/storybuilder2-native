import { View, Text, Button, TextInput, StyleSheet, Pressable, Modal } from "react-native"
import { useRoute, RouteProp } from '@react-navigation/native';
import axios from "axios";
import React, { useState, useEffect } from "react";
import { FieldValues } from 'react-hook-form';
import { NewPage } from "../components/forms/NewPage";
import { RateLevel } from "../components/forms/RateLevel";
import { PageCard } from "../components/PageCard";
import { Page } from "../models/Page";
import { Story } from "../models/Story";
import { useAuth } from "../context/AuthContext";
import { Color } from "../Global";

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
            axios.put(`${LOCAL_HOST}/stories/page`, body, { headers })
                .then(result => setStory(result.data.story)); //add page to story 
            story.pendingPageIds.length > 1 && removePendingPages();  //remove all other pending pages
            setPageStatus("confirmed");
        }
    }

    const handleRateText = async (vote: number, confirming: boolean) => {

        if (confirming) {
            confirmPage(vote);
        } else {
            const { newPage, difference } = await axios.put(`${LOCAL_HOST}/pages/rateText`, { vote, pageId: page._id }, { headers }).then(result => result.data);
            setPage(newPage);
            if (pageStatus === 'confirmed') axios.put(`${LOCAL_HOST}/stories/rate`, { difference, storyId: params.storyId }); // rate only counts if page is not pending
        }
    }

    const handleRateLevel = (rate: string) => {
        const body = { rate: rate, pageId: page._id };
        axios.put(`${LOCAL_HOST}/pages/rateLevel`, body, { headers }).then((result) => {
            setPage(result.data.updatedPage);
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
        if (formType === 'rateLevel') return <RateLevel level={page.level} onSubmit={handleRateLevel} onClose={() => setCurrentPageIndex(-1)} />
        return null;
    }
    const onLastPage = story[pageType]?.length > 0 ? currentPageIndex === story[pageType].length - 1 : true;
    const addPageVisible = pageStatus !== 'pending' && onLastPage && (story.openEnded || userId === story.authorId);
    const toggleStatus = pageStatus === 'confirmed'
        ? story.pendingPageIds?.length > 0 && <Pressable onPress={() => toggleItems('pending')}><Text>Pending: {story.pendingPageIds.length}</Text></Pressable>
        : <Pressable onPress={() => toggleItems('confirmed')}><Text>Return to confirmed pages</Text></Pressable>

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

    return <View style={styles.container}>
        <Text>{story.title}</Text>
        {pageContent}
        {formType !== '' &&
            <Modal onRequestClose={() => setFormType('')}>
                {form}
            </Modal>}
        <View style={styles.footer}>
            {currentPageIndex > 0 && <Button title="prev" onPress={() => setCurrentPageIndex(prevState => prevState - 1)} />}
            {page._id && <View><TextInput value={currentPageIndex + 1 + ''} onChangeText={(value) => jumpTo(value)} /><Text>/ {story[pageType]?.length}</Text></View>}
            {!onLastPage && <Button title="next" onPress={() => setCurrentPageIndex(prevState => prevState + 1)} />}
        </View>
        {addPageVisible && <Button title='Add page' onPress={() => setFormType('newPage')} />}
        {toggleStatus}
    </View>
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.main,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    footer: {

    }
})
export default StoryScreen;