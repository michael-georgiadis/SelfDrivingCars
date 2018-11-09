/// <reference path="../node_modules/@types/d3/index.d.ts"/>
import { IGrid, IPoint, ITimeSpan, IRide } from "./sdc-types"
import { Board } from "./visual"

const board = new Board({
    columns: 10, rows: 10,
    current_step: 0, total_steps: 10,
    bonus: 2
}, 35, 5);

board.drawBoard("#grid");

board.refreshCars([{
    destination: { col: 5, row: 5 },
    position: { col: 1, row: 8 },
    bonus: 0
}]);
