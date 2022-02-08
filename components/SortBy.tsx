import React from 'react';
import { View, Text } from 'react-native';
import SortElement from './UI/SortElement';
import { FontAwesome } from '@expo/vector-icons';
import { Color } from '../Global';

type Props = {
    direction: number,
    currentCriteria: string,
    criteriaChanged: (value: string) => void
}
const sorts = [
    { value: 'title', label: 'Title' },
    { value: 'ratingAvg', label: 'Rating' },
    { value: 'updatedAt', label: 'Recent' },
]

export const SortBy: React.FC<Props> = ({ direction, currentCriteria, criteriaChanged }:Props) => {
    const arrow = direction === 1 ? <FontAwesome name='arrow-up' size={12} color={Color.button} /> : <FontAwesome name='arrow-down' size={12} color={Color.button} />

    const list = sorts.map(sort =>
        <SortElement key={sort.value} showIcon={currentCriteria === sort.value} icon={arrow} onPress={() => criteriaChanged(sort.value)} label={sort.label} />)

    return <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft:'11%' }}>
        <Text>Sort by: </Text>
        {list}
    </View>
} 