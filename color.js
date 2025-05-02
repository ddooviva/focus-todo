import { useColor } from "./ColorContext";

export const theme = {

    black: {
        bg: "#ffffff",
        llgrey: '#f1f3f5',
        dgrey: '#868e96',
        ddgrey: "#495057",
        dddgrey: "#222529",
    },
    blue: {
        bg: "#fdfdfd",
        llgrey: "#b9ddfa",
        dgrey: '#43a3dc',
        ddgrey: "#0373b6",
        dddgrey: "#28517b",
    },
    peach: {
        bg: "#fbf1df",
        llgrey: "#fcdfc7",
        dgrey: '#f4aa8a',
        ddgrey: "#ca514c",
        dddgrey: "#78282a",
    },
    lavender: {
        bg: "#fcf9f8",
        llgrey: "#dae7f8",
        dgrey: '#a3a2df',
        ddgrey: "#6e73d7",
        dddgrey: "#6245a9",
    },
    cherry: {
        bg: "#fdf1e0",
        llgrey: "#ffcabb",
        dgrey: '#f39fa1',
        ddgrey: "#ea5268",
        dddgrey: "#a01261",
    },
    pink: {
        bg: "#fefdff",
        llgrey: "#f6dcec",
        dgrey: '#e996b6',
        ddgrey: "#d8527f",
        dddgrey: "#cd2456",
    },
    brown: {
        bg: "#fbf1df",
        llgrey: "#f2e1b9",
        dgrey: '#d2b58b',
        ddgrey: "#9b6849",
        dddgrey: "#553d2e",
    },
    darkblue: {
        bg: "#fcffff",
        llgrey: "#E8EBEF",
        dgrey: '#96a3af',
        ddgrey: "#55728b",
        dddgrey: "#1e3865",
    },
    darkgreen: {
        bg: "#fdfeff",
        llgrey: "#dddadc",
        dgrey: '#a0aca3',
        ddgrey: "#5c6d5e",
        dddgrey: "#404C42",
    },
    natural: {
        bg: "#fdfeff",
        llgrey: "#f0dba7",
        dgrey: '#dba64c',
        ddgrey: "#757b50",
        dddgrey: "#525c49",
    },
    green: {
        bg: "#fbf1df",
        llgrey: "#dbd989",
        dgrey: '#abaa4b',
        ddgrey: "#505717",
        dddgrey: "#3a4524",
    },
    grape: {
        bg: "#e5e5e2",
        llgrey: "#ccbabd",
        dgrey: '#9a758e',
        ddgrey: "#764a71",
        dddgrey: "#6c264f",
    }, yellow: {
        bg: "#fbf1df",
        llgrey: "#f8e795",
        dgrey: '#fece1d',
        ddgrey: "#f08f04",
        dddgrey: "#f06900",
    }
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

