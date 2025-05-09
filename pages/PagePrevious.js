import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { usePageLocation } from '../PageLocationContext'; // Context 훅 임포트
import { useToDos } from '../ToDos';
import { RealDate, TodayDate } from '../dateTranslator';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics'
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing, } from 'react-native-reanimated';
import { theme } from '../color';
import { useColor } from '../ColorContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const window = {
    width: Dimensions.get('window').width, height: Dimensions.get('window').height
}
const themeColor = color();


export default function PagePrevious({ }) {
    const navigation = useNavigation(); // navigation 객체에 접근할 수 있어
    const { color, setColor } = useColor();
    const { pageLocation, setPageLocation } = usePageLocation();
    const { toDos, setToDos } = useToDos();
    const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 관리
    const [isPlaying, setIsPlaying] = useState(true);

    useEffect(() => { loadState(); }, []);

    useEffect(() => {
        animatedWaveValue.value = (-950 * achieveNum) / 667 * window.height;
        animatedBoxValue.value = (-470 * achieveNum) / 667 * window.height;
    }, [achieveNum, pageLocation]);

    async function loadState() {
        const b = JSON.parse(await AsyncStorage.getItem("@isPlaying"))
        setIsPlaying(b !== undefined ? b : true)
    }
    const sorting = (a) => {
        const entries = Object.entries(a);

        // 2. 배열을 정렬
        const sortedEntries = entries.sort(([, a], [, b]) => {
            const aStarNotProgress2 = a.star && a.progress !== 2; // a가 star이면서 progress가 2가 아닌 경우
            const bStarNotProgress2 = b.star && b.progress !== 2; // b가 star이면서 progress가 2가 아닌 경우
            const aStarFalse = !a.star; // a가 star가 아닌 경우
            const bStarFalse = !b.star; // b가 star가 아닌 경우
            const aStarAndProgress2 = a.star && a.progress === 2; // a가 star이면서 progress가 2인 경우
            const bStarAndProgress2 = b.star && b.progress === 2; // b가 star이면서 progress가 2인 경우
            const aProgress2 = a.progress === 2 && !a.star; // a가 star가 아니고 progress가 2인 경우
            const bProgress2 = b.progress === 2 && !b.star; // b가 star가 아니고 progress가 2인 경우

            // 정렬 조건
            if (aStarNotProgress2 && !bStarNotProgress2) return -1; // a가 위로
            if (!aStarNotProgress2 && bStarNotProgress2) return 1; // b가 위로

            if (aStarFalse && bStarFalse) {
                if (aProgress2 && !bProgress2) return 1; // a가 progress 2면 b보다 아래로
                if (!aProgress2 && bProgress2) return -1;
                return 0; // b가 위로
            }

            if (aStarAndProgress2 && !bStarAndProgress2) return 1; // a가 아래로
            if (!aStarAndProgress2 && bStarAndProgress2) return -1; // b가 아래로

            return 0; // 둘 다 같으면 순서 유지
        });

        // 3. 정렬된 배열을 다시 객체로 변환
        const sortedToDos = Object.fromEntries(sortedEntries);
        return sortedToDos;
    }

    const animatedWaveValue = useSharedValue((-950 * achieveNum) / 667 * window.height);
    const animatedBoxValue = useSharedValue((-470 * achieveNum) / 667 * window.height);

    // 애니메이션 스타일 정의
    const animatedStyleWave = useAnimatedStyle(() => {
        return {
            flex: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: animatedWaveValue.value
        };
    });

    const animatedStyleBox = useAnimatedStyle(() => {
        return {
            flex: 1,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            top: animatedBoxValue.value
        };
    });

    const previousToDo = Object.fromEntries(Object.entries(toDos).filter(([key, value]) => value.date === TodayDate() + pageLocation));
    const achieveNum = Object.entries(previousToDo).filter(([key, value]) => value.progress === 2).length / Object.entries(previousToDo).length;

    const dateHeader = () => {
        const n = String(RealDate(Date.now() + 86400000 * pageLocation));
        const date = new Date(parseInt(n.slice(0, 4), 10), parseInt(n.slice(4, 6), 10) - 1, parseInt(n.slice(6, 8), 10))
        const dayOfWeek = date.getDay();
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return n.slice(0, 4) + "." + n.slice(4, 6) + "." + n.slice(6, 8) + " (" + days[dayOfWeek] + ")"
    };
    const onSwipe = (event) => {
        if (event.nativeEvent.translationX > 50 && pageLocation > -7) {
            // 오른쪽으로 스와이프
            const countMinus = (a) => a - 1;
            setTimeout(() => {
                setPageLocation(countMinus(pageLocation));
            }, 100);
        } else if (event.nativeEvent.translationX < -50) {
            const countPlus = (a) => a + 1;
            setTimeout(() => {
                setPageLocation(countPlus(pageLocation));
            }, 100);
        }
    };
    const goHome = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPageLocation(0); }
    const animationPaths = {
        black: require('../assets/nofound/black.json'),
        lavender: require('../assets/nofound/lavender.json'),
        blue: require('../assets/nofound/blue.json'),
        green: require('../assets/nofound/green.json'),
        peach: require('../assets/nofound/peach.json'),
        cherry: require('../assets/nofound/cherry.json'),
        pink: require('../assets/nofound/pink.json'),
        beige: require('../assets/nofound/beige.json'),
        darkblue: require('../assets/nofound/darkblue.json'),
        darkgreen: require('../assets/nofound/darkgreen.json'),
        natural: require('../assets/nofound/natural.json'),
        grape: require('../assets/nofound/grape.json'),
        yellow: require('../assets/nofound/yellow.json'),
        default: require('../assets/nofound/blue.json'),

    };
    const animationData = animationPaths[themeColor];

    const animationPaths1 = {
        black: require('../assets/wave/black.json'),
        lavender: require('../assets/wave/lavender.json'),
        blue: require('../assets/wave/blue.json'),
        green: require('../assets/wave/green.json'),
        peach: require('../assets/wave/peach.json'),
        cherry: require('../assets/wave/cherry.json'),
        pink: require('../assets/wave/pink.json'),
        beige: require('../assets/wave/beige.json'),
        darkblue: require('../assets/wave/darkblue.json'),
        darkgreen: require('../assets/wave/darkgreen.json'),
        natural: require('../assets/wave/natural.json'),
        grape: require('../assets/wave/grape.json'),
        yellow: require('../assets/wave/yellow.json'),
        default: require('../assets/wave/blue.json'),

    };
<<<<<<< HEAD
    const animationData1 = animationPaths1[themeColor];
=======
    const animationData1 = animationPaths1[color];

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme[color].bg,
        },
        header: {
            width: "100%",
            flex: 3,
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 30,
            paddingTop: 20,
        },
        date: {
            fontSize: 20,
            fontWeight: 600,
            color: theme[color].dddgrey
        },
        listContainer: {
            flex: 22,
            height: '100%',
            paddingVertical: 10
        },
        list: {
            flexDirection: "row",
            paddingVertical: 12,
            paddingHorizontal: 20,
            marginHorizontal: 30,
            margin: 5,
            borderRadius: 20,
            alignItems: "center",
        },
        listText: {
            fontWeight: 500,
            fontSize: 16,
            paddingVertical: 6,
            width: '90%', height: '100%', textAlignVertical: 'bottom',
            color: theme[color].dddgrey
        },
        blurContainer: {
            overflow: 'hidden',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: 400,
            height: 1000,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
        }, nodataText: {
            color: theme[color].llgrey,
            fontSize: 60,
            fontWeight: 700,
            paddingTop: 60
        }
    });
    const moveToDo = async (key) => {
        if (toDos[key].progress !== 3) {
            const newToDos = { ...toDos, [Number(Date.now())]: { text: toDos[key].text, progress: toDos[key].progress, edit: false, star: toDos[key].star, date: RealDate(Date.now()) } }
            setToDos(sorting(newToDos));
            toDos[key].progress = 3;
            await saveToDos((sorting(newToDos)));
        } else return null;
    }
    async function saveToDos(toSave) {
        await AsyncStorage.setItem("@toDos", JSON.stringify(toSave));
    }
>>>>>>> fix-date-errir
    return (
        <GestureHandlerRootView>
            <PanGestureHandler onGestureEvent={onSwipe} >
                <View style={{ ...styles.container }}>
                    {isPlaying ? <View style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                    }}>
                        {Object.keys(previousToDo).length === 0 ?
                            <View /> :
                            <Animated.View style={{ ...animatedStyleWave, flex: 1 }} >
                                <LottieView
                                    key={Date.now()}
                                    speed={0.2}
                                    PageLocationProvider
                                    autoPlay
                                    source={animationData1}
                                    style={{
                                        position: 'absolute',
                                        top: 270 / 667 * window.height,
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        zIndex: -5,
                                        width: '140%',
                                        height: '98%',
                                        backgroundColor: theme.bg,
                                    }}
                                ></LottieView>
                            </Animated.View>}

                        {Object.keys(previousToDo).length === 0 ?
                            <View /> :
                            <Animated.View style={{ ...animatedStyleBox, flex: 1 }}>
<<<<<<< HEAD
    <View style={{ flexDirection: "column", backgroundColor: (themeColor === "black" ? "black" : theme[themeColor].ddgrey), position: 'absolute', bottom: 0, top: 650 / 667 * window.height, width: '100%', height: '100%', zIndex: -5 }} />
                            </Animated.View >}
                    <View style={{ flexDirection: "column", justifyContent: "flex-end", backgroundColor: (themeColor === "black" ? "black" : theme[themeColor].ddgrey), position: 'absolute', bottom: 0, width: '100%', height: 500 / 667 * window.height * achieveNum, zIndex: -1 }} />
=======
                                <View style={{ flexDirection: "column", opacity: 1, backgroundColor: (color === "black" ? "black" : theme[color].ddgrey), position: 'absolute', bottom: 0, top: 650 / 667 * window.height, width: '100%', height: '100%', zIndex: -6 }} />
                            </Animated.View>}
                    </View> : <View />}
>>>>>>> fix-date-errir

                    <View style={{ ...styles.header, backgroundColor: theme[themeColor].bg }}>
                        {pageLocation !== -7 ? <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretleft" size={24} color={theme[themeColor].ddgrey}></AntDesign></TouchableOpacity> : <TouchableOpacity><AntDesign name="caretleft" size={24} color={theme[themeColor].llgrey}></AntDesign></TouchableOpacity>}
                        <TouchableOpacity onPress={() => goHome()}>
                            <View style={{ borderRadius: 10, borderWidth: 2, borderColor: theme[themeColor].dddgrey, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 }}>

                                <Text style={styles.date} >{dateHeader()}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }}><AntDesign name="caretright" size={24} color={theme[themeColor].ddgrey}></AntDesign></TouchableOpacity>
                    </View>
{
    Object.keys(previousToDo).length === 0 ?
        <View style={{ ...styles.listContainer, alignItems: 'center' }}>
            <Text style={styles.nodataText}></Text>
            <LottieView
                key={Date.now()}// key는 LottieView에 직접 추가
                PageLocationProvider
                autoPlay
                source={animationData}
                style={{
                    top: '-35%',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center', zIndex: -5
                }}
            ></LottieView>
        </View>
        :
        <View style={{ ...styles.listContainer }}>

            <ScrollView>
                {Object.keys(previousToDo).map((key) => {
                    return (
                        <View key={key} style={{
                            ...styles.list, backgroundColor: (previousToDo[key].star && previousToDo[key].progress !== 2 ? theme[themeColor].llgrey : previousToDo[key].progress === 2 ? theme[themeColor].dgrey : theme[themeColor].llgrey), borderWidth: 2, borderColor: (previousToDo[key].progress === 2 ? theme[themeColor].dgrey : previousToDo[key].star && previousToDo[key].progress !== 2 ? theme[themeColor].ddgrey : theme[themeColor].llgrey)
                        }}>
<<<<<<< HEAD
                                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                                    <MaterialCommunityIcons style={{ paddingRight: 10 }} name={previousToDo[key].progress === 0 ? "checkbox-blank-outline" : (previousToDo[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color={theme[themeColor].dddgrey}></MaterialCommunityIcons></TouchableOpacity>
                                                <Text style={{ ...styles.listText, textDecorationLine: (previousToDo[key].progress === 2 ? "line-through" : "none") }}>{previousToDo[key].text}</Text>
=======
                                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                    onPress={() => moveToDo(key)}>
                                                    {previousToDo[key].progress === 2 ? <MaterialCommunityIcons style={{ paddingRight: 15 }} name={"checkbox-marked"} size={25} color={theme[color].dddgrey}></MaterialCommunityIcons>
                                                        : previousToDo[key].progress === 3 ? <MaterialCommunityIcons style={{ paddingRight: 15 }} name="checkbox-blank" size={25} color={theme[color].dddgrey} /> : <MaterialCommunityIcons style={{ paddingRight: 10 }} name="arrow-right-bold-outline" size={25} color={theme[color].dddgrey} />}
                                                </TouchableOpacity>
                                                <Text style={{ ...styles.listText, textDecorationLine: (previousToDo[key].progress > 1 ? "line-through" : "none") }}>{previousToDo[key].text}</Text>
>>>>>>> fix-date-errir
                                            </View >)
})
                                    }
                                </ScrollView >
                            </View >
                    }
<StatusBar style="dark"></StatusBar>
                </View >
            </PanGestureHandler >
        </GestureHandlerRootView >
    )
};


<<<<<<< HEAD
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme[themeColor].bg,
    },
    header: {
        width: "100%",
        flex: 3,
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 20,
    },
    date: {
        fontSize: 20,
        fontWeight: 600,
        color: theme[themeColor].dddgrey
    },
    listContainer: {
        flex: 22,
        height: '100%',
        paddingVertical: 10
    },
    list: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 30,
        margin: 5,
        borderRadius: 20,
        alignItems: "center",
    },
    listText: {
        fontWeight: 500,
        fontSize: 16,
        paddingVertical: 6,
        width: '90%', height: '100%', textAlignVertical: 'bottom',
        color: theme[themeColor].dddgrey
    },
    blurContainer: {
        overflow: 'hidden',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: 400,
        height: 1000,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1
    }, nodataText: {
        color: theme[themeColor].llgrey,
        fontSize: 60,
        fontWeight: 700,
        paddingTop: 60
    }
});

=======
>>>>>>> fix-date-errir
