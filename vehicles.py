class Vehicle:

    def __init__(self):
        self.x, self.y = 0, 0
        self.assigned_rides = []
        self.time = 0

    def __str__(self):
        return "Vehicle[Position = [{x},{y}], assigned_rides={assigned_rides}, StepCounter = {time}]".format(**self.__dict__)

    def distance_from_ride(self, ride):
        return abs(self.x - ride.x_start) + abs(self.y - ride.y_start)

    def assign_ride(self, ride):
        self.time = self.time + ride.earliest_start
        self.assigned_rides.append(ride.i)
        self.x, self.y = ride.x_end, ride.y_end
        self.time = self.time + ride.distance









