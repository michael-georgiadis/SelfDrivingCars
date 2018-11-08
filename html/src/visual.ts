/// <reference path="../node_modules/@types/d3/index.d.ts"/>
import { IGrid, IPoint, ITimeSpan, IRide } from "./sdc-types";
import * as d3 from "d3";

class Board {
    options: IGrid;
    edgeLength: number = 25;
    gridElement: any;

    constructor(grid: IGrid) {
        this.options = grid;
    }

    public draw(gridSelector: string, edgeLength: number) {
        const options = this.options;
        this.edgeLength = edgeLength;
        this.gridElement = null;
        const data: { point: IPoint, edgelength: number } = new Array(options.rows * options.columns).fill({});
        const element = d3
            .select(gridSelector)
            .attr("width", "800px")
            .attr("height", "800px");

    }
}