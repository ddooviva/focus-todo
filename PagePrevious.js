import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { theme } from './color';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePageLocation } from './PageLocationContext'; // Context 훅 임포트


export default function PagePrevious({ navigation }) {
    const { pageLocation, setPageLocation } = usePageLocation();
    const [toDos, setToDos] = useState({});
    console.log(toDos);
    if (pageLocation > -4) {
        console.log('prev')
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    {pageLocation !== -3 ? <TouchableOpacity ><AntDesign name="caretleft" onPress={() => setPageLocation(pageLocation - 1)} size={24} color={theme.ddgrey} /></TouchableOpacity> : <TouchableOpacity><AntDesign name="caretleft" size={24} color={theme.lgrey} /></TouchableOpacity>}
                    <Text style={styles.date} onLongPress={() => navigation.navigate('PageGraph')}> 2025.04.21 (월)</Text>
                    <TouchableOpacity><AntDesign name="caretright" onPress={() => setPageLocation(pageLocation + 1)} size={24} color={theme.ddgrey} /></TouchableOpacity>
                </View>

                <View style={styles.listContainer}>

                    <ScrollView >
                        {Object.keys(toDos).map((key) => {
                            return TodayDate() === RealDate(key) ? (
                                <View key={key} style={{
                                    ...styles.list, backgroundColor: (toDos[key].star && toDos[key].progress !== 2 ? theme.llgrey : toDos[key].progress === 2 ? theme.dgrey : theme.llgrey), borderWidth: 2, borderColor: (toDos[key].progress === 2 ? theme.dgrey : toDos[key].star && toDos[key].progress !== 2 ? theme.ddgrey : theme.llgrey)
                                }}><TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                    onPress={() => checking(key)}><MaterialCommunityIcons style={{ paddingRight: 10 }} name={toDos[key].progress === 0 ? "checkbox-blank-outline" : (toDos[key].progress === 1 ? "checkbox-intermediate" : "checkbox-marked")} size={25} color={theme.dddgrey} /></TouchableOpacity>
                                    {(!toDos[key].edit ? <Text style={{ ...styles.listText, textDecorationLine: (toDos[key].progress === 2 ? "line-through" : "none") }} onPress={() => editTextStart(key)} onLongPress={() => giveStar(key)}>{toDos[key].text}</Text> :
                                        <TextInput style={{ ...styles.listText }} onEndEditing={(event) => editTextEnd(event, key)} autoFocus defaultValue={toDos[key].text}></TextInput>)}
                                    <StatusBar style="auto" />
                                </View>) : null
                        }
                        )}

                    </ScrollView>
                </View >
                <StatusBar style="auto" />

            </View >
        );
    } else setPageLocation(-3);
}


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
        paddingTop: 20
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
    },
});

