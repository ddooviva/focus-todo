import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, Modal, Button, TextInput, TouchableOpacity, View, Dimensions, TouchableNativeFeedback, TouchableWithoutFeedback } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePageLocation } from '../PageLocationContext'; // Context 훅 임포트
import GraphDay from './GraphDay'
import { useToDos } from '../ToDos';
import { RealDate, HeaderDate } from '../dateTranslator';
import { theme } from '../color';
import { useColor } from '../ColorContext'
import { usePlay } from '../PlayContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeekGreeting from './WeekGreeting'
import { calculateAndSaveWeeklyStats, getWeekStats, getLatestStats, autoGenerateStats } from '../stat';
import GraphMonth from './GraphMonth';
import GraphWeek from './GraphWeek';

export default function PageGraph({ navigation }) {
    const { color, setColor } = useColor();

    const [modal1Visible, setModal1Visible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [showGraphWeek, setShowGraphWeek] = useState(false);
    const [showGraphMonth, setShowGraphMonth] = useState(false);
    const [showGraphDay, setShowGraphDay] = useState(true);
    const [stat, setStat] = useState({});
    const [streak, setStreak] = useState(null);

    const { toDos, setToDos } = useToDos();
    const { isPlaying, setIsPlaying } = usePlay();

    useEffect(() => {
        loadState();
    }, [])
    useEffect(() => {
        const loadStats = async () => {
            try {
                const statData = await AsyncStorage.getItem("@stat");
                const parsedStat = JSON.parse(statData);
                setStat(parsedStat);
                console.log('loadstat')
            } catch (error) {
                console.error("통계 로딩 에러:", error);
            }
        };
        loadStats();
    }, []);
    useEffect(() => {
        const fetchStreak = async () => {
            const result = await getStreakFromStorage();
            setStreak(result);
        };
        fetchStreak();
    }, []);
    const achiveNumD = (dateMinusNum) => {
        const a = (Object.entries(toDos).filter(([key, value]) => value.date === HeaderDate(-dateMinusNum, false)).length === 0) ? 0 :
            Object.entries(toDos).filter(([key, value]) => value.progress === 2 && value.date === HeaderDate(-dateMinusNum, false)).length / Object.entries(toDos).filter(([key, value]) => value.date === HeaderDate(-dateMinusNum, false)).length
        return a;
    };
    const averageAchiveNumD = () => {
        const a = (i) => {
            if (achiveNumD(i) === 0) { return null } else { return achiveNumD(i) };
        };
        return ((a(1) + a(2) + a(3) + a(4) + a(5) + a(6) + a(7)) / 7);
        return ((achiveNumD(7) + achiveNumD(6) + achiveNumD(5) + achiveNumD(4) + achiveNumD(3) + achiveNumD(2) + achiveNumD(1)) / 7).toFixed(3)
    }
    const changeColor = async (a) => {
        setColor(Object.keys(theme)[a]);
        await AsyncStorage.setItem("@color", Object.keys(theme)[a])
        return null;
    }
    const randomNum = () => Math.floor(Math.random() * 13);
    const loadState = async () => {
        const b = JSON.parse(await AsyncStorage.getItem("@isPlaying"))
        setIsPlaying(b !== undefined ? b : true)
    }

    const getStreakFromStorage = async () => {
        const json = await AsyncStorage.getItem('workedDates');
        const workedDates = json ? JSON.parse(json) : [];

        const dateSet = new Set(workedDates); // 빠른 검색을 위해 Set 사용
        let streak = 0;

        let current = new Date();
        current.setHours(0, 0, 0, 0); // 시간 제거 (날짜만 비교)

        while (true) {
            const dateStr = current.toISOString().split('T')[0];

            if (dateSet.has(dateStr)) {
                streak++;
                current.setDate(current.getDate() - 1); // 하루 전으로
            } else {
                break; // 연속이 끊기면 종료
            }
        }

        return streak;
    };


    const changeGoal = () => { };
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        header: {
            width: "100%",
            flex: 3,
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 30,
            paddingTop: 20,
            marginBottom: -10
        },
        cardContainer: {
            flex: 22,
            height: '100%',
            paddingTop: 10
        },
        date: {
            fontSize: 20,
            fontWeight: 600,
            color: theme[color].dddgrey,
        },
        card: {
            flex: 1,
            paddingVertical: 16,
            marginHorizontal: 16,
            marginVertical: 10,
            textAlign: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 20,
            alignItems: 'center'
        },
        contentText1: {
            textAlign: 'center',
            color: theme[color].bg,
            fontWeight: 600,
            fontSize: 18,
            margin: 3,
        },
        contentText2: {
            fontWeight: "bold", textShadowColor: theme[color].bg, // 테두리 색상
            textShadowOffset: { width: 0.5, height: 0.5 }, // 테두리 두께
            textShadowRadius: 1, color: theme[color].dddgrey,
            fontSize: 18
        },
        modal1View: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: theme[color].bg,
            position: 'absolute',
            padding: 20,
            top: 50,
            left: 40,
        },
        modal2View: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 20,
            backgroundColor: theme[color].bg,
            position: 'absolute',
            padding: 20,
            top: 50,
            right: 40,
            width: '60%'
        },
        modal1Text: {
            margin: 4,
            fontSize: 16, fontWeight: "bold",
            color: theme[color].bg,
            backgroundColor: theme[color].dddgrey,
            paddingHorizontal: 10,
            paddingVertical: 5,

            borderRadius: 10

        },

        modal2Text: {
            fontWeight: '600',
            margin: 4,
            fontSize: 16,
            color: theme[color].dddgrey,
            textAlign: 'center',
            textAlignVertical: 'bottom',
            alignContent: 'center',
        },
        modal3Text: {
            fontWeight: '600',
            margin: 4,
            fontSize: 5,
            color: theme[color].dddgrey,
            textAlign: 'center',
            textAlignVertical: 'bottom',
            alignContent: 'center',
        }
    })
    const totalFocus = Object.values(stat).reduce((sum, item) => sum + (item.focus || 0), 0);
    console.log(totalFocus)
    const a = "dd"

    return (
        <View style={styles.container}>
            {isPlaying ? <LottieView
                key={Date.now()}// key는 LottieView에 직접 추가
                autoPlay={true}
                loop
                source={require('../assets/graphbg.json')}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: -5,
                    width: '180%',
                    height: '110%',
                    backgroundColor: theme[color].ddgrey
                }}
            ></LottieView> : <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0, backgroundColor: theme[color].ddgrey
            }} />}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModal1Visible(true)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} ><AntDesign name="infocirlceo" size={24} color={theme[color].bg} /></TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modal1Visible}
                    onRequestClose={() => setModal1Visible(false)}
                >
                    <TouchableNativeFeedback onPress={() => setModal1Visible(false)}>

                        <BlurView intensity={10} style={styles.container} tint='systemThinMaterial'><View style={styles.modal1View}>
                            <AntDesign name="infocirlce" size={30} color={theme[color].dddgrey} />
                            <Text style={styles.modal3Text}></Text>
                            <Text style={styles.modal3Text}></Text>
                            <Text style={styles.modal2Text}>앱 이름: Focus Todo</Text>
                            <Text style={styles.modal2Text}>버전: 1.0.0</Text>
                            <Text style={styles.modal2Text}>개발자: DDoOviva</Text>
                            <Text style={styles.modal2Text}>연락처: abu135790@gmail.com</Text>
                            <Text style={styles.modal3Text}></Text>

                        </View></BlurView>
                    </TouchableNativeFeedback>
                </Modal>
                <TouchableOpacity onLongPress={() => { navigation.navigate('Home'); setIsPlaying(isPlaying) }}>
                    <View style={{ backgroundColor: theme[color].bg, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ ...styles.date }} > 분석 & 통계 </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal2Visible(true)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}  ><Ionicons name="settings-outline" size={24} color={theme[color].bg} /></TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modal2Visible}
                    onRequestClose={() => setModal2Visible(false)}
                >
                    <TouchableNativeFeedback onPress={() => setModal2Visible(false)}>

                        <BlurView intensity={10} style={styles.container} tint='systemThinMaterial'>
                            <View style={styles.modal2View}>

                                <Ionicons name="settings" size={30} color={theme[color].dddgrey} />
                                <Text style={styles.modal3Text}></Text>

                                <Text style={styles.modal3Text}></Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.modal2Text}>Theme Color :</Text>
                                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => changeColor(randomNum())}>
                                        <Text style={{ ...styles.modal1Text }} >{color.toUpperCase()}</Text>
                                    </TouchableOpacity></View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.modal2Text}>Animation Toggle :</Text>
                                    <Text style={styles.modal1Text} onPress={async () => {
                                        const a = !isPlaying;
                                        setIsPlaying(a);
                                        await AsyncStorage.setItem("@isPlaying", JSON.stringify(a));
                                    }}>{isPlaying ? "ON" : "OFF"}</Text></View>
                                <Text style={styles.modal3Text}></Text>

                            </View></BlurView>
                    </TouchableNativeFeedback>


                </Modal>
            </View >
            <View style={styles.cardContainer}>
                <ScrollView>
                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <Text style={styles.contentText1}>지난 7일간의 과제 달성률은 <Text style={styles.contentText2}>{(averageAchiveNumD()) ? (averageAchiveNumD() * 100).toFixed(2) : "-"}%</Text> 입니다.</Text>
                        {(averageAchiveNumD > 0.8) ? <Text style={styles.contentText1}> 대단해요 !</Text> : null}
                    </BlurView>
                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <View style={{ marginRight: 100 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <View style={{ backgroundColor: theme[color].dddgrey, opacity: (showGraphDay ? 1 : 0.5), paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, marginRight: 6 }}>
                                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, right: 5, left: 5 }} onPress={() => { setShowGraphDay(true); setShowGraphWeek(false); setShowGraphMonth(false) }}>
                                        <Text style={{ fontSize: 16, color: theme[color].bg, fontWeight: "bold" }}>Day</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ backgroundColor: theme[color].dddgrey, opacity: (showGraphWeek ? 1 : 0.5), paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, marginRight: 6 }}>
                                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, right: 5, left: 5 }} onPress={() => { setShowGraphDay(false); setShowGraphWeek(true); setShowGraphMonth(false) }}>
                                        <Text style={{ fontSize: 16, color: theme[color].bg, fontWeight: "bold" }}>Week</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ backgroundColor: theme[color].dddgrey, opacity: (showGraphMonth ? 1 : 0.5), paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, right: 5, left: 5 }} onPress={() => { setShowGraphDay(false); setShowGraphWeek(false); setShowGraphMonth(true) }}>
                                        <Text style={{ fontSize: 16, color: theme[color].bg, fontWeight: "bold" }}>Month</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {showGraphDay ? <GraphDay /> : showGraphWeek ? <View style={{ height: 190, justifyContent: 'center' }}><GraphWeek stat={stat} /></View> : <View style={{ height: 190, justifyContent: 'center' }}><GraphMonth stat={stat} /></View>}
                    </BlurView>

                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <Text style={styles.contentText1}><Text style={styles.contentText2}> Focus 하여 해낸</Text> ToDo는 </Text>
                        <Text style={styles.contentText1}>지금까지 총 <Text style={styles.contentText2}>{totalFocus}개</Text>입니다.</Text>
                        {/*  <Text style={styles.contentText1}>연속 작업 일 수는 <Text style={styles.contentText2}>188</Text>일 입니다. </Text> */}
                    </BlurView>
                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <Text style={styles.contentText1}>현재 연속 <Text style={styles.contentText2}>{streak + 1}</Text>일째 작업중입니다.</Text>
                        {(streak > 29 ? <Text style={styles.contentText1}>잘 하고 있어요!</Text> : null)}

                        {/* <Text style={styles.contentText1}>사용 초반에 비해 실행력이 <Text style={styles.contentText2}>40%</Text> 늘어났습니다.</Text>
                        <Text style={styles.contentText1} onPress={() => changeGoal()}>초기 목표에 도달했습니다. 완벽합니다. </Text>
 */}
                    </BlurView>
                </ScrollView>
            </View>
            <StatusBar style='light'></StatusBar>
        </View >

    )

}
