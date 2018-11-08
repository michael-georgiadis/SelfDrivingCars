class Ride:

    def __init__(self, i, x_start, y_start, x_end, y_end, earliest_start, latest_finish):
        self.i = i
        self.x_start = x_start
        self.y_start = y_start
        self.x_end = x_end
        self.y_end = y_end
        self.earliest_start = earliest_start
        self.latest_finish = latest_finish
        self.over = False
        self.distance = abs(x_start - x_end) + abs(y_start - y_end)
        self.distance_from_grid_start = x_start + y_start
        if self.distance_from_grid_start > self.earliest_start:
            self.earliest_start = self.distance_from_grid_start

    def __str__(self):
        return "Ride[index={i}, StartInt=[{x_start},{y_start}], DestinationInt=[{x_end},{y_end}], " \
               "EarliestStart={earliest_start}, LatestFinish={latest_finish}, StepsRequiredToEnd={distance}]"\
            .format(**self.__dict__)

    def __lt__(self, other):
        return self.earliest_start < other.earliest_start or self.earliest_start == other.earliest_start\
               and self.latest_finish < other.latest_finish

    def distance_from_vehicle(self, vehicle):
        return abs(self.x_start - vehicle.x) + abs(self.y_start - vehicle.y)
