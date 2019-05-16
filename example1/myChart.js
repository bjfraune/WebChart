// import { WebChart } from "../src/WebChart.js";
import { setPushFunction, clearPushFunction, pull, poll } from "./data-gen.js";
import { Model } from "../src/Model/Model.js";
import { View } from "../src/View/View.js";
import { Controller } from "../src/Controller/Controller.js";

var myModel, myView, myController;

window.addEventListener('load', function () {
    setupChart();
});

function setupChart() {
    // Safest to first initialize MVC
    myView = new View("chartContent");
    myModel = new Model(myView);
    myController = new Controller(myModel);


    // Next we can start setting details (some dependencies)
    myModel.setRetrievalMethod("push", setPushFunction);

    sleep(5000).then(() => {
        console.log("Time to set up chart...");
        myController.setViewWindow(3);

        myView.setChartMargins(null, null, null, null);
        myView.setChartWidth(700);
        myView.setChartHeight(500);
        myView.setXScale();
        myView.setYScale();
        myView.setLine();
        myView.setChart();
    });


}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}