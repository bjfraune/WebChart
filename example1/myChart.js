// import { WebChart } from "../src/WebChart.js";
import { updateInterval, updateValuesToGenerate, startGenerating, stopGenerating, setPushFunction, clearPushFunction, pull, poll } from "./data-gen.js";
import { Model } from "../src/Model/Model.js";
import { View } from "../src/View/View.js";
import { Controller } from "../src/Controller/Controller.js";

var myModel, myView, myController;

window.addEventListener('load', function () {
    setupChart();

    document.getElementById("myChartUpdate").addEventListener("click", function () {
        let newWindow = document.getElementById("myChartWindow").value;
        // console.log(newWindow);
        myController.setViewWindow(newWindow);
    });

    document.getElementById("myChartPause").addEventListener("click", function () {
        // pause handler
    })
    document.getElementById("myChartResume").addEventListener("click", function () {
        // resume handler
    })

});

function setupChart() {
    // startGenerating();
    // setInterval(1000);
    // setValuesToGenerate(20);

    // Safest to first initialize MVC
    myView = new View("chartContent");
    myModel = new Model(myView);
    myController = new Controller(myModel, false);

    // Next we can start setting details (some dependencies)
    myModel.setRetrievalMethod("push", setPushFunction);

    sleep(1000).then(() => {
        console.log("Time to set up chart...");
        myController.setViewWindow(10);

        myView.setChartMargins(null, null, null, null);
        myView.setChartWidth(700);
        myView.setChartHeight(500);
        myView.setXScale();
        myView.setYScale();
        myView.setLine();
        myView.setChart();

        myController.setKeepViewUpdated(true);
    });

}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}