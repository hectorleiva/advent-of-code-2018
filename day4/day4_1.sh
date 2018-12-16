#!/bin/bash

while IFS='' read -r value || [[ -n "$value" ]]; do
    date=$(echo $value | grep -Eo '^\[(.*?)\]' | grep -Eo '[0-9]{1,9}-[0-9]{1,2}-[0-9]{1,2}')
    time=$(echo $value | grep -Eo '^\[(.*?)\]' | grep -Eo '[0-9]{2}:[0-9]{2}')
    id=$(echo $value | grep -Eo '#[0-9]{1,5}' | sed 's/#//g')

    if [[ -n $id ]]; then
        echo "$date;$time;.;$id" >> "survillance_times_$1"
    else
        if [[ $value == *"wakes up"* ]]; then
            echo "$date;$time;." >> "survillance_times_$1"
        else
            echo "$date;$time;#" >> "survillance_times_$1"
        fi
    fi
done < "$1"
