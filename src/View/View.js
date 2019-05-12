import { Logger } from "../Common/Logger.js";

const DEFAULT_MARGIN = 50, DEFAULT_VIEW_WINDOW = 16;

export class View {
    logger; container; chartWidth; chartHeight; margin; viewWindow; xScale; yScale;

    /*
        containerClass: string - HTML element class to contain chart
    */
    constructor() {
        this.logger = new Logger("View.js");
    }

    setContainerClass(containerClass){
        this.container = d3.select(`.${containerClass}`);
    }

    setChartMargins(newTop, newRight, newBottom, newLeft) {
        // SPIKE: Allowing negative values: valid in css, what about svg?
        this.margin = { top: newTop, right: newRight, bottom: newBottom, left: newLeft }
    }

    setChartWidth(pixels) {
        this.chartWidth = (pixels - this.margin.right - this.margin.left > 0) ? pixels : parseFloat(this.container.style("width"));
    }

    setChartHeight(pixels) {
        this.chartHeight = (pixels - this.margin.top - this.margin.bottom > 0) ? pixels : parseFloat(this.container.style("height"));
    }

    setViewWindow(dataPoints) {
        if (dataPoints > 0) {
            this.viewWindow = dataPoints;
        }
    }

    setXScale() {
        // TODO: Don't assume scaleType == Linear
        this.xScale = d3.scaleLinear()
            .domain([0, this.viewWindow])
            .range([0, this.chartWidth]);
    }

    setYScale() {
        // TODO: Don't assume scaleType == Linear
        this.yScale = d3.scaleLinear()
            .domain([0, 1]) // adjust to data min/max
            .range([this.chartHeight, 0]);
    }

}