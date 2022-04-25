import axios from "axios";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native"
import { Button } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { Color, API_URL } from "../../Global";
import { Story } from '../../models/Story';
import { CustomInput } from '../UI/CustomInput';
import { ErrorMessage } from "../UI/ErrorMessage";
import { Form } from '../UI/Form';
type Props = {
    story: Story;
    editable: boolean;
    onClose: (isChanged: boolean) => void;
}
export const EditStory = ({ onClose, story, editable }: Props) => {
    const [editing, isEditing] = useState(false);
    const [error, setError] = useState<string>();
    const [description, setDescription] = useState(story.description);
    const [title, setTitle] = useState(story.title);
    const { authToken } = useAuth();
    const headers = { Authorization: `Bearer ${authToken}` };
    const edit = async () => {
        if (editing) {
            if (title.trim().length > 2) {
                await axios.put(`${API_URL}/stories/one/${story._id}`, { description, title }, { headers });
                isEditing(false)
                onClose(true);
            } else {
                setError('Title must be at least 3 characters long');
            }
        } else {
            isEditing(true)
        }
    }

    const archive = () =>{
        axios.patch(`${API_URL}/stories/one/${story._id}`, { open:!story.open }, { headers }).then(()=> {
            onClose(true);
        })
    }

    return <Form>
        <View style={styles.container}>
            {editing ? <CustomInput value={title} onChangeText={setTitle}>{title}</CustomInput> : <Text style={{ fontSize: 24, marginBottom: '5%' }}>{story.title}</Text>}
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {editing ? <CustomInput multiline value={description} onChangeText={setDescription}>{description}</CustomInput> : <Text>{description}</Text>}
            <View style={styles.buttonContainer}>
                {editable && <Button color={Color.button} onPress={edit}>{editing ? 'Done editing' : 'Edit'}</Button>}
                {editable && <Button color={story.open ? Color.C:Color.A} onPress={archive}>{story.open ? 'Archive story' : 'Reopen story'}</Button>}
            </View>
        </View>
        <Button style={styles.cancelButton} color={Color.cancelBtn} onPress={() => onClose(false)}>X</Button>
    </Form>
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    buttonContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 10,
    },
    cancelButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    }
})