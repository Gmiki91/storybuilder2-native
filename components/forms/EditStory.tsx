import axios from "axios";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native"
import { Button } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { Color, API_URL } from "../../Global";
import { Story } from '../../models/Story';
import { CustomInput } from '../UI/CustomInput';
import { Form } from '../UI/Form';
type Props = {
    story: Story;
    editable: boolean;
    onClose: () => void;
}
export const EditStory = ({ onClose, story, editable }: Props) => {
    const [editing, isEditing] = useState(false);
    const [description, setDescription] = useState(story.description);
    const [title, setTitle] = useState(story.title);
    const { authToken } = useAuth();
    const headers = { Authorization: `Bearer ${authToken}` };
    const edit = async () => {
        if (editing) {
            await axios.put(`${API_URL}/stories/one/${story._id}`, { description,title }, { headers });
            isEditing(false)
        } else {
            isEditing(true)
        }
    }

    return <Form>
        <View style={styles.container}>
            {editing ? <CustomInput multiline value={title} onChangeText={setTitle}>{title}</CustomInput> : <Text style={{ fontSize: 24, marginBottom: '5%' }}>{story.title}</Text>}
            {editing ? <CustomInput multiline value={description} onChangeText={setDescription}>{description}</CustomInput> : <Text>{description}</Text>}
            <View style={styles.buttonContainer}>
                <Button color={Color.cancelBtn} onPress={onClose} >Close</Button>
                {editable && <Button color={Color.button} onPress={edit}>{editing ? 'Done editing' : 'Edit'}</Button>}
            </View>
        </View>
    </Form>
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop: 10,
    }
})