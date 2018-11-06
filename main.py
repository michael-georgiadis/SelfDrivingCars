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


def find_best_ride(vehicle, list_of_rides):
    distances = []
    for i in range(len(list_of_rides)):
        distances.append([i, vehicle.distance_from_ride(list_of_rides[i])])
    distances.sort(key=operator.itemgetter(1))
    return distances[0][0]


def find_best_vehicle(ride, list_of_vehicles):
    distances = []
    for i in range(len(list_of_vehicles)):
        distances.append([i, ride.distance_from_vehicle(list_of_vehicles[i])])
    distances.sort(key=operator.itemgetter(1))
    return distances[0][0]


def assign_first_batch_of_rides(list_of_rides, list_of_vehicles):
    for i in range(len(list_of_vehicles)):
        list_of_vehicles[i].assign_ride(list_of_rides[i])
        list_of_rides.pop()

    return list_of_vehicles,list_of_rides


def assign_remaining_rides(list_of_rides, list_of_vehicles):
    while len(list_of_rides)> 0:
        if len(list_of_vehicles) <= len(list_of_rides):
            for i in range(len(list_of_vehicles)):
                index = find_best_ride(vehicle=list_of_vehicles[i], list_of_rides=list_of_rides)
                list_of_vehicles[i].assign_ride(list_of_rides[index])
                list_of_rides.pop(index)
        else:
            for i in range(len(list_of_rides)):
                index = find_best_vehicle(ride=list_of_rides[i], list_of_vehicles=list_of_vehicles)
                list_of_vehicles[index].assign_ride(list_of_rides[i])
                list_of_rides.pop()

    return list_of_rides



def print_object_list(object_list):
    for i in range(len(object_list)):
        print(object_list[i])


rows, columns, bonus, steps, ride_list, vehicle_list = read_input('a_example.in')
ride_list.sort(key=operator.attrgetter('earliest_start', 'distance_from_grid_start', 'distance'))
print_object_list(ride_list)
vehicle_list, ride_list = assign_first_batch_of_rides(ride_list, vehicle_list)
vehicle_list.sort(key=operator.attrgetter('time'))
print_object_list(ride_list)
#assign_remaining_rides(ride_list, vehicle_list)
print_object_list(vehicle_list)

