import { useToDos } from '../ToDos';
import { RealDate, TodayDate } from '../dateTranslator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';

export default GraphWeek = () => {
    const { toDos, setToDos } = useToDos();


    const saveWeeklyCompletionRates = async (toDos) => {

        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // 주의 시작일 (일요일)
        console.log(startOfWeek.setDate(today.getDate() - today.getDay()))

        const completionRates = {};

        // 0주차부터 6주차까지 반복
        for (let week = 0; week < 7; week++) {
            const weekStartDate = new Date(startOfWeek);
            weekStartDate.setDate(startOfWeek.getDate() + week * 7); // 주의 시작일 설정
            const weekEndDate = new Date(weekStartDate);
            weekEndDate.setDate(weekStartDate.getDate() + 6); // 주의 종료일 설정

            let completedCount = 0;
            let totalCount = 0;

            // 날짜 범위에 해당하는 toDo 필터링
            Object.entries(toDos).forEach(([key, value]) => {
                const toDoDate = new Date(value.date); // toDo의 날짜를 Date 객체로 변환
                if (toDoDate >= weekStartDate && toDoDate <= weekEndDate) { // 날짜 범위 체크
                    totalCount++; // 전체 항목 수 증가
                    if (value.progress === 2) { // 완료된 항목 체크 (progress가 2인 경우)
                        completedCount++; // 완료된 항목 수 증가
                    }
                }
            });

            // 완료 비율 계산
            const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

            // 완료 비율을 주 단위로 저장
            completionRates[`week${week}`] = completionRate;
        }

        // 완료 비율을 AsyncStorage에 저장
        await AsyncStorage.setItem("@weeklyCompletionRates", JSON.stringify(completionRates));
    };

    // 사용 예시


    saveWeeklyCompletionRates(toDos);
    return (

        <View>
            <Text></Text>
        </View>
    )
}

