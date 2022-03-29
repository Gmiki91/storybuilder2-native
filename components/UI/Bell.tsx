import { useEffect } from 'react'
import { Animated } from 'react-native'
import { Avatar } from 'react-native-paper';
import { Color } from '../../Global';

export const Bell = () => {
    useEffect(() => {
        startShake();
    })
    const shakeAnimation = new Animated.Value(0);
    const startShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnimation, { toValue: 2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: -2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 2, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnimation, { toValue: 0, duration: 1000, useNativeDriver: true })
        ]).start(() => startShake());
    }

    return (<Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <Avatar.Icon size={24} style={{ backgroundColor: Color.C }} icon="bell-ring" />
    </Animated.View>)
}