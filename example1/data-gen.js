import { DataQueue } from "../src/Common/DataQueue.js";

var dataInterval;
var pushFunction = null;
var seconds = 0;
var count = 0;
const STOP = 10;
var buffer = new DataQueue(5);

window.addEventListener('load', function () {
    dataInterval = setInterval(
        function () {
            generateData();
        }, 1000);
});

function generateData() {
    ++seconds;
    count += Math.random();

    let datum = { "time (sec)": seconds, "count": count };
    if (typeof pushFunction == "function") {
        pushFunction(datum);
    }

    if (seconds >= STOP) {
        clearInterval(dataInterval);
    }

    console.log("recent datum:");
    console.log(datum);

    buffer.push(datum);
    printBuffer();
}

function printBuffer() {
    console.log(buffer.toString());
}

export function setPushFunction(pushTo) {
    pushFunction = pushTo;
}

export function pull() {

}

export function poll() {

}