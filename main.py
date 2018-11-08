from vehicles import Vehicle
from rides import Ride
from grid import Grid
import operator


def read_input(in_file):
    rides_list = []

    with open(in_file, 'r') as file:
        r, c, f, n, b, t = [int(x) for x in file.readline().strip().split()]
        grid_layout = Grid(r, c, t, b)
        for n in range(n):
            x1, y1, x2, y2, t1, t2 = [int(x) for x in file.readline().strip().split()]
            rides_list.append(Ride(n, x1, y1, x2, y2, t1, t2))

    vehicles_list = [Vehicle() for _ in range(f)]
    return grid_layout, rides_list, vehicles_list


def print_object_list(object_list):
    for i in range(len(object_list)):
        print(object_list[i])


def unassigned_ride_exists(list_of_rides):
    assigned_rides_bool = []
    for i in range(len(list_of_rides)):
        assigned_rides_bool.append(list_of_rides[i].over)
    if False in assigned_rides_bool:
        return True
    else:
        return False


def get_unassigned_rides(list_of_rides):
    list_of_unassigned_rides = []
    for i in range(len(list_of_rides)):
        if not list_of_rides[i].over:
            list_of_unassigned_rides.append(list_of_rides[i])

    return list_of_unassigned_rides


def first_sorting(list_of_rides):
    list_of_rides.sort(key=operator.attrgetter('real_earliest_start', 'distance_from_grid_start', 'distance'))
    return list_of_rides


def vehicles_available(list_of_vehicles, current_step):
    available_vehicles_bool = []
    for j in range(len(list_of_vehicles)):
        list_of_vehicles[j].is_moving(current_step=current_step)
    for i in range(len(list_of_vehicles)):
        available_vehicles_bool.append(list_of_vehicles[i].moving)
    if False in available_vehicles_bool:
        return True
    else:
        return False


def find_index_of_best_vehicle(ride, list_of_vehicles):
    distances = []

    for i in range(len(list_of_vehicles)):
        if not list_of_vehicles[i].moving:
            distances.append([i, ride.distance_from_vehicle(list_of_vehicles[i])])
    distances.sort(key=operator.itemgetter(1))
    index_of_best_vehicle = distances[0][0]
    return index_of_best_vehicle


def assign_rides(town, list_of_rides, list_of_vehicles):
    for i in range(town.total_steps):
        if unassigned_ride_exists(list_of_rides):
            list_of_rides = get_unassigned_rides(list_of_rides)
            for j in range(len(list_of_rides)):
                if vehicles_available(list_of_vehicles, i):
                    print(i)
                    index = find_index_of_best_vehicle(list_of_rides[j], list_of_vehicles)
                    if list_of_vehicles[index].can_finish(list_of_rides[j], grid.total_steps):
                        list_of_vehicles[index].assign_ride(list_of_rides[j])
                        list_of_rides[j].over = True
        else:
            break
    return list_of_rides, list_of_vehicles


grid, ride_list, vehicle_list = read_input('a_example.in')
ride_list = first_sorting(ride_list)
ride_list, vehicle_list = assign_rides(grid, ride_list, vehicle_list)
print_object_list(vehicle_list)