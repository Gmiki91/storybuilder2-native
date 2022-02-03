import { levels } from '../../models/LanguageLevels';
import data from '../../assets/languages.json';
import { Form } from '../UI/Form';
import {  Text, View, StyleSheet  } from 'react-native';
import { Button } from '../UI/Button';
import { Picker } from '@react-native-picker/picker';
import { Radio } from '../UI/Radio';
import { Color } from '../../Global';
import { Chip, Divider } from 'react-native-paper';

export type FilterTypes = {
    from: string,
    languages: string[],
    levels: string[],
    openEnded: string;
}

type Props = {
    onApply: () => void;
    onCloseForm: () => void;
    filters: FilterTypes;
    changeFilter: (change: FilterTypes) => void;
}

export const Filter: React.FC<Props> = ({ filters, changeFilter, onApply, onCloseForm }) => {

    const handleChange = (filter: 'levels' | 'languages', value: string) => {
        const originalValues = [...filters[filter]];
        if (!originalValues.includes(value)) {
            originalValues.push(value);
            const updatedFilters = { ...filters };
            updatedFilters[filter] = originalValues;
            changeFilter(updatedFilters);
        }
    }

    const handleRemoveFilter = (filter: 'languages' | 'levels', value: string) => {
        const arr = [...filters[filter]];
        const index = arr.findIndex(e => e === value);
        arr.splice(index, 1);
        const updatedFilters = { ...filters };
        updatedFilters[filter] = arr;
        changeFilter(updatedFilters);
    }

    return <Form>
        <Text>Selected languages:</Text>
        <View style={{ flexDirection: 'column' }}>
            {filters.languages.map(lang =>
                <Chip key={lang} onPress={() => handleRemoveFilter('languages', lang)} onClose={() => handleRemoveFilter('languages', lang)}>
                    <Text>{lang}</Text>
                </Chip>
            )}
        </View>
        <Picker
            selectedValue={filters.languages[filters.languages.length - 1]}
            onValueChange={e => { handleChange('languages', e) }} >
            {data.map(lang => <Picker.Item key={lang.code} value={lang.name} label={lang.name} />)}
        </Picker>

        <Divider/>

        <Text>Selected levels:</Text>
        <View style={{ flexDirection: 'row' }}>
            {filters.levels.map(lvl =>
                <Chip key={lvl} onPress={() => handleRemoveFilter('levels', lvl)} onClose={() => handleRemoveFilter('levels', lvl)}>
                    <Text>{lvl}</Text>
                </Chip>
            )}
        </View>
        <Picker
            selectedValue={''}
            onValueChange={e => { handleChange('levels', e) }} >
            {levels.map(level => <Picker.Item key={level.code} value={level.code} label={`${level.code} - ${level.text}`} />)}
        </Picker>

        <Divider/>

        <Text>Open for new submissions:</Text>
        <View style={styles.buttonContainer}>
            <Radio
                label='Yes'
                value='yes'
                status={filters.openEnded === 'true' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, openEnded: 'true' })} />
            <Radio
                label='No'
                value='no'
                status={filters.openEnded === 'false' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, openEnded: 'false' })} />
            <Radio
                label='Both'
                value='both'
                status={filters.openEnded === 'both' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, openEnded: 'both' })} />
        </View>

        <Divider/>

        <Text>Stories from:</Text>
        <View style={styles.buttonContainer}>
            <Radio
                label='Own'
                value='own'
                status={filters.from === 'own' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, from: 'own' })} />
            <Radio
                label='Favorite'
                value="favorite"
                status={filters.from === 'favorite' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, from: 'favorite' })} />
            <Radio
                label='All'
                value="all"
                status={filters.from === 'all' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, from: 'all' })} />
        </View>

        <Divider/>
        <View style={styles.buttonContainer}>
            <Button style={{ backgroundColor: Color.lightRed }} label='Cancel' onPress={onCloseForm} />
            <Button label='Apply' onPress={onApply} />
        </View>
    </Form>
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop:10,
    }
})