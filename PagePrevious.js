import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from './color';
import { usePageLocation } from './PageLocationContext'; // Context 훅 임포트
import { useToDos } from './ToDos';
import { RealDate, TodayDate } from './dateTranslator';
import LottieView from 'lottie-react-native';
import * as Haptics from 'expo-haptics'

const window = {
    width: Dimensions.get('window').width, height: Dimensions.get('window').height
}
export default function PagePrevious({ navigation }) {
    const { pageLocation, setPageLocation } = usePageLocation();
    const { toDos, setToDos } = useToDos();
    const [animationKey, setAnimationKey] = useState(0); // 애니메이션 키 관리


    const previousToDo = Object.fromEntries(Object.entries(toDos).filter(([key, value]) => value.date === TodayDate() + pageLocation));
    const achiveNum = Object.entries(previousToDo).filter(([key, value]) => value.progress === 2).length / Object.entries(previousToDo).length;

    console.log(achiveNum)
    const dateNum = () => {
        const n = String(TodayDate() + pageLocation);
        const date = new Date(parseInt(n.slice(0, 4), 10), parseInt(n.slice(4, 6), 10) - 1, parseInt(n.slice(6, 8), 10))
        const dayOfWeek = date.getDay();
        const days = ["일", "월", "화", "수", "목", "금", "토"];
        console.log(dayOfWeek);
        return n.slice(0, 4) + "." + n.slice(4, 6) + "." + n.slice(6, 8) + " (" + days[dayOfWeek] + ")"
    };
    return (
        <View style={{ ...styles.container, backgroundColor: "transparent" }}>
            <LottieView
                key={Date.now()}// key는 LottieView에 직접 추가
                PageLocationProvider
                autoPlay
                source={require('./assets/wave2.json')}
                style={{
                    position: 'absolute',
                    top: (-1050 - 600 * achiveNum) / 667 * window.height,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: -1,
                    width: '150%',
                    height: '500%',
                    backgroundColor: "white"
                }}
            ></LottieView>
            <View style={{ flexDirection: "column", justifyContent: "flex-end", backgroundColor: "black", position: 'absolute', bottom: 0, width: '100%', height: 500 / 667 * window.height * achiveNum, zIndex: -1 }} />

            <View style={{ ...styles.header, backgroundColor: "transparent" }}>
                {pageLocation !== -7 ? <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation - 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }} ><AntDesign name="caretleft" size={24} color={theme.ddgrey}></AntDesign></TouchableOpacity> : <TouchableOpacity><AntDesign name="caretleft" size={24} color={theme.lgrey}></AntDesign></TouchableOpacity>}
                <View style={{ borderRadius: 10, borderWidth: 2, borderColor: theme.dddgrey, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 }}>
                    <Text style={styles.date} >{dateNum()}</Text>
                </View>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => { setPageLocation(pageLocation + 1); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }}><AntDesign name="caretright" size={24} color={theme.ddgrey}></AntDesign></TouchableOpacity>
            </View>
            {
                Object.keys(previousToDo).length === 0 ?
                    <View style={{ ...styles.listContainer, alignItems: 'center' }}>
                        <Text style={styles.nodataText}>no data</Text>
                        <LottieView
                            key={Date.now()}// key는 LottieView에 직접 추가
                            PageLocationProvider
                            autoPlay
                            source={require('./assets/nofound1.json')}
                            style={{
                                top: '-30%',
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        ></LottieView>
                    </View>
                    :
                    <View style={{ ...styles.listContainer }}>

                        <ScrollView>
                            {Object.keys(previousToDo).map((key) => {
                                return (
                                    <View key={key} style={{
                                        ...styles.list, backgroundColor: (previousToDo[key].star && previousToDo[key].progress !== 2 ? theme.llgrey : previousToDo[key].progress === 2 ? theme.dgrey : theme.llgrey), borderWidth: 2, borderColor: (previousToDo[key].progress === 2 ? theme.dgrey : previousToDo[key].star && previousToDo[key].progress !== 2 ? theme.ddgrey : theme.llgrey)
                                    }}>
                                        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                                            <MaterialCommunityIcons style={{ paddingRight: 10 }} name={previousToDo[key].progress === 0 ? "checkbox-blank-outline" : (previousToDo[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color={theme.dddgrey}></MaterialCommunityIcons></TouchableOpacity>
                                        <Text style={{ ...styles.listText, textDecorationLine: (previousToDo[key].progress === 2 ? "line-through" : "none") }}>{previousToDo[key].text}</Text>
                                    </View>)
                            })
                            }
                        </ScrollView>
                    </View>
            }
            <StatusBar style="auto"></StatusBar>
        </View >
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.bg,
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
        color: theme.dddgrey
    },
    listContainer: {
        flex: 22,
        height: '100%',
        paddingTop: 10
    },
    list: {
        flexDirection: "row",
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginHorizontal: 30,
        backgroundColor: theme.lightgrey,
        margin: 5,
        borderRadius: 20,
        alignItems: "center",
    },
    listText: {
        fontWeight: 500,
        fontSize: 16,
        paddingVertical: 6,
        width: '100%', height: '100%', textAlignVertical: 'bottom',
        color: theme.dddgrey
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
        color: theme.grey,
        fontSize: 60,
        fontWeight: 700,
        paddingTop: 60
    }
});

