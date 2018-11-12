import { IGrid, IPoint, ITimeSpan, IRide, IIntersection, IGridData, IVehicle } from "./sdc-types";
import * as d3 from "d3";

interface Iterator<IIntersection> {
    [Symbol.iterator](): IterableIterator<IIntersection>;
}

export class Board {
    currentStep: number = 0;
    options: IGrid;
    edgeLength: number;
    padding: number;
    gridElement: d3.Selection<d3.BaseType, {}, HTMLElement, any> = <any>{};
    data: IGridData[];
    intersectionCoordinates: IPoint[][];
    cars: IVehicle[];
    rides: IRide[];
    constructor(grid: IGrid, edgeLength: number, padding: number) {
        this.options = grid;
        this.edgeLength = edgeLength;
        this.padding = padding;
        this.intersectionCoordinates = Array.from({ length: grid.rows + 1 },
            (_, rowIndex) => Array.from({ length: grid.columns + 1 },
                (_, columnIndex) => <IPoint>{ x: columnIndex, y: rowIndex + 1 }));
        this.cars = [];
        this.rides = [];
        this.data = this.refreshData(grid);
    }

    public static randomFromRangeInclusive(start: number, stop: number) {
        return Math.round(Math.random() * (stop - start)) + start;
    }
    public *generateRides(maxDuration: number = 10) {
        let index = 0;
        while (true) {
            const start = Board.randomFromRangeInclusive(0, 10);
            const stop = Board.randomFromRangeInclusive(start, 10);
            const position = {
                row: Board.randomFromRangeInclusive(0, this.options.rows),
                col: Board.randomFromRangeInclusive(0, this.options.columns)
            }
            const destination = {
                row: Board.randomFromRangeInclusive(0, this.options.rows),
                col: Board.randomFromRangeInclusive(0, this.options.columns)
            }

            yield {
                index: index++,
                available: { start: start, stop: stop },
                position: position,
                start: position,
                stop: destination
            } as IRide
        }
    }

    public refreshData(options: IGrid) {
        const padding = this.padding;
        const edgeLength = this.edgeLength;
        const paddedLength = 2 * padding + edgeLength;
        return Array.from({ length: (options.rows + 1) * (options.columns + 1) }, (_, index) => {
            const value: IGridData = { intersection: { row: 0, col: 0 }, point: { x: 0, y: 0 }, index: index }
            value.intersection.row = Math.floor(index / (options.columns + 1));
            value.intersection.col = index % (options.columns + 1);
            value.point.x = value.intersection.col * paddedLength;
            value.point.y = value.intersection.row * paddedLength;
            value.index = index;

            if (value.intersection.row === 0) value.text = value.intersection.col.toString();
            if (value.intersection.col === 0) value.text = value.intersection.row.toString();

            this.intersectionCoordinates[value.intersection.row][value.intersection.col] =
                {
                    x: value.point.x + paddedLength,
                    y: value.point.y + paddedLength
                };

            return value;
        });
    }

    public drawBoard(gridSelector: string) {
        const options = this.options;
        const padding = this.padding;
        const edgeLength = this.edgeLength;
        const paddedLength = 2 * padding + edgeLength;
        const columns_ = this.options.columns + 1;
        const rows_ = this.options.rows + 1;

        const gridContainer = d3
            .select(gridSelector)
            .append("svg")
            .attr("width", paddedLength * columns_ + paddedLength / 2 + "px")
            .attr("height", paddedLength * rows_ + paddedLength / 2 + "px")
            .append("g");

        gridContainer
            .selectAll(".cell")
            .data(this.data)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("x", d => d.point.x + padding)
            .attr("y", d => d.point.y + padding)
            .attr("width", d => edgeLength)
            .attr("height", d => edgeLength)
            .attr("rx", 3)
            .attr("ry", 3)
            .style("fill", d => {
                if (d.intersection.row == d.intersection.col && d.intersection.row == 1)
                    return "azure";
                else return "#fff"
            })
            .style("stroke", d => {
                if (d.intersection.row === 0 || d.intersection.col === 0 ||
                    d.intersection.row === rows_ || d.intersection.col === columns_)
                    return "";
                else return "#222";
            });

        gridContainer
            .selectAll(".column-label")
            .data(this.data.filter((value, index) => value.intersection.row === 0))// || value.intersection.row === rows_))
            .enter()
            .append("text")
            .attr("class", "column-label")
            .text(d => d.text || "")
            .attr("width", paddedLength - 10)
            .attr("text-anchor", "middle")
            .attr("x", d => d.point.x + paddedLength)
            .attr("y", d => d.point.y + paddedLength - 10)

        gridContainer
            .selectAll(".row-label")
            .data(this.data.filter((value, index) => value.intersection.col === 0))// || value.intersection.col === columns_))
            .enter()
            .append("text")
            .attr("class", "row-label")
            .text(d => d.text || "")
            //.attr("width", paddedLength - 10)
            .attr("text-anchor", "end")
            .attr("x", d => d.point.x + paddedLength - 10)
            .attr("y", d => d.point.y + paddedLength + 3)

        gridContainer
            .selectAll(".xing")
            .data(Array.from({ length: rows_ * columns_ }, (_, index) => index))
            .enter()
            .append("circle")
            .attr("class", "xing")
            .attr("cx", index => this.intersectionCoordinates[Math.floor(index / columns_)][index % columns_].x - 1.5)
            .attr("cy", index => this.intersectionCoordinates[Math.floor(index / columns_)][index % columns_].y - 1.5)
            .attr("r", 3)
            .attr("fill", "#00f")
            .attr("opacity", .05)

        this.gridElement = gridContainer;
    }

    public moveOneStepToDestination(a: IIntersection, b: IIntersection) {

        if (a.col === b.col && a.row === b.row)
            return a;

        const verticalDistance = b.row - a.row;
        const horizontalDistance = b.col - a.col;
        const stepX = Math.sign(horizontalDistance);
        const stepY = Math.sign(verticalDistance);

        const next = Object.assign({}, a);

        if (Math.abs(verticalDistance) > Math.abs(horizontalDistance))
            next.row += stepY;
        else if (Math.abs(verticalDistance) < Math.abs(horizontalDistance))
            next.col += stepX;
        else next.row += stepY;

        return next;
    }

    public *inclusiveIntersectionPath(a: IIntersection, b: IIntersection): Iterator<IIntersection> {
        let current = Object.assign({}, a);

        yield current;

        while (current.col != b.col || current.row != b.row) {
            current = this.moveOneStepToDestination(current, b);
            yield current;
        }
    }

    public *inclusivePointPath(a: IIntersection, b: IIntersection): Iterator<IPoint> {
        //[...this.inclusiveIntersectionPath(a, b)].map(xion => this.intersectionCoordinates[xion.row][xion.col]);
        const iter = this.inclusiveIntersectionPath(a, b);
        for (let xion of iter) {
            yield this.intersectionCoordinates[xion.row][xion.col];
        }
    }

    public polyLinePath(a: IIntersection, b: IIntersection) {
        return [...this.inclusivePointPath(a, b)].map(pnt => `${pnt.x} ${pnt.y}`).join(", ");
    }

    public addCars(cars: IVehicle[]) {
        this.gridElement
            .selectAll(".vehicle")
            .data(cars)
            .enter()
            .append("circle")
            .attr("class", "vehicle")
            .attr("cx", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].x.toString())
            .attr("cy", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].y.toString())
            .attr("r", 5)
            .style("stroke", "#222")
            .style("fill", v => {
                if (v.ride == null) return "green";
                else return "blue";
            });

        this.gridElement
            .selectAll(".vehicle-path")
            .data(cars)
            .enter()
            .append("polyline")
            .attr("class", "vehicle-path")
            .attr("points", d => this.polyLinePath(d.position, d.destination))
            .style("fill", "transparent")
            .style("stroke", "#f00")
            .style("opacity", .5)
            .style("stroke-width", 4);

        this.gridElement
            .selectAll(".vehicle-destination")
            .data(cars)
            .enter()
            .append("circle")
            .attr("class", "vehicle-destination")
            .attr("cx", v =>
                this.intersectionCoordinates[v.destination.row][v.destination.col].x.toString())
            .attr("cy", v =>
                this.intersectionCoordinates[v.destination.row][v.destination.col].y.toString())
            .attr("r", 3)
            .style("fill", "#f00")
            .style("opacity", .5)

        this.cars = cars;
    };

    public updateCars(cars: IVehicle[]) {
        this.gridElement
            .selectAll(".vehicle")
            .data(cars)
            .transition()
            .attr("cx", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].x.toString())
            .attr("cy", v =>
                this.intersectionCoordinates[v.position.row][v.position.col].y.toString());

        this.gridElement
            .selectAll(".vehicle-path")
            .data(cars)
            .transition()
            .attr("points", d => this.polyLinePath(d.position, d.destination))

        this.gridElement
            .selectAll(".vehicle-destination")
            .data(cars)
            .transition()
            .attr("cx", v =>
                this.intersectionCoordinates[v.destination.row][v.destination.col].x.toString())
            .attr("cy", v =>
                this.intersectionCoordinates[v.destination.row][v.destination.col].y.toString());

        this.cars = cars;
    }

    public addRides(rides: IRide[]) {

        const rideLength = 12;

        this.gridElement
            .selectAll(".ride")
            .data(rides)
            .enter()
            .append("rect")
            .attr("class", "ride")
            .attr("x", ride => this.intersectionCoordinates[ride.position.row][ride.position.col].x - rideLength / 2)
            .attr("y", ride => this.intersectionCoordinates[ride.position.row][ride.position.col].y - rideLength / 2)
            .attr("width", rideLength)
            .attr("height", rideLength)
            .attr("opacity", 0.15)
            .style("fill", "#0f0")
            .style("stroke", "#333");

        this.rides = rides;
    }

    public updateRides(currentStep: number, rides: IRide[]) {

        console.log("currentStep", currentStep);

        const rideLength = 10;
        this.gridElement
            .selectAll(".ride")
            .data(rides)
            .attr("opacity", d => {
                if (currentStep < d.available.start)
                    return 1 - (d.available.start - currentStep) / 10;
                else if (currentStep > d.available.stop)
                    return 1 - (currentStep - d.available.stop) / 10;
                else return 1;
            })
            .style("fill", ride => ride.available.stop < currentStep ? "yellow" : "#0f0")
            .attr("x", ride => this.intersectionCoordinates[ride.position.row][ride.position.col].x - rideLength / 2)
            .attr("y", ride => this.intersectionCoordinates[ride.position.row][ride.position.col].y - rideLength / 2);
    }
}