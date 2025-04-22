export const RealDate = (key) => {
    const time = new Date(Number(key)); // 현재 날짜와 시간 가져오기
    const currentHour = time.getHours(); // 현재 시각 (0-23)

    // 새벽 4시 이전인지 확인
    if (currentHour < 4) {
        // 새벽 4시 이전이면 어제 날짜
        time.setDate(time.getDate() - 1); // 날짜를 하루 감소
    }

    // 날짜 포맷팅
    const year = time.getFullYear();
    const month = String(time.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = String(time.getDate()).padStart(2, '0'); // 일

    // 날짜 문자열 생성
    return parseInt(`${year}${month}${day}`);

};

export const TodayDate = () => {

    const now = new Date(); // 현재 날짜와 시간 가져오기
    const currentHour = now.getHours(); // 현재 시각 (0-23)

    // 새벽 4시 이전인지 확인
    if (currentHour < 4) {
        // 새벽 4시 이전이면 어제 날짜
        now.setDate(now.getDate() - 1); // 날짜를 하루 감소
    }

    // 날짜 포맷팅
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = String(now.getDate()).padStart(2, '0'); // 일

    // 날짜 문자열 생성
    return parseInt(`${year}${month}${day}`);
};

