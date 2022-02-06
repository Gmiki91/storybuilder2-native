import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
type Props={
  length:number;
}
export const Carousel:React.FC<Props> = ({length,children}) => {
  return (
    <View style={{height: '70%'}}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ ...styles.scrollView, width: `${100 * length}%` }}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        decelerationRate="fast">
        {children}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({

  scrollView: {
    display: 'flex',
    flexDirection: 'row',
  }
});
export default Carousel;