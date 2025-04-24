import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { theme } from '../color';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePageLocation } from '../PageLocationContext'; // Context 훅 임포트
import GraphWeek from './GraphWeek'

function getDayFromDate(dateString) {
    // YYYYMMDD 형식의 문자열을 Date 객체로 변환
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // 월은 0부터 시작
    const day = parseInt(dateString.slice(6, 8), 10);

    const date = new Date(year, month, day); // Date 객체 생성
    const dayOfWeek = date.getDay(); // 요일 숫자 (0: 일요일, 1: 월요일, ..., 6: 토요일)
    console.log
    return dayOfWeek;
}
export default function PageGraph({ navigation }) {
    const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 관리

    return (
        <View style={styles.container}>
            <LottieView
                key={Date.now()}// key는 LottieView에 직접 추가
                autoPlay
                loop
                source={require('../assets/graphbg.json')}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: -5,
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.dddgrey
                }}
            ></LottieView>
            <View style={styles.header}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} ><AntDesign name="infocirlceo" size={24} color={theme.bg} /></TouchableOpacity>
                <TouchableOpacity onLongPress={() => navigation.navigate('Home')}>
                    <View style={{ backgroundColor: theme.bg, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ ...styles.date }} > 분석 & 통계 </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}  ><AntDesign name="setting" size={24} color={theme.bg} /></TouchableOpacity>
            </View >
            <View style={styles.cardContainer}>
                <ScrollView>
                    <BlurView intensity={40} style={styles.card} tint='systemThinMaterial'>
                        <GraphWeek />
                    </BlurView>
                    <BlurView intensity={40} style={styles.card} tint='systemThinMaterial'>
                        <Text style={styles.contentText1}>dkdkd</Text>
                    </BlurView>
                    <BlurView intensity={40} style={styles.card} tint='systemThinMaterial'>
                        <Text style={styles.contentText1}>dkdkd</Text>
                    </BlurView>
                    <BlurView intensity={40} style={styles.card} tint='systemThinMaterial'>
                        <Text style={styles.contentText1}>dkdkd</Text>
                    </BlurView>
                </ScrollView>
            </View>
            <StatusBar style='light'></StatusBar>
        </View >

    )

}
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
        paddingTop: 20
    },
    cardContainer: {
        flex: 22,
        height: '100%',
        paddingTop: 10
    },
    date: {
        fontSize: 20,
        fontWeight: 600,
        color: theme.dddgrey,
    },
    card: {
        flex: 1,
        padding: 20,
        margin: 16,
        textAlign: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 20,
        alignItems: 'center'
    },
    contentText1: {
        textAlign: 'center',
        color: theme.bg,
        fontWeight: 600,
        fontSize: 20
    }
})