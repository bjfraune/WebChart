// import { WebChart } from "../src/WebChart.js";
import { Model } from "../src/Model/Model.js";
import { View } from "../src/View/View.js";
import { Controller } from "../src/Controller/Controller.js";

var myModel, myView, myController;

window.addEventListener('load', function () {
    setupChart();
});

function setupChart() {
    myView = new View("chartContent");
    myModel = new Model(myView);
    myController = new Controller(myModel);
}