import { useColor } from "./ColorContext";

export const theme = {

    black: {
        bg: "#ffffff",
        llgrey: '#f1f3f5',
        dgrey: '#868e96',
        ddgrey: "#495057",
        dddgrey: "#222529",
        wave: "black"
    },
    blue: {
        bg: "#fdfdfd",
        llgrey: "#b5d4e9",
        dgrey: '#6b92bb',
        ddgrey: "#3a648f",
        dddgrey: "#1c3547",
        wave: "#90b3d2"
    },
    aqua: {
        bg: "#fdfdfd",          // 기존대로 유지
        llgrey: "#d1f0f2",      // 아주 연한 아쿠아 (하이라이트 느낌)
        dgrey: "#7acfd3",       // 메인 아쿠아 컬러, 채도 적당
        ddgrey: "#3ca3a8",      // 톤 다운된 진한 아쿠아
        dddgrey: "#194143",     // 가장 어두운 포인트, blue의 dddgrey에 대응
        wave: "#b1dadc"         // 부드럽고 은은한 포인트 아쿠아, 기존 wave처럼
    },
    bluelemon: {
        bg: "#fefaf8",            // 기존 그대로 유지
        llgrey: "#c0e4e8",        // 아주 연한 아쿠아 (차분하고 부드럽게)
        dgrey: "#5fa8b8",         // 메인 아쿠아 (조화로운 색으로 조금 더 채도 낮춤)
        ddgrey: "#34888e",        // 톤 다운된 진한 아쿠아 (따뜻한 느낌 추가)
        dddgrey: "#153030",       // 가장 어두운 포인트 (더 어두운 느낌으로)
        wave: "#f9d757"          // 부드럽고 은은한 포인트 아쿠아, 기존 wave처럼
    },
    peach: {
        bg: "#fbf1df",
        llgrey: "#fcdfc7",
        dgrey: '#f4aa8a',
        ddgrey: "#ca514c",
        dddgrey: "#78282a",
        wave: "#ca514c"

    },

    cherry: {
        bg: "#fbf1df",         // 따뜻한 밝은 배경
        llgrey: "#a0b94f",     // 아주 연한 따뜻한 연두
        dgrey: "#7a9e4e",      // 노란기 섞인 부드러운 연두
        ddgrey: "#8b5e3c",     // 체리 레드 (상큼한 포인트)
        dddgrey: "#4e2e1f",    // 진한 빨강 체리 (보라기 없음, 묵직한 레드)
        wave: "#b11234",    // 진한 빨강 체리 (보라기 없음, 묵직한 레드)

    }/* cherry: {
        bg: "#fdf1e0",
        llgrey: "#ffcabb",
        dgrey: '#f39fa1',
        ddgrey: "#ea5268",
        dddgrey: "#9b1b30",
    }, */,
    pink: {
        bg: "#fff6f9",          // 더 연하고 따뜻한 부드러운 핑크
        llgrey: "#fbd4db",      // 더욱 부드럽고 연한 핑크
        dgrey: '#f2a7b0',       // 따뜻한 연핑크, 더 밝고 부드럽게
        ddgrey: "#eb6e7b",      // 좀 더 진한 핑크로 강조
        wave: "#e47d8c",        // 사랑스럽고 따뜻한 핑크, 포인트로 살림
        dddgrey: "#d12c45",     // 좀 더 진한 따뜻한 핑크, 포인트를 강조
    },
    brown: {
        bg: "#fbf1df",
        llgrey: "#f2e1b9",
        dgrey: '#d2b58b',
        ddgrey: "#9b6849",
        wave: "#9b6849",
        dddgrey: "#553d2e",
    },
    darkblue: {
        bg: "#fcffff",
        llgrey: "#E8EBEF",
        dgrey: '#96a3af',
        ddgrey: "#55728b",
        dddgrey: "#1e3865",
        wave: "#163b5b",
    },
    darkgreen: {
        bg: "#fdfeff",
        llgrey: "#dddadc",
        dgrey: '#a0aca3',
        ddgrey: "#5c6d5e",
        dddgrey: "#404C42",
        wave: "#404C42",
    },
    natural: {
        bg: "#fbf1df",
        llgrey: "#f0dba7",
        dgrey: '#dba64c',
        ddgrey: "#6e7a3b",
        wave: "#6e7a3b",
        dddgrey: "#293024",
    },
    green: {
        bg: "#fbf1df",
        llgrey: "#dbd989",
        dgrey: '#abaa4b',
        ddgrey: "#505717",
        wave: "#505717",
        dddgrey: "#3a4524",
    },
    grape: {
        bg: "#e5e5e2",
        llgrey: "#ccbabd",
        dgrey: '#9a758e',
        ddgrey: "#764a71",
        dddgrey: "#6c264f",
        wave: "#6c264f",
    }, yellow: {
        bg: "#fbf1df",
        llgrey: "#f8e795",
        dgrey: '#fece1d',
        ddgrey: "#f08f04",
        wave: "#f4a30f",
        dddgrey: "#f06900",
    }
    , lavender: {
        bg: "#fcf9f8",
        llgrey: "#dae7f8",
        dgrey: '#a3a2df',
        ddgrey: "#6e73d7",
        wave: "#6e73d7",
        dddgrey: "#6245a9",
    },
}
/* @param { string } hex - HEX 색상 코드(예: "#RRGGBB")
    * @returns { object } */
export function hexToCMYK(hex) {
    // HEX 색상 값을 RGB로 변환
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    // K 값 계산
    const k = 1 - Math.max(r, g, b);

    // C, M, Y 값 계산
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return [
        parseFloat(c.toFixed(4)),
        parseFloat(m.toFixed(4)),
        parseFloat(y.toFixed(4)),
        parseFloat(k.toFixed(4))
    ];
}
/**
 * HEX 색상 코드를 RGB로 변환하는 함수
 * @param {string} hex - HEX 색상 코드 (예: "#RRGGBB")
 * @returns {object} - RGB 색상 객체 {r: red, g: green, b: blue}
 */
function hexToRGB(hex) {
    // HEX 색상 코드에서 '#' 제거
    hex = hex.replace('#', '');

    // R, G, B 값 추출
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;

    return [r, g, b]
}

