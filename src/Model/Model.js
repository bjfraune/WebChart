import { Logger } from "../Common/Logger.js";
import { DataQueue } from "../Common/DataQueue.js";
import { someData } from "../Common/test-data.js";
// import { View } from "../View/View.js";

// TODO: Make sure DataQueue keeps data in buffer for current if paused... how long??
// TODO: Determine algorithm for buffering efficiently... based on frequency of data input? based on available storage?
export class Model {
    constructor(viewModule) {
        this.logger = new Logger("Model.js");
        this.view = viewModule;

        this.currentData = new DataQueue(100, true);

        this.retrievalType = 0; // 0 == unspecified/none, 1 == push, 2 == pull, 3 == poll
        this.retrievalMethod = null;

        // testing only
        // this.currentData.enqueue(someData);
        // this.view.setData(this.currentData.range(72, 82));
    }

    setRetrievalMethod(interfaceType, interfaceMethod) {
        this.retrievalMethod = interfaceMethod;

        switch (interfaceType) {
            case "push":
                // interfaceMethod should accept an outside method that it can use to push data to this class
                this.retrievalType = 1;
                this.retrievalMethod(this.push);
                break;
            case "pull":
                // interfaceMethod should be a method that provides this class with pull access
                this.retrievalType = 2;
                break;
            case "poll":
                // interfaceMethod should be a method that provides this class with poll access
                this.retrievalType = 3;
                break;
            default:
                this.retrievalType = 0;
                this.logger.log("constructor", `Invalid interfaceType = ${interfaceType}`);
                break;
        }
    }

    /*
        The 'push' method is intended to be called repeatedly by one outside data source to generate
        a data stream. It's only guaranteed that the attributes names will be read/updated the first
        time 'pull' is called from this data source. Attribute names will be used for the chart's axis
        labels unless otherwise specified.

        datum: Object or Array - A single unit of data provided by the data source. It should contain the newest available x-value and its corresponding y-value.
            Object: If the caller of 'push' prefers to deliver 'datum' in JSON format, 'datum' should always be an object with two attribute-value pairs.
                eg: datum = {time: 0, exposure: 0.25}
                    datum = {time: 1, exposure: 0.61}
                    datum = {time: 2, exposure: 1.20}
                    datum = {time: 3, exposure: 0.87}
                
            Array: If the caller of 'push' prefers to deliver 'datum' in Array format, the first time 'push' is called, 'datum' shall provide the unit type instead of the data values. All subsequent times, the raw values may be provided.
                eg: datum = {"time", "exposure"}
                    datum = [0, 0.25]
                    datum = [1, 0.61]
                    datum = [2, 1.20]
                    datum = [3, 0.87]

            Both examples shown will generate identical charts. Although data pushed in Array format
            requires one preliminary call that is not required with JSON format, data pushed in Array
            format may provide a (currently untested and uncalculated) performance advantege, due to
            the reduced overhead.
    */
    push = (datum) => {
        // TODO: better timing for updating chart!
        this.timeNow = new Date().getTime();

        // this.logger.log("push", `timeNow == ${this.timeNow}.`)

        if (this.retrievalType != 1) {
            return; // Not the current method of input
        }
        // this.logger.log("push", "called");
        // this.logger.logObject("push", datum);
        this.currentData.enqueue(datum);
        // update View

        // notify controller instead??

        // this.logger.log("push", `typeof this.onDataReceived == ${this.onDataReceived}`);
        if (this.onDataReceived) {
            // this.logger.log("push", "dataReceived...");
            this.onDataReceived();
        }

        if (this.lastPushTime) {
            // this.logger.log("push", `this.lastPushTime == ${this.lastPushTime}.`);
            this.updateRate = parseInt(this.timeNow) - parseInt(this.lastPushTime);
            // this.logger.log("push", `this.updateRate == ${this.updateRate}.`);
            this.view.setTransitionRate(this.updateRate / 2);
        }
        this.lastPushTime = this.timeNow;
    }

    /*
        pull single most recent data available from source
    */
    pull = () => {
        if (this.retrievalType != 2) {
            return; // Not the current method of input
        }

        // update View
        this.currentData.enqueue(this.retrievalMethod());

        if (this.onDataReceived) {
            this.onDataReceived();
        }
    }
    /*
        poll source for a range of data
    */
    poll = (start, end) => {
        if (this.retrievalType != 3) {
            return; // Not the current method of input
        }

        // update View
        this.currentData.enqueue(this.retrievalMethod(start, end));

        if (this.onDataReceived) {
            this.onDataReceived();
        }
    }

    setViewWindow(pointsToShow) {
        if (pointsToShow < 0) {
            this.logger.log("setViewWindow", `Cannot show this number of points: pointsToShow == ${pointsToShow}`);
            return;
        }

        this.viewWindow = pointsToShow;
        // this.currentData.setBufferLength(pointsToShow);
        let dataToShow = this.currentData.rangeRecent(this.viewWindow);
        // this.logger.logObject("setViewWindow", dataToShow);
        this.view.setData(dataToShow);
        if (this.view.svg) { // check if svg was initialized, causes error if not (once)
            this.view.updateView();
        }
    }

    updateView() {
        // this.logger.log("updateView", "called.");
        let dataToShow = this.currentData.rangeRecent(this.viewWindow);
        this.view.setData(dataToShow);
        this.view.updateView();
    }

    setDataReceiptCallback(cb) {
        this.logger.log("setDataReceiptCallback", "cb received...");
        this.onDataReceived = cb;
    }


    // can be used to automatically retrieve data (if not using push)
    setAutoPullPoll(interval) {
        if (interval > 0) {
            this.pullpollInterval = interval;
        }
        if (this.autoPullPoll) {
            this.stopAutoPullPoll()
        }

        // make sure chart can keep up with data!
        this.view.setTransitionRate(this.pullpollInterval);

        this.autoPullPoll = setInterval(
            function () {
                switch (this.retrievalType) {
                    case 2:
                        pull();
                        break;
                    case 3:
                        poll();
                        break;
                    default:
                        this.logger.log("setAutoPullPoll", `Could not set auto retrieval for this.retrievalType = ${this.retrievalType}`);
                        break;
                }
            }, this.pullpollInterval);
    }

    stopAutoPullPoll() {
        if (this.autoPullPoll) {
            clearInterval(this.autoPullPoll);
        }
    }
}