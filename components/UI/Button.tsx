import React from "react"
import { Pressable, StyleProp, Text, ViewStyle } from "react-native"

type Props = {
    label: string | JSX.Element,
    onPress: () => void
    hidden?: boolean
    style?:StyleProp<ViewStyle>
}

export const Button: React.FC<Props> = ({ label,style, onPress, hidden }) => (
    hidden ? null
        : <Pressable style={style} onPress={onPress}><Text>{label}</Text></Pressable>)