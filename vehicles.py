class Vehicle:

    def __init__(self):
        self.x, self.y = 0, 0
        self.assigned_rides = []

    def __str__(self):
        return "Vehicle[{x},{y},assigned_rides={assigned_rides}]".format(**self.__dict__)

    def distance_from_ride(self, ride):
        return abs(self.x - ride.x_start) + abs(self.y - ride.y_start)

    def assign_ride(self, ride):
        self.assigned_rides.append(ride.i)
        self.x, self.y = ride.x_end, ride.y_end






