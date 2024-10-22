"use strict";
const canvasSize = 700;

const pi = Math.PI,
    pi2 = pi * 2,
    topAngle = pi + (pi / 2) * 3,
    bottomAngle = pi + pi / 2,
    halfCanvas = canvasSize / 2,
    canvas = [],
    canvasText = [],
    start = [0, topAngle, 0],
    end = [pi2, bottomAngle, pi2];

window.addEventListener(
    "DOMContentLoaded",
    function () {
        document.querySelector(".moonAge").style.height = `${canvasSize}px`;
        document.querySelector(".moon").style.width = `${canvasSize}px`;
        for (let i = 0; i < 3; i++) {
            canvas[i] = document.getElementById(`layer${i}`);
            canvas[i].style.width = `${canvasSize}px`;
            canvas[i].style.height = `${canvasSize}px`;
            canvas[i].width = canvasSize;
            canvas[i].height = canvasSize;
            canvasText[i] = canvas[i].getContext("2d");
            canvasText[i].fillStyle = i === 0 ? "#444444" : "#ffff4D";
            canvasText[i].arc(halfCanvas, halfCanvas, halfCanvas * 0.95, start[i], end[i]);
            canvasText[i].fill();
        }
        const e = document.querySelector("#calender");
        e.value = new Date().toLocaleDateString("sv");
        chg(e.value);
    },
    false
);

function chg(d) {
    const date = new Date(d);
    if (isNaN(date.getTime())) return;
    date.setHours(12);

    const day = date.getTime() / 864e5 - 6.475,
        // 平均朔望月
        r = 29.530588853 + 2.162e-9 * ((date.getTime() - 946727935816) / 315576e5),
        age = day > 0 ? day % r : (r + (day % r)) % r;
    document.querySelector(
        "#moonDate"
    ).innerHTML = `${date.toLocaleDateString()}<br>月齢:${age.toFixed(1)}`;
    appearance(age, r);
}

function appearance(age, moon) {
    const s = Math.cos((pi2 * age) / moon),
        s2 = Math.sin((pi2 * age) / moon),
        r = Math.abs(halfCanvas * s);
    canvas[1].style.transform = `rotate(${s2 > 0 ? 180 : 0}deg)`;
    canvasText[2].clearRect(0, 0, canvasSize, canvasSize);
    canvasText[2].beginPath();
    canvasText[2].fillStyle = s > 0 ? "#444444" : "#ffff4D";
    canvasText[2].arc(halfCanvas, halfCanvas, halfCanvas * 0.95, 0, pi2);
    canvasText[2].fill();
    canvas[2].style.width = `${r * 2}px`;
    canvas[2].style.left = `${halfCanvas - r}px`;
}
