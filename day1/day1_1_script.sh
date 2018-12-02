#!/bin/bash

NUMBER_STATE=0

while IFS='' read -r value || [[ -n "$value" ]]; do
    # echo "Incoming number value: $value"
    NUMBER_STATE=$(( NUMBER_STATE + $value ))
    echo "New NUMBER_STATE=$NUMBER_STATE"
done < "$1"
