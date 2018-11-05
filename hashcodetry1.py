import numpy as np
import pandas as pd

pd.set_option('display.max_columns', None)


def distance_from_start(dataframe):
    dataframe['ReqSteps'] = dataframe['StartIntX'] + dataframe['StartIntY']
    return dataframe


def replace_earliest_start(dataframe):
    for i in range(number_of_vehicles + 1):
        if dataframe['EarlStart'].iloc[i] < dataframe['ReqSteps'].iloc[i]:
            dataframe['EarlStart'].iloc[i] = dataframe['ReqSteps'].iloc[i]
    return dataframe


def find_steps_for_finish(dataframe):
    dataframe['Steps'] = abs(dataframe['StartIntX'] - dataframe['EndIntX']) + \
                         abs(dataframe['StartIntY'] - dataframe['EndIntY'])
    return dataframe


data = np.genfromtxt('a_example.in', delimiter=' ')
data = data.astype(int, copy=False)

# Initializing the data needed to solve the problem
rows = data[0][0]
columns = data[0][1]
number_of_vehicles = data[0][2]
rides = data[0][3]
bonus = data[0][4]
number_of_steps = data[0][5]
data = np.delete(data, 0, 0)

dataf = pd.DataFrame(data)

dataf.columns = ['StartIntX', 'StartIntY', 'EndIntX', 'EndIntY', 'EarlStart', 'LatFinish']
dataf = distance_from_start(dataf)
dataf = replace_earliest_start(dataf)
dataf = find_steps_for_finish(dataf)
dataf.sort_values(['EarlStart', 'ReqSteps', 'Steps'], ascending=[True, True, True], inplace=True)
ride_list = dataf.index.tolist()
print(ride_list)
vehicle_list = np.zeros(number_of_vehicles, dtype=int)

for i in range(number_of_vehicles):
    vehicle_list[i] = i+1

result_data = pd.DataFrame({'Vehicles': vehicle_list})
