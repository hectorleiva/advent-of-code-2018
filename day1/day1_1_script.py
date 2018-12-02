numberState = 0
searching = True

numberHistory = []
numberHistory.append(numberState)

inputFrequencyVals = []

with open("day1_1_input.txt") as fileData:
    data = fileData.read().splitlines()
    for val in data:
        inputFrequencyVals.append(val)
    print(inputFrequencyVals)

while searching:
    for frequencyVal in inputFrequencyVals:
        # print("FrequencyVal: {}".format(frequencyVal))
        print("NumberState: {}".format(numberState))

        numberState += int(frequencyVal)

        if numberState in numberHistory:
            print("NumberState: {} is within the numberhistory".format(numberState))
            print("ending searching now")
            searching = False
            break

        numberHistory.append(numberState)

        print("new NumberState: {}".format(numberState))

