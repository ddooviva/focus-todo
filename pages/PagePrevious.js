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
import { color, theme } from '../color';

const window = {
    width: Dimensions.get('window').width, height: Dimensions.get('window').height
}


export default function PagePrevious({ }) {
    const navigation = useNavigation(); // navigation 객체에 접근할 수 있어

    const { pageLocation, setPageLocation } = usePageLocation();
    const { toDos, setToDos } = useToDos();
    const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 관리

    useEffect(() => {
        animatedWaveValue.value = (-950 * achieveNum) / 667 * window.height;
    }, [achieveNum, pageLocation]);

    useEffect(() => {
        animatedBoxValue.value = (-470 * achieveNum) / 667 * window.height;
    }, [achieveNum, pageLocation]);

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

    const dateNum = () => {
        const n = String(TodayDate() + pageLocation);
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
    const animationData = animationPaths[color];

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
    const animationData1 = animationPaths1[color];
    return (
        <GestureHandlerRootView>
            <PanGestureHandler onGestureEvent={onSwipe} >
                <View style={{ ...styles.container }}>
                    {
                        Object.keys(previousToDo).length === 0 ?
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
                    {
                        Object.keys(previousToDo).length === 0 ?
                            <View /> :
                            <Animated.View style={{ ...animatedStyleBox, flex: 1 }}>
                                <View style={{ flexDirection: "column", backgroundColor: (color === "black" ? "black" : theme[color].ddgrey), position: 'absolute', bottom: 0, top: 650 / 667 * window.height, width: '100%', height: '100%', zIndex: -5 }} />
                            </Animated.View>}
                    <View style={{ flexDirection: "column", justifyContent: "flex-end", backgroundColor: (color === "black" ? "black" : theme[color].ddgrey), position: 'absolute', bottom: 0, width: '100%', height: 500 / 667 * window.height * achieveNum, zIndex: -1 }} />

                    <View style={{ ...styles.header, backgroundColor: theme[color].bg }}>
                        {pageLocation !== -7 ? <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretleft" size={24} color={theme[color].ddgrey}></AntDesign></TouchableOpacity> : <TouchableOpacity><AntDesign name="caretleft" size={24} color={theme[color].llgrey}></AntDesign></TouchableOpacity>}
                        <TouchableOpacity onPress={() => goHome()}>
                            <View style={{ borderRadius: 10, borderWidth: 2, borderColor: theme[color].dddgrey, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 }}>

                                <Text style={styles.date} >{dateNum()}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }}><AntDesign name="caretright" size={24} color={theme[color].ddgrey}></AntDesign></TouchableOpacity>
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
                                                ...styles.list, backgroundColor: (previousToDo[key].star && previousToDo[key].progress !== 2 ? theme[color].llgrey : previousToDo[key].progress === 2 ? theme[color].dgrey : theme[color].llgrey), borderWidth: 2, borderColor: (previousToDo[key].progress === 2 ? theme[color].dgrey : previousToDo[key].star && previousToDo[key].progress !== 2 ? theme[color].ddgrey : theme[color].llgrey)
                                            }}>
                                                <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                                    <MaterialCommunityIcons style={{ paddingRight: 10 }} name={previousToDo[key].progress === 0 ? "checkbox-blank-outline" : (previousToDo[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color={theme[color].dddgrey}></MaterialCommunityIcons></TouchableOpacity>
                                                <Text style={{ ...styles.listText, textDecorationLine: (previousToDo[key].progress === 2 ? "line-through" : "none") }}>{previousToDo[key].text}</Text>
                                            </View>)
                                    })
                                    }
                                </ScrollView>
                            </View>
                    }
                    <StatusBar style="dark"></StatusBar>
                </View >
            </PanGestureHandler>
        </GestureHandlerRootView >
    )
};


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

