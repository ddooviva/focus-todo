import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import LottieView from 'lottie-react-native';
import { theme } from './color';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePageLocation } from './PageLocationContext'; // Context 훅 임포트

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
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretleft" size={24} color={theme.ddgrey} /></TouchableOpacity>
                <TouchableOpacity onLongPress={() => navigation.navigate('PageGraph')}>
                    <View style={{ backgroundColor: theme.dddgrey, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10 }}>
                        <Text style={{ ...styles.date, color: theme.bg }} >"hello"</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretright" size={24} color={theme.ddgrey} /></TouchableOpacity>
            </View>
            <Text>하ㅓㅇㄹㄴ</Text>
            <View style={styles.listContainer}></View>
            <StatusBar style='light'></StatusBar>
        </View>

    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.dddgrey,
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
    listContainer: {
        flex: 22,
        height: '100%',
        paddingTop: 10
    },
    date: {
        fontSize: 20,
        fontWeight: 600,
        color: theme.dddgrey
    },
    listContainer: {
        height: '100%',
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentCard: {
        backgroundColor: theme.dddgrey,
        minWidth: '90%',
        margin: 10,
        borderRadius: 20,
    },
    contentText1: {
        textAlign: 'center',
        padding: 20,
        color: theme.bg
    }
})