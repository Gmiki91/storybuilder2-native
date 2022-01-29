import React from "react"
import { Pressable, Text } from "react-native"

type Props = {
    label: string | JSX.Element,
    onPress: () => void
    hidden?: boolean
}

export const Button: React.FC<Props> = ({ label, onPress, hidden }) => (
    hidden ? null
        : <Pressable onPress={onPress}><Text>{label}</Text></Pressable>)