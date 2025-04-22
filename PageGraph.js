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
            <ScrollView contentContainerStyle={{ paddingTop: 80, justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.header}>
                    <Text style={styles.date}>통계</Text>
                </View>
                <View style={styles.listContainer}>

                    <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View>
                    <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View> <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                        <Text style={styles.contentText1}>dd</Text>
                        <Text style={styles.contentText1}>dd</Text>
                    </View>
                    <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View>
                    <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View> <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View> <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View> <View style={styles.contentCard}>
                        <Text style={styles.contentText1}>dd</Text>
                    </View>
                </View>




            </ScrollView>
        </View>

    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.llgrey,
        flexDirection: "column",
        justifyContent: "center",
        alignContent: 'center'
    },
    header: {
        width: "40%",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        padding: 20,
        borderColor: theme.dddgrey,
        borderRadius: 20,
        borderWidth: 3
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