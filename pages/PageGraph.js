import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, Modal, Button, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePageLocation } from '../PageLocationContext'; // Context 훅 임포트
import GraphWeek from './GraphWeek'
import { useToDos } from '../ToDos';
import { TodayDate } from '../dateTranslator';
<<<<<<< HEAD
import { randomColor, color, theme } from '../color';

let themeColor = color();
=======
import { theme } from '../color';
import { useColor } from '../ColorContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> fix-date-errir

export default function PageGraph({ navigation }) {
    const { color, setColor } = useColor();
    const [modal1Visible, setModal1Visible] = useState(false);
    const [modal2Visible, setModal2Visible] = useState(false);
    const [showGraphWeek, setShowGraphWeek] = useState(true);
    const { toDos, setToDos } = useToDos();
    const [isPlaying, setIsPlaying] = useState(true);
    const achiveNumD = (dateMinusNum) => {
        const a = (Object.entries(toDos).filter(([key, value]) => value.date === TodayDate() - dateMinusNum).length === 0) ? 0 :
            Object.entries(toDos).filter(([key, value]) => value.progress === 2 && value.date === TodayDate() - dateMinusNum).length / Object.entries(toDos).filter(([key, value]) => value.date === TodayDate() - dateMinusNum).length
        return a;
    };
    const averageAchiveNumD = () => {
        const a = (i) => {
            if (achiveNumD(i) === 0) { return null } else { return achiveNumD(i) };
        };
        return ((a(1) + a(2) + a(3) + a(4) + a(5) + a(6) + a(7) + a(0)) / 8);
    }
    const changeColor = async (a) => {
        setColor(Object.keys(theme)[a]);
        await AsyncStorage.setItem("@color", Object.keys(theme)[a])
        return null;
    }
    const randomNum = () => Math.floor(Math.random() * 12) + 1;
    const loadState = async () => {
        const b = JSON.parse(await AsyncStorage.getItem("@isPlaying"))
        setIsPlaying(b !== undefined ? b : true)
    }
    useEffect(() => {
        loadState();
    }, [])


<<<<<<< HEAD
=======
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
            fontSize: 16,
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
        },
        modal1Text: {
            fontWeight: '600',
            margin: 4,
            fontSize: 14
        },

        modal2Text: {
            fontWeight: '600',
            margin: 4,
            fontSize: 14
        }
    })
>>>>>>> fix-date-errir

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
                    backgroundColor: theme[themeColor].dddgrey
                }}
            ></LottieView> : <View style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0, backgroundColor: theme[color].dddgrey
            }} />}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => setModal1Visible(true)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} ><AntDesign name="infocirlceo" size={24} color={theme[themeColor].bg} /></TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modal1Visible}
                    onRequestClose={() => setModal1Visible(false)}
                >
                    <BlurView intensity={10} style={styles.container} tint='systemThinMaterial'></BlurView>
                    <View style={styles.modal1View}>
                        <Text style={styles.modal1Text}>앱 이름: Focus Todo</Text>
                        <Text style={styles.modal1Text}>버전: 1.0.0</Text>
                        <Text style={styles.modal1Text}>개발자: DDoOviva</Text>
                        <Text style={styles.modal1Text}>연락처: abu135790@gmail.com</Text>
                        <Text style={styles.modal1Text}></Text>
                        <TouchableOpacity hitSlop={{ top: 40, bottom: 100, left: 40, right: 40 }} onPress={() => setModal1Visible(false)}>
                            <AntDesign name="closecircleo" size={24} color={theme[themeColor].dddgrey}></AntDesign>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <TouchableOpacity onLongPress={() => navigation.navigate('Home')}>
                    <View style={{ backgroundColor: theme[themeColor].bg, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ ...styles.date }} > 분석 & 통계 </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModal2Visible(true)} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}  ><AntDesign name="setting" size={24} color={theme[themeColor].bg} /></TouchableOpacity>
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={modal2Visible}
                    onRequestClose={() => setModal2Visible(false)}
                >

                    <BlurView intensity={10} style={styles.container} tint='systemThinMaterial'></BlurView>
                    <View style={styles.modal2View}>
<<<<<<< HEAD
                        <Text style={styles.modal2Text}> 업데이트를 기다려주세요 ...</Text>
                        <Text style={styles.modal2Text} onPress={() => { randomColor(); }}> (테마 변경 추가 예정)</Text>
                        <Text style={styles.modal2Text}> (애니메이션 토글 추가 예정)</Text>
                        <Text></Text>
                        <TouchableOpacity hitSlop={{ top: 40, bottom: 100, left: 40, right: 40 }} onPress={() => setModal2Visible(false)}>
                            <AntDesign name="closecircleo" size={24} color={theme[themeColor].dddgrey}></AntDesign>
=======
                        <Text style={{ ...styles.modal2Text, fontSize: 14 }}>Settings</Text>
                        <Text style={styles.modal2Text}>Theme</Text>
                        <Text style={styles.modal2Text} onPress={() => changeColor(randomNum())}> 테마 랜덤</Text>
                        <Text style={styles.modal2Text} onPress={async () => {
                            const a = !isPlaying;
                            setIsPlaying(a);
                            await AsyncStorage.setItem("@isPlaying", JSON.stringify(a));
                        }}>(애니메이션 토글 추가 예정)</Text>
                        <Text></Text>
                        <TouchableOpacity hitSlop={{ top: 10, bottom: 100, left: 40, right: 40 }} onPress={() => setModal2Visible(false)}>
                            <AntDesign name="closecircleo" size={24} color={theme[color].dddgrey}></AntDesign>
>>>>>>> fix-date-errir
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View >
            <View style={styles.cardContainer}>
                <ScrollView>
                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <Text style={styles.contentText1}>지난 7일간의 과제 달성률은 <Text style={styles.contentText2}>{(averageAchiveNumD()) ? (averageAchiveNumD() * 100).toFixed(2) : "-"}%</Text> 입니다.</Text>
                        {(averageAchiveNumD > 0.8) ? <Text style={styles.contentText1}> 대단해요 !</Text> : null}
                    </BlurView>
                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <View style={{
                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: '100 %', padding: 20, paddingVertical: -10

                        }}>
                            <TouchableOpacity onPress={() => { setShowGraphWeek(true) }}>
                                <View style={{ backgroundColor: theme[themeColor].dddgrey, opacity: (showGraphWeek ? 1 : 0.5), paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, marginRight: 6 }}>
                                    <Text style={{ fontSize: 16, color: theme[themeColor].bg, fontWeight: "bold" }}>Week</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowGraphWeek(false)}>
                                <View style={{ backgroundColor: theme[themeColor].dddgrey, opacity: (!showGraphWeek ? 1 : 0.5), paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                                    <Text style={{ fontSize: 16, color: theme[themeColor].bg, fontWeight: "bold" }}>Month</Text>
                                </View>
                            </TouchableOpacity></View>
                        {showGraphWeek ? <GraphWeek /> : <View style={{ height: 190, justifyContent: 'center', flex: 1 }}><Text style={styles.contentText1}>업데이트를 기다려주세요 ...</Text></View>}
                    </BlurView>

                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>
                        <Text style={styles.contentText1}>업데이트를 기다려주세요 ...</Text>
                        {/*  <Text style={styles.contentText1}>연속 작업 일 수는 <Text style={styles.contentText2}>188</Text>일 입니다. </Text> */}
                    </BlurView>
                    <BlurView intensity={isPlaying ? 40 : 60} style={styles.card} tint={isPlaying ? 'systemThinMaterial' : 'extraLight'}>

                        <Text style={styles.contentText1}></Text>
                        <Text style={styles.contentText1}>업데이트를 기다려주세요 ...</Text>
                        <Text style={styles.contentText1}></Text>

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
<<<<<<< HEAD
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
        color: theme[themeColor].dddgrey,
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
        color: theme[themeColor].bg,
        fontWeight: 600,
        fontSize: 16,
        margin: 3,
    },
    contentText2: {
        fontWeight: "bold", textShadowColor: theme[themeColor].bg, // 테두리 색상
        textShadowOffset: { width: 0.5, height: 0.5 }, // 테두리 두께
        textShadowRadius: 1, color: theme[themeColor].dddgrey,
        fontSize: 18
    },
    modal1View: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme[themeColor].bg,
        position: 'absolute',
        padding: 20,
        top: 50,
        left: 40,
    },
    modal2View: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: theme[themeColor].bg,
        position: 'absolute',
        padding: 20,
        top: 50,
        right: 40,
    },
    modal1Text: {
        fontWeight: '600',
        margin: 4,
        fontSize: 14
    },

    modal2Text: {
        fontWeight: '600',
        margin: 4,
        fontSize: 14
    }
})
=======
>>>>>>> fix-date-errir
