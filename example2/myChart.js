// import { WebChart } from "../src/WebChart.js";
import { Model } from "./Model/Model.js";
import { View } from "./View/View.js";
import { Controller } from "./Controller/Controller.js";

var myModel, myView, myController;

window.addEventListener('load', function () {
    setupChart();
});

function setupChart() {
    myView = new View(true, "chartContent", );
}