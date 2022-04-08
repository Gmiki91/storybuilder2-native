import { levels,languages,LanguageModel } from '../../models/LanguageData';
import { Form } from '../UI/Form';
import { Text, View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Radio } from '../UI/Radio';
import { Color } from '../../Global';
import { Chip, Divider, Button } from 'react-native-paper';
import { CheckBox } from '../UI/CheckBox';

export type FilterTypes = {
    from: string,
    languages: string[],
    levels: string[],
    open: string;
}

type Props = {
    onApply: () => void;
    onClearForm: () => void;
    filters: FilterTypes;
    changeFilter: (change: FilterTypes) => void;
}

export const Filter: React.FC<Props> = ({ filters, changeFilter, onApply, onClearForm }) => {

    const handleChange = (filter: 'levels' | 'languages', value: string) => {
        const originalValues = [...filters[filter]];
        if (!originalValues.includes(value)) {
            originalValues.push(value);
            const updatedFilters = { ...filters };
            updatedFilters[filter] = originalValues;
            changeFilter(updatedFilters);
        }
    }

    const handleRemove = (filter: 'languages' | 'levels', value: string) => {
        const arr = [...filters[filter]];
        const index = arr.findIndex(e => e === value);
        arr.splice(index, 1);
        const updatedFilters = { ...filters };
        updatedFilters[filter] = arr;
        changeFilter(updatedFilters);
    }

    const handleLevel=(checked:boolean, value:string)=>{
        if(checked) handleChange('levels', value)
        else handleRemove('levels',value)
          
    }

    return <Form>
        <Text>Selected languages:</Text>
        <View style={{ flexDirection: 'column'}}>
            {filters.languages.map(lang =>
                <Chip style={{backgroundColor: Color.secondary}} key={lang} onPress={() => handleRemove('languages', lang)} onClose={() => handleRemove('languages', lang)}>
                    <Text>{lang}</Text>
                </Chip>
            )}
        </View>
        <Picker
            selectedValue={filters.languages[filters.languages.length - 1]}
            onValueChange={e => { handleChange('languages', e) }} >
            {languages.map(lang =>
                 <Picker.Item key={lang.code} value={lang.text} label={`${lang.code} ${lang.text}`} />)}
        </Picker>

        <Divider />

        <Text>Selected levels:</Text>
        {levels.map(level => <CheckBox onPress={(checked)=>handleLevel(checked, level.code)} key={level.code} checked={filters.levels.indexOf(level.code)!==-1} label={`${level.code} - ${level.text}`} />)}
    
        <Divider />
        <Text>Stories:</Text>
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
        <Divider />
        <Text>Archived:</Text>
        <View style={styles.buttonContainer}>
            <Radio
                label='Yes'
                value='yes'
                status={filters.open === 'true' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, open: 'true' })} />
            <Radio
                label='No'
                value='no'
                status={filters.open === 'false' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, open: 'false' })} />
            <Radio
                label='Both'
                value='both'
                status={filters.open === 'both' ? 'checked' : 'unchecked'}
                onPress={() => changeFilter({ ...filters, open: 'both' })} />
        </View>

        <Divider />
        <View style={styles.buttonContainer}>
            <Button color={Color.cancelBtn} onPress={onClearForm} >Clear</Button>
            <Button color={Color.button} onPress={onApply} >Apply</Button>
        </View>
    </Form>
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 10,
        marginTop: 10,
    }
})