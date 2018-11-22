/// <reference path="../node_modules/@types/d3/index.d.ts"/>
import { IGrid, IPoint, ITimeSpan, IRide } from "./sdc-types"
import { Board } from "./visual"

const board = new Board({
    columns: 10, rows: 10,
    current_step: 0, total_steps: 10,
    bonus: 2
}, 35, 5);

board.drawBoard("#grid");

board.addCars([{
    destination: { col: 5, row: 5 },
    position: { col: 1, row: 8 },
    bonus: 0
}, {
    destination: { col: 5, row: 5 },
    position: { col: 1, row: 1 },
    bonus: 0
}, {
    destination: { col: 6, row: 6 },
    position: { col: 10, row: 1 },
    bonus: 0
}]);

const rideGen = board.generateRides(25);
const rides = Array.from({ length: 10 }, (_, i) => rideGen.next().value);
board.addRides(rides)


function btnUpdate_Click(e: MouseEvent) {
    const cars = board.cars;

    for (let car of cars) {
        car.position = board.moveOneStepToDestination(car.position, car.destination);
        if (!!car.ride) car.ride.position = car.position;
    }
    board.updateCars(cars)
    board.updateRides(board.currentStep++, board.rides);
    document.getElementById("StepCounter")!.innerText = board.currentStep.toString();
}

document.getElementById("btnUpdate")!.addEventListener("click", btnUpdate_Click)