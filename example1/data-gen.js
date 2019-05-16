import { DataQueue } from "../src/Common/DataQueue.js";

var dataInterval;
var pushFunction = null;

var seconds = 0;
var count = 0;

var stop = 20; // values to generate
var interval = 1000; // new value every 1 second
var buffer = new DataQueue(null, true);

window.addEventListener('load', function () {
    // could set up an auto generator...
    dataInterval = setInterval(
        function () {
            generateData();
        }, interval);
});

export function updateInterval(newInterval) {
    if (newInterval) {
        interval = newInterval;
    }
}

export function updateValuesToGenerate(newCount) {
    if (newCount) {
        count = newCount;
    }
}

export function startGenerating() {
    if(dataInterval){
        stopGenerating
    }
    dataInterval = setInterval(
        function () {
            generateData();
        }, interval);
}

export function stopGenerating() {
    if (dataInterval) {
        clearInterval(dataInterval);
    }
}

function generateData() {
    ++seconds;
    count += parseInt(Math.random() * 10);

    let datum = { "time (sec)": seconds, "count": count };
    if (typeof pushFunction == "function") {
        // console.log(datum);
        pushFunction(datum);
    }

    if (seconds >= stop) {
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