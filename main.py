from vehicles import Vehicle
from rides import Ride
import operator


def read_input(in_file):
    rides_list = []

    with open(in_file, 'r') as file:
        r, c, f, n, b, t = [int(x) for x in file.readline().strip().split()]
        for n in range(n):
            x1, y1, x2, y2, t1, t2 = [int(x) for x in file.readline().strip().split()]
            rides_list.append(Ride(n, x1, y1, x2, y2, t1, t2))

    cars = [Vehicle() for _ in range(f)]
    return r, c, b, t, rides_list, cars


ride_list = []
vehicle_list = []
rows, columns, bonus, steps, ride_list, vehicle_list = read_input('a_example.in')

ride_list.sort(key=operator.attrgetter('earliest_start', 'distance_from_grid_start', 'distance'))
for i in range(len(ride_list)):
    print(ride_list[i])