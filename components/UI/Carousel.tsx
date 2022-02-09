import React, { useRef, useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
type Props = {
  length: number;
  currentInterval: number;
  pageType: string;
  jump:boolean;
  changeInterval: (direction: 1 | -1) => void;
}

const width = 100;

export const Carousel: React.FC<Props> = ({ length, currentInterval, pageType,jump, changeInterval, children }) => {
  const scrollRef = useRef<ScrollView>(null);

  const getInterval = (offset: any) => {
    if (offset % 360 === 0) {
      if (offset / 360 > currentInterval) {
        changeInterval(1);
      } else if (offset / 360 < currentInterval) {
        changeInterval(-1);
      }
    }
  }
  useEffect(() => {
    scrollRef.current?.scrollTo({ x: currentInterval * 360 })
  }, [pageType,jump])

  return (
    <View style={{ height: '70%' }}>
      <ScrollView
        ref={scrollRef}
        horizontal={true}
        contentContainerStyle={{ ...styles.scrollView, width: `${width * length}%` }}
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={ true } 
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