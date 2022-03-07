import { View, Text } from "react-native"
import { Color } from "../../Global"

type TimerProps = {
    minutes: number;
    hours: number;
    text: string
}
export const Timer = ({ minutes, hours, text }: TimerProps) => (
    <View style={{ backgroundColor: Color.secondary, padding: 10, borderRadius: 10 }}>
        {hours > 1 && <Text >{Math.ceil(hours)} hours left {text}</Text>}
        {hours <= 1 && <Text >{minutes.toFixed()} {minutes.toFixed() === '1' ? 'minute' : 'minutes'} left {text}</Text>}
        {hours < 1 && minutes<1 && <Text >{'less than a minute left ' } {text}</Text>}
    </View>
)
