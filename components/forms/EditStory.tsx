import axios from "axios";
import { useState } from "react";
import { Text, View, StyleSheet } from "react-native"
import { Button } from "react-native-paper";
import { useAuth } from "../../context/AuthContext";
import { Color } from "../../Global";
import { Story } from '../../models/Story';
import { CustomInput } from '../UI/CustomInput';
import {Form} from '../UI/Form';
type Props = {
    story: Story;
    editable: boolean;
    onClose?: () => void;
}
const LOCAL_HOST = 'https://8t84fca4l8.execute-api.eu-central-1.amazonaws.com/dev/api';
export const EditStory = ({  onClose, story, editable }: Props) => {
    const [editing, isEditing] = useState(false);
    const [description, setDescription] = useState(story.description);
    const { token } = useAuth();
    const headers = { Authorization: `Bearer ${token}` };
    const editDescription = async () => {
        if (editing) {
            await axios.put(`${LOCAL_HOST}/stories/one/${story._id}`,{description},{ headers });
            isEditing(false)
        } else {
            isEditing(true)
        }
    }

    return <Form>
    <View style={styles.container}>
        <Text style={{fontSize:24, marginBottom:'5%'}}>{story.title}</Text>
        {editing ? <CustomInput multiline value={description} onChangeText={setDescription}>{description}</CustomInput> : <Text>{description}</Text>}
        <View style={styles.buttonContainer}>
            <Button color={Color.cancelBtn} onPress={onClose} >Close</Button>
            {editable && <Button color={Color.button} onPress={editDescription}>{editing ? 'Done editing' : 'Edit description'}</Button>}
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