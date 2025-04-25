import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from '../color';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePageLocation } from '../PageLocationContext'; // Context 훅 임포트
import { RealDate, TodayDate } from '../dateTranslator';
import { useToDos } from '../ToDos';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';


export default function PageNext({ }) {
    const navigation = useNavigation(); // navigation 객체에 접근할 수 있어

    const [inputT, setInputT] = useState("");
    const { pageLocation, setPageLocation } = usePageLocation();
    const { toDos, setToDos } = useToDos();

    const nextToDo = Object.fromEntries(Object.entries(toDos).filter(([key, value]) => value.date === TodayDate() + pageLocation));

    async function saveToDos(toSave) {
        await AsyncStorage.setItem("@toDos", JSON.stringify(toSave))
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

    const checking = async (key) => {
        /*     const key = event._dispatchInstances.child.key
         */    const newToDos = { ...toDos };
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)

        if (toDos[key].progress < 2) { toDos[key].progress = toDos[key].progress + 1 } else { toDos[key].progress = 0 }
        setToDos(sorting(newToDos));
        await saveToDos(sorting(newToDos));
        setAchiveNum(() => {
            const num = Object.entries(toDos).filter(([key, value]) => value.progress === 2 && value.date === TodayDate()).length / Object.entries(toDos).filter(([key, value]) => value.date === TodayDate()).length
            console.log(num)
            return num;
        });
    }
    const giveStar = async (key) => {
        const newToDos = { ...toDos };
        newToDos[key].star = !newToDos[key].star;
        setToDos(sorting(newToDos));
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await saveToDos(sorting(newToDos));
    }
    const editTextStart = async (key) => {
        const newToDos = { ...toDos };
        newToDos[key].edit = true;
        setToDos(sorting(newToDos));
        await saveToDos(sorting(newToDos));

    }
    const editTextEnd = async (event, key) => {
        const newToDos = { ...toDos };
        event.persist();
        newToDos[key].text = event.nativeEvent.text;
        newToDos[key].edit = false;
        setToDos(sorting(newToDos));
        await saveToDos(sorting(newToDos));
        if (event.nativeEvent.text === " ") { delete newToDos[key] } { return }

    }
    const addToDo = async () => {
        if (inputT !== "") {
            setInputT("");
            const newToDos = { ...toDos, [Number(Date.now())]: { text: inputT, progress: 0, edit: false, star: false, date: RealDate(Date.now()) + pageLocation } }
            setToDos(sorting(newToDos));
            await saveToDos(sorting(newToDos));
        }
    }
    const dateNum = () => {
        const n = String(TodayDate() + pageLocation);
        const date = new Date(parseInt(n.slice(0, 4), 10), parseInt(n.slice(4, 6), 10) - 1, parseInt(n.slice(6, 8), 10))
        const dayOfWeek = date.getDay();
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        return n.slice(0, 4) + "." + n.slice(4, 6) + "." + n.slice(6, 8) + " (" + days[dayOfWeek] + ")"
    };
    const onSwipe = (event) => {
        if (event.nativeEvent.translationX > 50) {
            const countMinus = (a) => a - 1;
            setTimeout(() => {
                setPageLocation(countMinus(pageLocation));
            }, 100);
        } else if (event.nativeEvent.translationX < -50 && pageLocation < 7) {
            const countPlus = (a) => a + 1;
            setTimeout(() => {
                setPageLocation(countPlus(pageLocation));
            }, 100);
        } else { return };
    };
    const goHome = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPageLocation(0); }

    const inputText = (a) => (setInputT(a));
    return (
        <GestureHandlerRootView >
            <PanGestureHandler onGestureEvent={onSwipe}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretleft" size={24} color={theme.natural.ddgrey} /></TouchableOpacity>
                        <TouchableOpacity onPress={() => goHome()}>
                            <View style={{ borderRadius: 10, borderWidth: 2, borderColor: theme.natural.dddgrey, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 }}>
                                <Text style={styles.date}>{dateNum()}</Text>
                            </View>
                        </TouchableOpacity>
                        {pageLocation !== +7 ? <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretright" size={24} color={theme.natural.ddgrey} /></TouchableOpacity> : <TouchableOpacity><AntDesign name="caretright" size={24} color={theme.natural.llgrey} /></TouchableOpacity>}
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput style={styles.inputBox}
                            placeholder='해야 할 일을 적어주세요' onSubmitEditing={() => { addToDo(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); }}
                            onChangeText={(a) => inputText(a)}
                            value={inputT}
                            blurOnSubmit={false}
                        >

                        </TextInput>
                    </View>
                    <View style={styles.listContainer}>
                        <ScrollView>
                            {Object.keys(nextToDo).map((key) => {
                                return (
                                    <View key={key} style={{
                                        ...styles.list, backgroundColor: (toDos[key].star && toDos[key].progress !== 2 ? theme.natural.llgrey : toDos[key].progress === 2 ? theme.natural.dgrey : theme.natural.llgrey), borderWidth: 2, borderColor: (toDos[key].progress === 2 ? theme.natural.dgrey : toDos[key].star && toDos[key].progress !== 2 ? theme.natural.ddgrey : theme.natural.llgrey)
                                    }}><TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        onPress={() => checking(key)}><MaterialCommunityIcons style={{ paddingRight: 10 }} name={toDos[key].progress === 0 ? "checkbox-blank-outline" : (nextToDo[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color={theme.natural.dddgrey} /></TouchableOpacity>
                                        {!nextToDo[key].edit ?
                                            <Text style={{ ...styles.listText, textDecorationLine: (nextToDo[key].progress === 2 ? "line-through" : "none") }} onPress={() => editTextStart(key)} onLongPress={() => giveStar(key)}>{nextToDo[key].text}</Text> :
                                            <TextInput style={{ ...styles.listText }} onEndEditing={(event) => editTextEnd(event, key)} autoFocus defaultValue={nextToDo[key].text}></TextInput>}
                                    </View>)
                            }
                            )}
                        </ScrollView>
                    </View >
                    <StatusBar style="dark" />
                </View >
            </PanGestureHandler>
        </GestureHandlerRootView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.natural.bg,
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
    date: {
        fontSize: 20,
        fontWeight: 600,
        color: theme.natural.dddgrey
    }, inputContainer: {
        flex: 2
    },
    inputBox: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        fontSize: 16,
        color: theme.natural.dddgrey,
        borderRadius: 20,
        borderWidth: 2,
        borderStyle: "dotted",
        borderColor: theme.natural.dgrey,
        marginHorizontal: 30
    },
    listContainer: {
        flex: 20,
        height: '100%',
        paddingTop: 10
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
        width: '100%', height: '100%', textAlignVertical: 'bottom',
        color: theme.natural.dddgrey
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
    },
});

