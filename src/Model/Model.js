import { Logger } from "../Common/Logger.js";

export class Model {
    currentData;
    retrievalMethod; // 0 == unspecified/none, 1 == push, 2 == pull, 3 == poll

    constructor(viewModule) {
        this.logger = new Logger("Model.js");
        this.view = viewModule;
        this.retrievalMethod = 0;
    }

    setDataSource(newDataSource) {
        if (!newDataSource) {
            this.logger.log("setDataSource", `Invalid newDataSource = ${newDataSource}`);
        }

        this.dataSource = newDataSource;
    }

    setRetrievalMethod(retrievalMethod, interfaceMethod) {
        if (!retrievalMethod) {
            this.logger.log("setRetrievalMethod", `Invalid retrievalMethod = ${retrievalMethod}`);
        }

        this.interfaceMethod = interfaceMethod;

        switch (retrievalMethod) {
            case "push":
                // interfaceMethod should accept an outside method that it can use to push data to this class
                this.retrievalMethod = 1;
                this.interfaceMethod(this.push);
                break;
            case "pull":
                // interfaceMethod should be a method that provides this class with pull access
                this.retrievalMethod = 2;
                break;
            case "poll":
                // interfaceMethod should be a method that provides this class with poll access
                this.retrievalMethod = 3;
                break;
            default:
                this.retrievalMethod = 0;
                this.logger.log("constructor", `Invalid retrievalMethod = ${this.retrievalMethod}`);
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
    push(datum) {
        if (this.retrievalMethod != 1) {
            return; // Not the current method of input
        }

        // handle input
    }

    /*
        pull single most recent data available from source
    */
    pull() {
        if (this.retrievalMethod != 2) {
            return; // Not the current method of input
        }

        // handle input
        this.retrievalMethod();
    }
    /*
        poll source for a range of data
    */
    poll() {
        if (this.retrievalMethod != 3) {
            return; // Not the current method of input
        }

        // handle input
        this.retrievalMethod();
    }

}