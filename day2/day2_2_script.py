boxIds = []
offByOneIds = []

with open("day2_1_input.txt") as fileData:
    data = fileData.read().splitlines()
    for val in data:
        boxIds.append(val)

for boxId in boxIds:
    for boxIdCheck in boxIds:
        # print("Checking 1: {} against 2: {}".format(boxId, boxIdCheck))
        differenceArray = [i for i in range(len(boxId)) if boxId[i] != boxIdCheck[i]]
        if len(differenceArray) == 1:
            offByOneIds.append([boxId, boxIdCheck])

print(offByOneIds)
