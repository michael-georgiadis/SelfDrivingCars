import numpy as np

data = np.genfromtxt('C:\\Users\geog\\source\\repos\\SelfDrivingRides\\a_example.in', delimiter=' ')
data = data.astype(int, copy=False)
rows = data[0][0]
columns = data[0][1]
vehicles = data[0][2]
rides = data[0][3]
bonus = data[0][4]
latestFinish = data[0][5]
data = np.delete(data,0,0)
startInt = np.asarray([i[0:2] for i in data])
endInt = np.asarray([i[2:4] for i in data])
earliestStart = np.asarray(([i[4] for i in data]))
latestFinish = np.asarray([i[5] for i in data])

for i in range(rides):
    print("Start Intersection for vehicle " + str(i) + " :\n" +startInt[i])
    print("End Intersection for vehicle "  + str(i) + " :\n" + endInt[i])
    print("Earliest Start for vehicle " +str(i) + " :\n", earliestStart[i])
    print("Latest Finish for vehicle " + str(i) + ": \n", latestFinish[i])
