import { useState } from 'react';
import { useToDos } from '../ToDos';
import { RealDate, TodayDate } from '../dateTranslator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
<<<<<<< HEAD
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";
import { color, theme } from '../color';
const themeColor = ;

=======
import { LineChart } from "react-native-chart-kit";
import { useColor } from '../ColorContext'
import { theme } from '../color'
>>>>>>> fix-date-errir
export default GraphWeek = () => {
    const { color, setColor } = useColor();
    const { toDos, setToDos } = useToDos();
    const [helpToDos, setHelpToDos] = useState({});
    const getToDos = async () => setHelpToDos(await AsyncStorage.getItem("@toDos"));
    getToDos();
    const achiveNumD = (dateMinusNum) => {
        const a = Object.entries(toDos).filter(([key, value]) => value.progress === 2 && value.date === TodayDate() - dateMinusNum).length / Object.entries(toDos).filter(([key, value]) => value.date === TodayDate() - dateMinusNum).length
        if (isNaN(a)) { return 0 } { return a }
    };
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
                                achiveNumD(7) * 100,
                                achiveNumD(6) * 100,
                                achiveNumD(5) * 100,
                                achiveNumD(4) * 100,
                                achiveNumD(3) * 100,
                                achiveNumD(2) * 100,
                                achiveNumD(1) * 100,
                                achiveNumD(0) * 100,
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
                    fillShadowGradientFrom: theme[themeColor].dddgrey,
                    fillShadowGradientFromOpacity: 1,
                    fillShadowGradientTo: theme[themeColor].dddgrey,
                    fillShadowGradientToOpacity: 0.0,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => hexToRgba(theme[themeColor].dddgrey, opacity),
                    labelColor: (opacity = 1) => hexToRgba(theme[themeColor].dddgrey, opacity),
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
}

