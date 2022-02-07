import React from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'

type Props = {
  length: number;
  currentInterval: number;
  changeInterval: (direction:1 | -1) => void;
}

const width = 100;

export const Carousel: React.FC<Props> = ({ length, currentInterval, changeInterval, children }) => {

  const getInterval = (offset: any) => {
    if (offset % 360 === 0) {
      if (offset / 360 > currentInterval) {
        changeInterval(1);
      } else if (offset / 360 < currentInterval) {
        changeInterval(-1);
      }
    }
  }

  return (
    <View style={{ height: '70%' }}>
      <ScrollView
        horizontal={true}
        contentContainerStyle={{ ...styles.scrollView, width: `${width * length}%` }}
        showsHorizontalScrollIndicator={false}
        onScroll={data => getInterval(data.nativeEvent.contentOffset.x)}
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