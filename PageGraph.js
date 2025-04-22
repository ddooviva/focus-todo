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



export default function PageGraph() {
    console.log('graph')
    return (

        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.date}>통계</Text>
            </View>
            <View style={styles.listContainer}> <ScrollView>
                <View style={styles.contentCard}>
                    <Text style={styles.contentText1}>dd</Text>
                </View>
                <View style={styles.contentCard}>
                    <Text style={styles.contentText1}>dd</Text>
                </View> <View style={styles.contentCard}>
                    <Text style={styles.contentText1}>dd</Text>
                </View>
            </ScrollView></View>




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
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 30,
        paddingTop: 20
    },
    date: {
        fontSize: 20,
        fontWeight: 600,
        color: theme.bg
    },
    listContainer: {
        flex: 22,
        height: '100%',
        paddingTop: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    contentCard: {
        backgroundColor: theme.llgrey,
        minWidth: '80%',
        margin: 10,
        borderRadius: 20,
    },
    contentText1: {
        textAlign: 'center',
        padding: 20,
    }
})