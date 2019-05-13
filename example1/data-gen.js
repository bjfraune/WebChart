import { DataQueue } from "../src/Common/DataQueue.js";

var dataInterval;
var pushFunction = null;

var seconds = 0;
var count = 0;

const STOP = 100; // values to generate
const INTERVAL = 1000; // new value every 1 second
var buffer = new DataQueue(null, true);

window.addEventListener('load', function () {
    dataInterval = setInterval(
        function () {
            generateData();
        }, INTERVAL);
});

function generateData() {
    ++seconds;
    count += parseInt(Math.random() * 10);

    let datum = { "time (sec)": seconds, "count": count };
    if (typeof pushFunction == "function") {
        pushFunction(datum);
    }

    if (seconds >= STOP) {
        clearInterval(dataInterval);
    }

    buffer.enqueue(datum);

    // console.log(datum);
    // console.log(buffer.toString());
    // console.log(pull());
    // console.log(poll(3, 5));
}

export function setPushFunction(pushTo) {
    // console.log(`pushTo = ${pushTo}`);
    pushFunction = pushTo;
}

export function clearPushFunction() {
    pushFunction = null;
}

export function pull() {
    return buffer.front();
}

export function poll(start, end) {
    return buffer.range(start, end);
}