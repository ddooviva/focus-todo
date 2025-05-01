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

export const HeaderDate = (pageLocation, header) => {
    const n = RealDate(Date.now() + 86400000 * pageLocation);
    const year = String(n).slice(0, 4).padStart(4, '0');
    const month = String(n).slice(4, 6).padStart(2, '0'); // 월 (0부터 시작하므로 +1)
    const day = String(n).slice(6, 8).padStart(2, '0');
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const date = new Date(parseInt(String(n).slice(0, 4), 10), parseInt(String(n).slice(4, 6), 10) - 1, parseInt(String(n).slice(6, 8), 10))
    const dayOfWeek = date.getDay();
    const headerText = `${year}.${month}.${day} (${days[dayOfWeek]})`;
    return header ? headerText : n;

};

export const dateHeader = () => {
    const n = String(RealDate(Date.now() + 86400000 * pageLocation));
    const date = new Date(parseInt(n.slice(0, 4), 10), parseInt(n.slice(4, 6), 10) - 1, parseInt(n.slice(6, 8), 10))
    const dayOfWeek = date.getDay();
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    return n.slice(0, 4) + "." + n.slice(4, 6) + "." + n.slice(6, 8) + " (" + days[dayOfWeek] + ")"
};