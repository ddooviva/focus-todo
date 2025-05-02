import AsyncStorage from '@react-native-async-storage/async-storage';
// 날짜를 변환하는 함수


const convertToDate = (intDate) => {
    const strDate = intDate.toString();
    const year = parseInt(strDate.substring(0, 4));  // ⭐ YYYYMMDD 형식이라면 이렇게
    const month = parseInt(strDate.substring(4, 6)) - 1;
    const day = parseInt(strDate.substring(6, 8));
    return new Date(year, month, day);
};

// 저번 주의 시작일을 계산하는 함수
const getStartOfLastWeek = (date) => {
    const lastWeekStart = new Date(date);
    lastWeekStart.setDate(lastWeekStart.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1) - 7); // 저번 주 월요일
    return lastWeekStart.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
};

// 주 단위 성취도를 계산하는 함수
const calculateWeeklyAchievements = async (toDos) => {


    const achievements = {};
    const today = new Date();
    const lastWeekStart = getStartOfLastWeek(today); // 저번 주 시작일 계산

    // 주간 데이터 초기화
    if (!achievements[lastWeekStart]) {
        achievements[lastWeekStart] = { focus: 0, completed: 0, usage: 0 }; // 초기화
    }

    // 저번 주의 끝 날짜 (일요일)
    const lastWeekEnd = new Date(lastWeekStart);
    lastWeekEnd.setDate(lastWeekEnd.getDate() + 6); // 저번 주 일요일

    // ToDo 항목 필터링
    const filteredToDos = Object.entries(toDos).filter(([key, value]) => {
        const savedDate = convertToDate(value.date); // 날짜 변환
        return savedDate >= new Date(lastWeekStart) && savedDate <= lastWeekEnd; // 저번 주 월요일부터 일요일까지
    });
    let totalToDos = 0; // 총 ToDo 개수
    let completedToDos = 0; // 완료된 ToDo 개수
    // focus, completed, usage 계산
    filteredToDos.forEach(([key, value]) => {
        totalToDos += 1; // 총 ToDo 개수 증가

        // focus 계산
        if (value.star === true && value.progress === 2) {
            achievements[lastWeekStart].focus += 1; // focus 증가
        }
        // completed 계산
        if (value.progress === 2) {
            completedToDos += 1; // completed 증가
        }

    });
    achievements[lastWeekStart].completed = totalToDos > 0 ? Number((completedToDos / totalToDos).toFixed(2))  // 소수점 2자리로 제한
        : 0;

    // usage 계산: 저번 주 동안 앱을 사용한 날 수
    const uniqueUsageDays = new Set(); // 중복된 날짜를 피하기 위해 Set 사용
    filteredToDos.forEach(([key, value]) => {
        const savedDate = convertToDate(value.date);
        uniqueUsageDays.add(savedDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 추가
    });
    achievements[lastWeekStart].usage = uniqueUsageDays.size; // 사용한 날 수

    return achievements; // 주 단위 성취도 반환
};

const calculateAndSaveWeeklyStats = async (toDos) => {
    try {
        const existingStats = await AsyncStorage.getItem('@stat');
        const stats = existingStats ? JSON.parse(existingStats) : {};
        const newStats = await calculateWeeklyAchievements(toDos);
        const updatedStats = { ...stats, ...newStats };
        await AsyncStorage.setItem('@stat', JSON.stringify(updatedStats));
        return updatedStats;
    } catch (error) {
        console.error('Error saving stats:', error);
        return null;
    }
};
const getWeekStats = async (weekStartDate) => {
    try {
        const stats = await AsyncStorage.getItem('@stat');
        const parsedStats = stats ? JSON.parse(stats) : {};
        return parsedStats[weekStartDate] || {
            key: weekStartDate,
            focus: 0,
            completed: 0,
            usage: 0
        };
    } catch (error) {
        console.error('Error getting week stats:', error);
        return {
            key: weekStartDate,
            focus: 0,
            completed: 0,
            usage: 0
        };
    }
};
// 날짜가 새로운 주에 해당하는지 확인하는 함수
const isNewWeekStarted = async () => {
    try {
        const stats = await AsyncStorage.getItem('@stat');
        const parsedStats = stats ? JSON.parse(stats) : {};
        const weeks = Object.keys(parsedStats).sort().reverse();

        if (weeks.length === 0) return true;

        const lastWeekStart = new Date(weeks[0]);
        const today = new Date();
        const daysSinceLastWeek = Math.floor((today - lastWeekStart) / (24 * 60 * 60 * 1000));

        return daysSinceLastWeek >= 7;
    } catch (error) {
        console.error('Error checking new week:', error);
        return false;
    }
};

// 자동으로 통계를 생성하고 저장하는 함수
const autoGenerateStats = async () => {
    try {
        const shouldGenerateNewStats = await isNewWeekStarted();

        if (shouldGenerateNewStats) {
            const toDos = await AsyncStorage.getItem('@toDos');
            const parsedToDos = JSON.parse(toDos) || {};
            await calculateAndSaveWeeklyStats(parsedToDos);
            return true; // 새로운 통계가 생성됨
        }
        return false; // 새로운 통계가 필요하지 않음
    } catch (error) {
        console.error('Error generating stats:', error);
        return false;
    }
};
const getLatestStats = async () => {
    try {
        const stats = await AsyncStorage.getItem('@stat');
        const parsedStats = stats ? JSON.parse(stats) : {};

        const weeks = Object.keys(parsedStats).sort().reverse();
        const a = await AsyncStorage.getItem('@stat');
        if (weeks.length > 0) {
            const latestWeek = weeks[0];
            return {
                weekStart: latestWeek,
                ...parsedStats[latestWeek]
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting latest stats:', error);
        return null;
    }
};
const getLastTwoWeeksStats = async () => {
    try {
        const stats = await AsyncStorage.getItem('@stat');
        const parsedStats = stats ? JSON.parse(stats) : {};

        // 날짜순으로 정렬된 주차 목록
        const weeks = Object.keys(parsedStats)
            .sort((a, b) => new Date(b) - new Date(a));

        // 최근 2주 데이터만 가져오기
        if (weeks.length >= 2) {
            return {
                stats: {
                    weekStart: weeks[0],
                    ...parsedStats[weeks[0]]
                },
                previousStats: {
                    weekStart: weeks[1],
                    ...parsedStats[weeks[1]]
                }
            };
        } else if (weeks.length === 1) {
            return {
                stats: {
                    weekStart: weeks[0],
                    ...parsedStats[weeks[0]]
                },
                previousStats: null
            };
        }
        // 데이터가 없는 경우 명시적으로 처리
        return {
            stats: null,
            previousStats: null
        };
    } catch (error) {
        console.error('Error getting two weeks stats:', error);
        return {
            stats: null,
            previousStats: null
        };
    }
};
// 날짜를 YYYY.MM.DD 형식으로 포맷팅하는 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
};
const testStat = {
    "2025-03-31": {
        "completed": 0.7317073170731707,
        "focus": 13,
        "key": "2025-03-31",
        "usage": 6
    },
    "2025-04-07": {
        "completed": 0.2,
        "focus": 1,
        "key": "2025-04-07",
        "usage": 2
    },
    "2025-04-14": {
        "completed": 0.3,
        "focus": 12,
        "key": "2025-04-14",
        "usage": 3
    },
    "2025-04-21": {
        "completed": 0.7317073170731707,
        "focus": 13,
        "key": "2025-04-21",
        "usage": 6
    },
}
export { testStat, getLastTwoWeeksStats, formatDate, calculateAndSaveWeeklyStats, getWeekStats, getLatestStats, autoGenerateStats };
