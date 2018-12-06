#!/bin/bash

# Used to convert the data from day3 into a string that can easily be split up by another program/language
# Splitting on the ";"

while IFS='' read -r value || [[ -n "$value" ]]; do
    Id=$(echo $value | grep -Eo '^#[0-9]{1,9}')
    StartingCoordinates=$(echo $value | grep -Eo '[0-9]{1,9},[0-9]{1,9}')
    Size=$(echo $value | grep -Eo '[0-9]{1,9}x[0-9]{1,9}')

    echo "$Id;$StartingCoordinates;$Size" >> "collated_$1"
done < "$1"
