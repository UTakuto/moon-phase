"use strict";
const canvasSize = 700; // キャンバスのサイズを指定

// 円周率やその他の計算に必要な定数を設定
const pi = Math.PI, // 円周率
    pi2 = pi * 2, // 2π (円周の角度)
    topAngle = pi + (pi / 2) * 3, // キャンバス上での上部の角度
    bottomAngle = pi + pi / 2, // キャンバス上での下部の角度
    halfCanvas = canvasSize / 2, // キャンバスの中心座標
    canvas = [], // キャンバスを格納する配列
    canvasText = [], // キャンバスのコンテキストを格納する配列
    start = [0, topAngle, 0], // 弧を描き始める角度
    end = [pi2, bottomAngle, pi2]; // 弧を描き終える角度

let currentDate = new Date(); // 現在の日付を保持
let timer = null; // タイマーを保持
let speed = 1000; // タイマーの間隔を保持（デフォルトは1秒）

// DOM が完全にロードされた時に実行
window.addEventListener(
    "DOMContentLoaded",
    function () {
        // 月齢表示エリアの高さと月全体の幅を設定
        document.querySelector(".moonAge").style.height = `${canvasSize}px`;
        document.querySelector(".moon").style.width = `${canvasSize}px`;

        // 各キャンバスに対して設定を適用
        for (let i = 0; i < 3; i++) {
            canvas[i] = document.getElementById(`layer${i}`); // 各キャンバスを取得
            canvas[i].style.width = `${canvasSize}px`; // キャンバスの幅を設定
            canvas[i].style.height = `${canvasSize}px`; // キャンバスの高さを設定
            canvas[i].width = canvasSize; // キャンバスの実際の描画領域の幅
            canvas[i].height = canvasSize; // キャンバスの実際の描画領域の高さ
            canvasText[i] = canvas[i].getContext("2d"); // 2Dコンテキストを取得

            // キャンバスの色を設定。0番目のレイヤーは灰色、それ以外は黄色。
            canvasText[i].fillStyle = i === 0 ? "#444444" : "#ffff4D";

            // 弧を描画
            canvasText[i].arc(halfCanvas, halfCanvas, halfCanvas * 0.95, start[i], end[i]);
            canvasText[i].fill(); // 塗りつぶす
        }

        // 初期表示
        chg(currentDate);

        // ボタンのイベントリスナーを設定
        document.getElementById("next").addEventListener("click", () => startTimer(1));
        document.getElementById("prev").addEventListener("click", () => startTimer(-1));
        document.getElementById("stop").addEventListener("click", stopTimer);
        document.getElementById("today").addEventListener("click", () => {
            stopTimer();
            currentDate = new Date();
            chg(currentDate);
        });
        document.getElementById("speed1x").addEventListener("click", () => setSpeed(1000));
        document.getElementById("speed2x").addEventListener("click", () => setSpeed(500)); // 2倍速に設定
    },
    false
);

// タイマーを開始する関数
function startTimer(direction) {
    stopTimer(); // 既存のタイマーがあれば停止
    timer = setInterval(() => {
        currentDate.setDate(currentDate.getDate() + direction);
        chg(currentDate);
    }, speed);
}

// タイマーを停止する関数
function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}

// 速度を設定する関数
function setSpeed(newSpeed) {
    speed = newSpeed;
}

// 日付が変更された時に月齢を計算する関数
function chg(date) {
    if (isNaN(date.getTime())) return; // 日付が無効の場合は終了
    date.setHours(12); // 時間を12時に設定（タイムゾーンの影響を防ぐため）

    // 月齢の計算
    const day = date.getTime() / 864e5 - 6.475, // 経過日数（基準日からの日数）
        r = 29.530588853 + 2.162e-9 * ((date.getTime() - 946727935816) / 315576e5), // 平均朔望月（29.53日周期）
        age = day > 0 ? day % r : (r + (day % r)) % r; // 月齢を0〜29.53日の範囲で計算

    // console.log(date.getTime());

    // 月齢をHTMLに表示
    document.querySelector(
        "#moonDate"
    ).innerHTML = `${date.toLocaleDateString()}<br>月齢:${age.toFixed(1)}`;

    appearance(age, r); // 月の見た目を更新
}

// 月の見た目を更新する関数
function appearance(age, moon) {
    // 月の陰影を計算するための三角関数
    const s = Math.cos((pi2 * age) / moon), // 月齢に応じたcos値（陰影の方向）
        s2 = Math.sin((pi2 * age) / moon), // 月齢に応じたsin値（回転方向）
        r = Math.abs(halfCanvas * s); // 陰影のサイズを計算

    // 月の回転方向を設定。サイン値が正なら180度回転
    canvas[1].style.transform = `rotate(${s2 > 0 ? 180 : 0}deg)`;
    console.log("s", s, "s2", s2);

    // 2番目のレイヤーをクリアして、新しい陰影を描画
    canvasText[2].clearRect(0, 0, canvasSize, canvasSize); // キャンバスをクリア
    canvasText[2].beginPath(); // 新しいパスを開始
    canvasText[2].fillStyle = s > 0 ? "#444444" : "#ffff4D"; // 陰影の色を設定
    canvasText[2].arc(halfCanvas, halfCanvas, halfCanvas * 0.95, 0, pi2); // 新しい弧を描画
    canvasText[2].fill(); // 塗りつぶす

    // 陰影の幅と位置を設定
    canvas[2].style.width = `${r * 2}px`; // 陰影の幅を設定
    canvas[2].style.left = `${halfCanvas - r}px`; // 陰影の位置を調整
}
