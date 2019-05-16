import { Logger } from "../Common/Logger.js";

const DEFAULT_MARGIN = 50;

export class View {
    container; chartWidth; chartHeight; margin; xScale; yScale; svg;
    chartTransitions = 500;

    // Testing specs: Should implement a setter for these
    chartType = "line";
    scaleType = "linear";

    // for locating x and y vars in the object... should allow user to set for custom json...
    xDataIndex = 0;
    yDataIndex = 1;

    /*
        containerClass: string - HTML element class to contain chart
    */
    constructor(chartClass) {
        this.logger = new Logger("View.js");

        this.chartClass = chartClass;
    }

    setData = (data) => {
        if (!data[0]) {
            this.logger.log("setData", `Empty data passed in.`);
            return;
        }
        // this.logger.logObject("setData", data);
        // this.logger.log("setData", `Updating data! data.length = ${data.length}`);
        this.data = data;
        // TODO: Update View...

        this.keys = Object.keys(this.data[0]);
        this.xKey = this.keys[0];
        this.yKey = this.keys[1];

        this.updateMinMax();
    }

    setContainerClass(containerClass) {
        this.container = d3.select(`.${containerClass}`);
    }

    setChartMargins(newTop, newRight, newBottom, newLeft) {
        // SPIKE: Allowing negative values: valid in css, what about svg?
        newTop = (newTop > 0) ? newTop : DEFAULT_MARGIN;
        newRight = (newRight > 0) ? newRight : DEFAULT_MARGIN;
        newBottom = (newBottom > 0) ? newBottom : DEFAULT_MARGIN;
        newLeft = (newLeft > 0) ? newLeft : DEFAULT_MARGIN;

        this.margin = { top: newTop, right: newRight, bottom: newBottom, left: newLeft }
    }

    setChartWidth(pixels) {
        this.chartWidth = (pixels - this.margin.right - this.margin.left > 0) ? (pixels - this.margin.right - this.margin.left) : (parseFloat(this.container.style("width")) - this.margin.right - this.margin.left);
        // this.logger.log("setChartWidth", `this.chartWidth = ${this.chartWidth}`);
    }

    setChartHeight(pixels) {
        this.chartHeight = (pixels - this.margin.top - this.margin.bottom > 0) ? (pixels - this.margin.top - this.margin.bottom) : (parseFloat(this.container.style("height")) - this.margin.top - this.margin.bottom);
    }

    setViewWindow(dataPoints) {
        if (dataPoints > 0) {
            this.viewWindow = dataPoints;
        }
    }

    setXScale = () => {
        // this.logger.logObject("setXScale", this.data);

        // TODO: Don't assume scaleType == Linear
        // this.logger.log("setXScale", `this.data.length = ${this.data.length}`);
        switch (this.scaleType) {
            case "linear":
                this.xScale = d3.scaleLinear()
                    .domain([this.dataXMin, this.dataXMax])
                    .range([0, this.chartWidth]);
                break;
            case "log":
                this.xScale = d3.scaleLog()
                    .domain([this.dataXMin, this.dataXMax])
                    .range([0, this.chartWidth]);
                break;
            default:
                this.logger.log("setXScale", `The specified scale is not implemented: this.scaleType == ${this.scaleType}`);
                break;
        }

        // this.logger.log("setXScale", `this.xScale is set = ${this.xScale}`);
        // this.logger.log("setXScale", `typeof this.xScale == ${typeof this.xScale}`);
    }

    setYScale = (min, max) => {
        // TODO: Don't assume scaleType == Linear
        // this.logger.log("setYScale", `this.data.length = ${this.data.length}`);

        switch (this.scaleType) {
            case "linear":
                this.yScale = d3.scaleLinear()
                    .domain([this.dataYMin, this.dataYMax])
                    .range([this.chartHeight, 0]);
                break;
            case "log":
                this.yScale = d3.scaleLog()
                    .domain([this.dataYMin, this.dataYMax])
                    .range([this.chartHeight, 0]);
                break;
            default:
                this.logger.log("setXScale", `The specified scale is not implemented: this.scaleType == ${this.scaleType}`);
                break;
        }

    }

    setLine = () => {
        // TODO: allow specification of curve
        let that = this;
        this.line = d3.line()
            .x(function (d, i) {
                // that.logger.logObject("setLine", d);
                // that.logger.log("setLine", `i == ${i}, that.data[i][that.keys[0]] == ${that.data[i][that.keys[0]]}`);
                return that.xScale(d[that.keys[0]]);
            })
            .y(function (d) {
                // that.logger.log("setLIne", `d[that.yKey] == ${d[that.yKey]}`);
                return that.yScale(d[that.yKey]);
            })
            // .curve(d3.curveMonotoneX);
            .curve(d3.curveLinear);
        // .curve(d3.curveNatural);


        // this.logger.log("setLine", "Complete.");
    }

    // can stack data by calling setChart twice, with out reselecting/appending the svg, or rewriting the labels...
    setChart = () => {
        let that = this;

        this.svg = d3.select(`.${this.chartClass}`).append("svg")
            .attr("width", this.chartWidth + this.margin.left + this.margin.right)
            .attr("height", this.chartHeight + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

        // 3. Call the x axis in a group tag
        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0, ${this.chartHeight})`)
            .call(d3.axisBottom(this.xScale)); // Create an axis component with d3.axisBottom

        // 4. Call the y axis in a group tag
        this.svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(this.yScale)); // Create an axis component with d3.axisLeft

        // 9. Append the path, bind the data, and call the line generator 
        this.svg.append("path")
            .datum(this.data) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .attr("d", this.line); // 11. Calls the line generator 

        // 12. Appends a circle for each datapoint
        this.svg.selectAll(".dot")
            .data(this.data)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) {
                // that.logger.logObject("setChart", d);
                // that.logger.log("setChart", `i == ${i}`);
                return that.xScale(that.data[i][that.keys[0]])
            })
            .attr("cy", function (d) {
                // that.logger.log("setChart", `typeof d[that.yKey] == ${typeof d[that.yKey]}`);
                return that.yScale(d[that.yKey])
            })
            .attr("r", 5)
            .on("mouseover", function (a, b, c) {
                console.log(a);
                // that.attr('class', 'focus');
            })
            .on("mouseout", function () { });

        // add labels
        this.svg
            .append("text")
            .attr("transform", `translate(-35,${(this.chartHeight + this.margin.bottom) / 2}) rotate(-90)`)
            .text(this.keys[1]);

        this.svg
            .append("text")
            .attr("transform", `translate(${(this.chartWidth / 2)}, ${(this.chartHeight + this.margin.bottom - 5)})`)
            .text(this.keys[0]);
    }

    updateView = () => {
        // if(!this.data[0]){
        //     this.logger.log("updateView", `Called with nothing to display!`);
        //     return;
        // }
        let that = this;

        this.setXScale();
        this.setYScale();
        // if no axis exists, create one, otherwise update it
        // if (this.svg.selectAll(".y.axis").empty()) {
        //     this.logger.log("updateView", ".y.axis empty");
        //     this.svg.append("g")
        //         .attr("class", "y axis")
        //         .call(d3.axisLeft(this.yScale));
        // } else {
        //     this.logger.log("updateView", ".y.axis not empty");
        this.svg.selectAll(".y.axis")
            .transition().duration(this.chartTransitions)
            .call(d3.axisLeft(this.yScale));
        // }

        this.svg.selectAll(".x.axis")
            .transition().duration(this.chartTransitions)
            .call(d3.axisBottom(this.xScale));

        this.svg.select(".line")
            .datum(this.data) // 10. Binds data to the line 
            .attr("class", "line") // Assign a class for styling 
            .transition().duration(this.chartTransitions)
            .attr("d", this.line); // 11. Calls the line generator 

        // TODO: Don't remove all, be efficient and just remove the old dots...
        this.svg.selectAll(".dot").remove();
        this.svg.selectAll(".dot")
            .data(this.data)
            .enter().append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            // .transition().duration(this.chartTransitions)
            .attr("cx", function (d, i) {
                // that.logger.logObject("setChart", d);
                // that.logger.log("setChart", `i == ${i}`);
                return that.xScale(d[that.keys[0]])
            })
            .attr("cy", function (d) {
                // that.logger.log("setChart", `typeof d[that.yKey] == ${typeof d[that.yKey]}`);
                return that.yScale(d[that.yKey])
            })
            .attr("r", 5)
            .on("mouseover", function (a, b, c) {
                console.log(a);
                // that.attr('class', 'focus');
            })
            .on("mouseout", function () { });

    }

    setTransitionRate(newTransitionRate) {
        if (newTransitionRate > 0) {
            this.chartTransitions = newTransitionRate;
        }
    }

    updateMinMax() { // try substituting d3.max......
        if (!this.data) {
            this.logger.log("getMinMax", `invalid this.data ==  ${this.data}`);
            return [-1, 1]; // display something??
        }

        // if (values.length <= keyIndex) {
        // just return this object's values if there is only one??
        // }

        // take keys of first object, assume all same structure
        let keys = Object.keys(this.data[0]); // TODO: Dynamix

        this.dataXMin = this.data[0][keys[this.xDataIndex]];
        this.dataXMax = this.data[0][keys[this.xDataIndex]];

        this.dataYMin = this.data[0][keys[this.yDataIndex]];
        this.dataYMax = this.data[0][keys[this.yDataIndex]];

        // already captured object 0 min/max, start on object 1
        for (let i = 1; i < this.data.length; i++) {
            if (this.data[i][keys[this.xDataIndex]] < this.dataXMin) {
                this.dataXMin = this.data[i][keys[this.xDataIndex]];
            }
            if (this.data[i][keys[this.xDataIndex]] > this.dataXMax) {
                this.dataXMax = this.data[i][keys[this.xDataIndex]];
            }
            if (this.data[i][keys[this.yDataIndex]] < this.dataYMin) {
                this.dataYMin = this.data[i][keys[this.yDataIndex]];
            }
            if (this.data[i][keys[this.yDataIndex]] > this.dataYMax) {
                this.dataYMax = this.data[i][keys[this.yDataIndex]];
            }
        }
    }
}
