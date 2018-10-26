import numpy as np

data = np.genfromtxt('a_example.in', delimiter=' ')
data = data.astype(int, copy=False)

# Initializing the data needed to solve the problem
rows = data[0][0]
columns = data[0][1]
vehicles = data[0][2]
rides = data[0][3]
bonus = data[0][4]
latestFinish = data[0][5]
data = np.delete(data, 0, 0)


# Start Intersection, End Intersection, Earliest Start, Latest Finish of the array
startInt = np.asarray([i[0:2] for i in data])
endInt = np.asarray([i[2:4] for i in data])
earliestStart = np.asarray(([i[4] for i in data]))
latestFinish = np.asarray([i[5] for i in data])


score = earliestStart+latestFinish/(abs(startInt[:, 0] - endInt[:, 0]) + abs(startInt[:, 1] - endInt[:, 1]))
data = np.column_stack(([data, score]))
print(data)

"""
for i in range(rides):
    print("Start Intersection for vehicle", str(i+1), ":\n", startInt[i])
    print("End Intersection for vehicle", str(i+1), ":\n", endInt[i])
    print("Earliest Start for vehicle", str(i+1), ":\n", earliestStart[i])
    print("Latest Finish for vehicle", str(i+1), ":\n", latestFinish[i])
"""