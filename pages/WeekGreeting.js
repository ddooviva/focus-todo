import { useRef, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, Modal, Button, TextInput, TouchableOpacity, View, Dimensions, TouchableNativeFeedback } from 'react-native';
import { theme } from '../color'
import { calculateAndSaveWeeklyStats, getWeekStats, formatDate, getLastTwoWeeksStats } from '../stat'
import { useColor } from '../ColorContext';
import * as Haptics from 'expo-haptics';
import LottieView from 'lottie-react-native';
import { BlurView } from 'expo-blur';

// TrendArrow 컴포넌트 수정
const TrendArrow = ({ current, previous }) => {
    if (!previous || previous === 0) return null;  // ⭐ previous가 없으면 아무것도 표시하지 않음
    const percentChange = ((current - previous) / previous) * 100;

    if (percentChange > 0) {
        return <Text style={{ color: '#2ecc71', fontSize: 25, fontWeight: 'bold' }}>↑</Text>;
    } else if (percentChange < 0) {
        return <Text style={{ color: '#e74c3c', fontSize: 20 }}>↓</Text>;
    }
    return <Text style={{ color: '#95a5a6', fontSize: 20 }}>−</Text>;
};

// 변화량을 계산하는 함수
const calculateChange = (current, previous) => {
    if (!previous || previous === 0) return null;  // previous가 0일 때 처리

    const percentChange = ((current - previous) / previous) * 100;
    return percentChange > 0 ? `(지지난주 대비 +${percentChange.toFixed(1)}%)` : `(지지난주 대비 ${percentChange.toFixed(1)}%)`;
};

function WeekGreeting({ visible, onClose, stats, previousStats }) {
    const { color, setColor } = useColor();
    const [isClicked, setIsClicked] = useState(false);
    const [showAnimation, setShowAnimation] = useState(false);
    const click = () => {
        setShowAnimation(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsClicked(true), console.log("click")
        setTimeout(() => {
            if ((stats.focus > 15 && stats.usage > 5 && stats.completed > 0.6) || (stats.focus > previousStats.focus && stats.usage > previousStats.usage && stats.completed > previousStats.completed)) {
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                    }, i * 300);  // 0.3초 간격으로 진동
                };
            }
        }, 1000)
        setTimeout(() => setShowAnimation(false), 2500);
    }
    const calculateAchieve = () => {
        const a = stats.completed - previousStats.completed
        if (a >= 0) {
            return `+${(a * 100).toFixed(1)}%`
        } else { return `${(a * 100).toFixed(1)}%` };
    }
    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme[color].llgrey,
        },
        modalView: {
            width: '80%',
            minHeight: '20%',
            backgroundColor: theme[color].bg,
            borderRadius: 20,
            borderColor: theme[color].dgrey,
            padding: 20,
            alignItems: 'center',
            elevation: 5,
            justifyContent: 'center'

        },
        header: {
            width: '100%',
            alignItems: 'center',
            marginBottom: 20,
        },
        title: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme[color].dddgrey
        },
        content: {
            width: '100%',
            marginBottom: 20,
            justifyContent: 'center',
            alignItems: 'center'
        },
        dateText: {
            textAlign: 'center',
            marginBottom: 15,
            color: theme[color].ddgrey,
        },
        statsRow: {
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme[color].llgrey,

        },
        label: {
            fontSize: 16,
            fontWeight: '600',
            color: theme[color].dddgrey,
        },
        value: {
            fontSize: 16,
            fontWeight: 'bold', color: theme[color].dddgrey,

        },
        button: {
            borderWidth: 1,
            borderColor: theme[color].dgrey,
            paddingVertical: 10,
            paddingHorizontal: 15,
            margin: 5,
            borderRadius: 10,
        },
        buttonText: {
            color: theme[color].dddgrey,
            fontSize: 16,
            fontWeight: '600',
        }, changeText: {
            fontSize: 12,
            marginLeft: 8,
            color: theme[color].dddgrey
        }
    });

    if (!stats) return null;
    const animationPaths1 = {
        black: require('../assets/thumbsup/black.json'),
        lavender: require('../assets/thumbsup/lavender.json'),
        blue: require('../assets/thumbsup/blue.json'),
        green: require('../assets/thumbsup/green.json'),
        peach: require('../assets/thumbsup/peach.json'),
        cherry: require('../assets/thumbsup/cherry.json'),
        pink: require('../assets/thumbsup/pink.json'),
        beige: require('../assets/thumbsup/beige.json'),
        darkblue: require('../assets/thumbsup/darkblue.json'),
        darkgreen: require('../assets/thumbsup/darkgreen.json'),
        natural: require('../assets/thumbsup/natural.json'),
        grape: require('../assets/thumbsup/grape.json'),
        yellow: require('../assets/thumbsup/yellow.json'),
        default: require('../assets/thumbsup/black.json'),
    };
    const animationData1 = animationPaths1[color];
    return (
        <Modal animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >

            <View style={styles.centeredView}>
                {isClicked ?
                    <View style={styles.modalView}>
                        {showAnimation && ((stats.focus > 15 && stats.usage > 5 && stats.completed > 0.6) || (stats.focus > previousStats.focus && stats.usage > previousStats.usage && stats.completed > previousStats.completed)) ?
                            <BlurView
                                intensity={10}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    zIndex: 2,
                                    position: 'absolute'
                                }}>
                                <LottieView
                                    autoPlay={true}
                                    loop={false}
                                    style={{
                                        top: '-25%',
                                        left: '-25%',
                                        width: '150%',
                                        height: '150%',
                                        zIndex: 3,
                                    }}
                                    source={animationData1}
                                />
                                <Text style={{
                                    color: theme[color].dddgrey, fontSize: 30, fontWeight: '700', position: 'absolute', top: '80 %', left: '25 %', zIndex: 1
                                }}>Great Job!</Text>
                            </BlurView> : null}
                        <View style={{ backgroundColor: theme[color].dddgrey, marginVertical: 10, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10 }}>
                            <Text style={{ ...styles.title, fontSize: 24, color: theme[color].bg }}>주간 성장 리포트</Text>
                        </View>
                        <View style={styles.content}>
                            <Text style={styles.dateText}>
                                {formatDate(stats.weekStart)} ~ {formatDate(new Date(stats.weekStart).setDate(new Date(stats.weekStart).getDate() + 6))}
                            </Text>
                            <View style={styles.statsRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={styles.label}>종합 성취율 </Text>
                                    {previousStats && (<TrendArrow
                                        current={stats.completed * 100}
                                        previous={previousStats?.completed * 100}
                                    />)}
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>

                                    <Text style={styles.value}>{(stats.completed * 100).toFixed(1)}%</Text>
                                    {previousStats && (
                                        <Text style={styles.changeText}>
                                            (지지난주 대비 {calculateAchieve()})
                                        </Text>
                                    )}


                                </View>
                            </View>
                            <View style={styles.statsRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={styles.label}>출석일수 </Text>
                                    {previousStats && (<TrendArrow
                                        current={stats.usage}
                                        previous={previousStats?.usage}
                                    />)}
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>

                                    <Text style={styles.value}>{stats.usage}일</Text>
                                    {previousStats && (
                                        <Text style={styles.changeText}>
                                            {calculateChange(stats.usage, previousStats.usage)}
                                        </Text>
                                    )}


                                </View>
                            </View>
                            <View style={styles.statsRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={styles.label}>집중 성공 </Text>
                                    {previousStats && (
                                        <TrendArrow
                                            current={stats.focus}
                                            previous={previousStats?.focus}
                                        />)}
                                </View>
                                <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <Text style={styles.value}>{stats.focus}개</Text>
                                    {previousStats && (
                                        <>

                                            <Text style={styles.changeText}>
                                                {calculateChange(stats.focus, previousStats.focus)}
                                            </Text>
                                        </>
                                    )}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={{ marginTop: 10, backgroundColor: theme[color].llgrey, ...styles.button }} onPress={() => { onClose(); setIsClicked(false); }} >
                            <Text style={{ ...styles.buttonText }}>확인</Text>
                        </TouchableOpacity>
                    </View> : <View style={styles.modalView}><Text style={{ ...styles.title, paddingVertical: 20 }}>주간 성장 리포트가 도착했어요! 📊</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={onClose} style={{ backgroundColor: theme[color].bg, ...styles.button }}  >
                                <Text style={styles.buttonText}>다음에 보기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => click()} style={{ backgroundColor: theme[color].dddgrey, ...styles.button }}   >
                                <Text style={{ ...styles.buttonText, color: theme[color].bg }}>열어보기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }

            </View >
        </Modal >
    );
};
export { WeekGreeting };