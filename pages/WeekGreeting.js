import { useRef, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, Modal, Button, TextInput, TouchableOpacity, View, Dimensions, TouchableNativeFeedback } from 'react-native';
import { theme } from '../color'
import { calculateAndSaveWeeklyStats, getWeekStats, formatDate, getLastTwoWeeksStats } from '../stat'
import { useColor } from '../ColorContext';
// TrendArrow 컴포넌트 수정
const TrendArrow = ({ current, previous }) => {
    if (!previous) return null;  // ⭐ previous가 없으면 아무것도 표시하지 않음

    const diff = current - previous;
    if (diff > 0) {
        return <Text style={{ color: '#2ecc71' }}>↑</Text>;
    } else if (diff < 0) {
        return <Text style={{ color: '#e74c3c' }}>↓</Text>;
    }
    return <Text style={{ color: '#95a5a6' }}>−</Text>;
};


// 변화량을 계산하는 함수
const calculateChange = (current, previous) => {
    if (!previous) return null;
    const diff = current - previous;
    const percent = ((diff / previous) * 100).toFixed(1);
    return diff > 0 ? `+${percent}%` : `${percent}%`;
};

function WeekGreeting({ visible, onClose, stats, previousStats }) {
    const { color, setColor } = useColor();
    const [isClicked, setIsClicked] = useState(false);
    const click = () => { setIsClicked(true), console.log("click") }

    const styles = StyleSheet.create({
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme[color].llgrey,
        },
        modalView: {
            width: '80%',
            height: '40%',
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
            fontWeight: '500',
            color: theme[color].dddgrey,
        },
        value: {
            fontSize: 16,
            fontWeight: 'bold', color: theme[color].dddgrey,

        },
        button: {
            borderWidth: 1,
            borderColor: theme[color].dgrey,
            paddingVertical: 15,
            paddingHorizontal: 20,
            margin: 2,
            borderRadius: 10,
        },
        buttonText: {
            color: theme[color].dddgrey,
            fontSize: 16,
            fontWeight: '600',
        }, changeText: {
            fontSize: 12,
            marginLeft: 8,
            color: '#95a5a6'
        }
    });

    if (!stats) return null;

    console.log("hi")
    return (
        <Modal animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                {isClicked ?
                    <View style={styles.modalView}>


                        <View style={styles.content}>
                            <Text style={styles.dateText}>
                                {formatDate(stats.weekStart)} ~ {formatDate(new Date(stats.weekStart).setDate(new Date(stats.weekStart).getDate() + 6))}
                            </Text>
                            <View style={styles.statsRow}>
                                <Text style={styles.label}>성취율 </Text>
                                <Text style={styles.value}>{(stats.completed * 100).toFixed(1)}%</Text>
                            </View>
                            <View style={styles.statsRow}>
                                <Text style={styles.label}>출석일수 </Text>
                                <Text style={styles.value}>{stats.usage}일</Text>
                            </View>
                            <View style={styles.statsRow}>
                                <Text style={styles.label}>집중 성공 </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={styles.value}>{stats.focus}개</Text>
                                    {previousStats && (<>
                                        <TrendArrow
                                            current={stats.focus}
                                            previous={previousStats?.focus}
                                        />

                                        <Text style={styles.changeText}>
                                            {calculateChange(stats.focus, previousStats.focus)}
                                        </Text></>
                                    )}
                                </View>
                            </View>
                        </View>

                        <TouchableOpacity style={{ backgroundColor: theme[color].llgrey, ...styles.button }} onPress={onClose} >
                            <Text style={styles.buttonText}>확인</Text>
                        </TouchableOpacity>
                    </View> : <View style={styles.modalView}><Text style={{ ...styles.title, paddingBottom: 30 }}>지난주 통계가 도착했어요! 📊</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={onClose} style={{ backgroundColor: theme[color].bg, ...styles.button }}  >
                                <Text style={styles.buttonText}>다음에 보기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => click()} style={{ backgroundColor: theme[color].dgrey, ...styles.button }}   >
                                <Text style={styles.buttonText}>열어보기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

            </View>
        </Modal>
    );
};
export { WeekGreeting };