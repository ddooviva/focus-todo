import { useEffect, useState } from 'react';
import { useToDos } from '../ToDos';
import { RealDate, HeaderDate } from '../dateTranslator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { LineChart } from "react-native-chart-kit";
import { useColor } from '../ColorContext'
import { theme } from '../color'


export default GraphWeek = ({ stat }) => {
    const { color, setColor } = useColor();
    const [showEx1, setShowEx1] = useState(false);
    const [showEx2, setShowEx2] = useState(false);
    const [showEx3, setShowEx3] = useState(false);
    const sortedKeys = Object.keys(stat).sort().reverse();
    const usage = (n) => { if (stat[sortedKeys[n]] === undefined) { return 0 } else return stat[sortedKeys[n]].usage };
    const focus = (n) => { if (stat[sortedKeys[n]] === undefined) { return 0 } else return stat[sortedKeys[n]].focus };
    const completed = (n) => { if (stat[sortedKeys[n]] === undefined) { return 0 } else return stat[sortedKeys[n]].completed };

    const hexToRgba = (hex, opacity) => {
        // 헥스 코드에서 RGB 값 추출
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // RGBA 형식으로 변환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const hexToRgbaR = (hex, opacity) => {
        // 헥스 코드에서 RGB 값 추출
        const r = parseInt(hex.slice(1, 3), 16) - 100;
        const g = parseInt(hex.slice(3, 5), 16) - 100;
        const b = parseInt(hex.slice(5, 7), 16) - 100;

        // RGBA 형식으로 변환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };
    const hexToRgbaG = (hex, opacity) => {
        // 헥스 코드에서 RGB 값 추출
        const r = parseInt(hex.slice(1, 3), 16) - 20;
        const g = parseInt(hex.slice(3, 5), 16) - 20;
        const b = parseInt(hex.slice(5, 7), 16) - 20;

        // RGBA 형식으로 변환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const hexToRgbaB = (hex, opacity) => {
        // 헥스 코드에서 RGB 값 추출
        const r = parseInt(hex.slice(1, 3), 16) + 40;
        const g = parseInt(hex.slice(3, 5), 16) + 40;
        const b = parseInt(hex.slice(5, 7), 16) + 40;

        // RGBA 형식으로 변환
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const styles = StyleSheet.create({
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 8,
        },
        legendColor: {
            width: 12,
            height: 12,
            borderRadius: 6,
            marginRight: 6,
        },
        legendText: {
            fontSize: 14,
            color: 'black', // 또는 theme[color].text 이런 걸로 바꿔도 돼
        },
    });
    return (

        <View>

            <LineChart
                data={{
                    datasets: [
                        {
                            data: [
                                usage(9) / 7 * 100,
                                usage(8) / 7 * 100,
                                usage(7) / 7 * 100,
                                usage(6) / 7 * 100,
                                usage(5) / 7 * 100,
                                usage(4) / 7 * 100,
                                usage(3) / 7 * 100,
                                usage(2) / 7 * 100,
                                usage(1) / 7 * 100,
                                usage(0) / 7 * 100,
                            ], color: () => hexToRgbaR(theme[color].dddgrey, 0.8), label: "Usage",
                        }, {
                            data: [
                                focus(9) / 20 * 100,
                                focus(8) / 20 * 100,
                                focus(7) / 20 * 100,
                                focus(6) / 20 * 100,
                                focus(5) / 20 * 100,
                                focus(4) / 20 * 100,
                                focus(3) / 20 * 100,
                                focus(2) / 20 * 100,
                                focus(1) / 20 * 100,
                                focus(0) / 20 * 100,
                            ], color: () => hexToRgbaG(theme[color].dddgrey, 0.8), label: "focus"
                        }, {
                            data: [
                                completed(9) * 100,
                                completed(8) * 100,
                                completed(7) * 100,
                                completed(6) * 100,
                                completed(5) * 100,
                                completed(4) * 100,
                                completed(3) * 100,
                                completed(2) * 100,
                                completed(1) * 100,
                                completed(0) * 100,
                            ], color: () => hexToRgbaB(theme[color].dddgrey, 0.8), label: "completed"
                        },]
                }}
                width={Dimensions.get("window").width} // from react-native
                height={190}
                withVerticalLines={false}
                withHorizontalLines={true}
                fromZero
                withHorizontalLabels={false}
                fromNumber={10}
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientToOpacity: 0,
                    fillShadowGradientFrom: theme[color].dddgrey,
                    fillShadowGradientFromOpacity: 0.2,
                    fillShadowGradientTo: theme[color].dddgrey,
                    fillShadowGradientToOpacity: 0,
                    decimalPlaces: 0, // optional, defaults to 2dp
                    color: (opacity = 1) => hexToRgba(theme[color].dddgrey, opacity),
                    labelColor: (opacity = 1) => hexToRgba(theme[color].dddgrey, opacity),
                    propsForLabels: { fontWeight: 'bold', fontSize: 15 },
                    style: {
                        borderRadius: 16
                    },
                    propsForDots: {
                        strokeOpacity: 0.3,
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
            <View style={{ margin: -8, flexDirection: 'row', justifyContent: 'center' }}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: hexToRgbaR(theme[color].dddgrey, 1) }]} />
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20 }} onPressIn={() => setShowEx1(true)} onPressOut={() => setShowEx1(false)}>
                        <Text style={styles.legendText}>Usage</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: hexToRgbaG(theme[color].dddgrey, 1) }]} />
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20 }} onPressIn={() => setShowEx2(true)} onPressOut={() => setShowEx2(false)}>
                        <Text style={styles.legendText}>Focus</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: hexToRgbaB(theme[color].dddgrey, 1) }]} />
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20 }} onPressIn={() => setShowEx3(true)} onPressOut={() => setShowEx3(false)}>
                        <Text style={styles.legendText}>Completed</Text>
                    </TouchableOpacity>
                </View>
            </View >
            {showEx1 ? <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, position: 'absolute', bottom: '20%', left: '5%', right: '5%', backgroundColor: theme[color].bg }}><Text style={{ textAlign: 'center' }}>Usage: focusToDo 앱에 출석한 누적 일수입니다.</Text></View> : null}
            {showEx2 ? <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, position: 'absolute', bottom: '20%', left: '5%', right: '5%', backgroundColor: theme[color].bg }}><Text style={{ textAlign: 'center' }}>Focus: 집중을 통해 달성한 To-Do 항목의 수입니다.</Text></View> : null}
            {showEx3 ? <View style={{ paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10, position: 'absolute', bottom: '20%', left: '5%', right: '5%', backgroundColor: theme[color].bg }}><Text style={{ textAlign: 'center' }}>Completed: 완료한 To-Do의 비율 통계입니다.</Text></View> : null}
        </View >
    )
};

