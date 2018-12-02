#!/bin/bash

# This took too long, decided to move to the python version

NUMBER_STATE=0

NUMBER_HISTORY=()
NUMBER_HISTORY+=($NUMBER_STATE)

NUMBER_HISTORY_MATCHES=()

INPUT_VALUES=()

# Setting up all the values within memory
while IFS='' read -r value || [[ -n "$value" ]]; do
    # echo $value
    INPUT_VALUES+=($value)
done < $1

# while IFS='' read -r value || [[ -n "$value" ]]; do
while true; do
    for value in "${INPUT_VALUES[@]}"
    do
        # echo "Incoming number value: $value"

        # echo "Current NUMBER_STATE=$NUMBER_STATE"
        NUMBER_STATE=$(( NUMBER_STATE + $value ))
        # echo "New NUMBER_STATE=$NUMBER_STATE"

        if [[ ${NUMBER_HISTORY[@]} =~ $NUMBER_STATE ]]
        then
            echo "Checking for a possible match within the NUMBER_HISTORY against the new NUMBER_STATE: ${NUMBER_STATE}"
            for elm in "${NUMBER_HISTORY[@]}"
            do
                if [[ $elm == $NUMBER_STATE ]]
                then
                    echo "Match for $NUMBER_STATE within the NUMBER_HISTORY, breaking all the loops"
                    NUMBER_HISTORY_MATCHES+=($NUMBER_STATE)
                    break 3
                fi
            done
        fi

        NUMBER_HISTORY+=($NUMBER_STATE)

        # echo "Updated NUMBER_HISTORY=${NUMBER_HISTORY[@]}"
    done
done
# done < "$1"

# echo "The following numbers appeared more than once in the number history: ${NUMBER_HISTORY_MATCHES[@]}"
# 
# echo "Duplicated Times | Unique Numbers"
# echo ${NUMBER_HISTORY_MATCHES[@]} | tr " " "\n" | sort | uniq -c
