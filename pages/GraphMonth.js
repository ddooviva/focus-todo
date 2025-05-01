import { useEffect, useState } from 'react';
import { useToDos } from '../ToDos';
import { RealDate, HeaderDate } from '../dateTranslator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { LineChart } from "react-native-chart-kit";
import { useColor } from '../ColorContext'
import { theme } from '../color'


export default GraphMonth = () => {
    const { color, setColor } = useColor();
    const [stat, setStat] = useState()
    useEffect(() => {
        getStat().then(() => console.log("stat", stat))
    }, []);
    const getStat = async () => (setStat(await JSON.parse(await AsyncStorage.getItem("@stat"))));

    console.log("stat", stat)
    console.log("stat usage", Object.keys(stat))
    const hexToRgba = (hex, opacity) => {
        // 헥스 코드에서 RGB 값 추출
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // RGBA 형식으로 변환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    return (

        <View>

            <LineChart
                data={{
                    labels: [".", ".", ".", ".", ".", ".", ".", "today"],
                    datasets: [
                        {
                            data: [
                                1, 2, 3, 4, 5, 6, 7, 8
                            ]
                        }, {
                            data: [
                                3, 4, 5, 6, 7, 8, 9, 10
                            ]
                        }, {
                            data: [
                                1, 2, 3, 4, 5, 6, 7, 8
                            ]
                        },]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={190}
                withVerticalLines={false}
                withHorizontalLines={true}
                fromZero
                withHorizontalLabels={false}
                fromNumber={100}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    fillShadowGradientFrom: theme[color].dddgrey,
                    fillShadowGradientFromOpacity: 1,
                    fillShadowGradientTo: theme[color].dddgrey,
                    fillShadowGradientToOpacity: 0.0,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => hexToRgba(theme[color].dddgrey, opacity),
                    labelColor: (opacity = 1) => hexToRgba(theme[color].dddgrey, opacity),
                    propsForLabels: { fontWeight: 'bold', fontSize: 15 },
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        strokeOpacity: 0.5,
                        stroke: "white",
                        r: "4",
                        strokeWidth: "1",
                    }
                }}
                bezier
                style={{
                    marginLeft: -40 / 667 * Dimensions.get("window").width,
                    marginBottom: -10,
                    marginTop: 10
                }}
            />
        </View>
    )
};

