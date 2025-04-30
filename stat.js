import { useToDos } from "./ToDos";

const { toDos, setToDos } = useToDos();
// 날짜를 변환하는 함수
const convertToDate = (intDate) => {
    const strDate = intDate.toString();
    const year = parseInt(strDate.slice(0, 2)) + 2000; // 250404 -> 2025
    const month = parseInt(strDate.slice(2, 4)) - 1; // 04 -> 3 (0부터 시작)
    const day = parseInt(strDate.slice(4, 6)); // 04
    return new Date(year, month, day); // Date 객체 반환
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
        achievements[lastWeekStart] = { key: lastWeekStart, focus: 0, completed: 0, usage: 0 }; // 초기화
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
        const savedDate = convertToDate(value.date); // 날짜 변환
        totalToDos += 1; // 총 ToDo 개수 증가



        // focus 계산
        if (value.star === true && value.progress === 2) {
            achievements[lastWeekStart].focus += 1; // focus 증가
        }

        // completed 계산
        if (value.progress === 2) {
            completedToDos += 1; // completed 증가
        }
        achievements[lastWeekStart].completed = totalToDos > 0 ? completedToDos / totalToDos : 0;

    });

    // usage 계산: 저번 주 동안 앱을 사용한 날 수
    const uniqueUsageDays = new Set(); // 중복된 날짜를 피하기 위해 Set 사용
    filteredToDos.forEach(([key, value]) => {
        const savedDate = convertToDate(value.date);
        uniqueUsageDays.add(savedDate.toISOString().split('T')[0]); // YYYY-MM-DD 형식으로 추가
    });
    achievements[lastWeekStart].usage = uniqueUsageDays.size; // 사용한 날 수

    return achievements; // 주 단위 성취도 반환
};



// 성취도 계산 및 출력
const weeklyAchievements = await calculateWeeklyAchievements(toDos);
console.log(weeklyAchievements);
