#!/bin/bash

twoMatchedHistory=0
threeMatchedHistory=0

while IFS='' read -r value || [[ -n "$value" ]]; do
	# echo "Value incoming: $value"
    UNIQCHARS=$(echo $value | grep -o . | sort -u)
	# echo "uniques: $UNIQCHARS"

	twoMatched=false
	threeMatched=false

	exploded=($UNIQCHARS)
	for characterValue in "${exploded[@]}"
		do
			matchedVal=$(echo $value | tr -cd $characterValue | wc -c)
			if [ $matchedVal == 2 ] && [ $twoMatched == false ]; then
				twoMatched=true
				twoMatchedHistory=$(( $twoMatchedHistory + 1 ))
			fi
			if [ $matchedVal == 3 ] && [ $threeMatched == false ]; then
				threeMatched=true
				threeMatchedHistory=$(( $threeMatchedHistory + 1 ))
			fi
		done	
	# echo "$value twomatched: $twoMatched and/or threematched: $threeMatched"
	# echo "twoMatchedHistory: $twoMatchedHistory, threeMatchedHistory: $threeMatchedHistory"
	echo "Final checkSumVal: $(( $twoMatchedHistory * $threeMatchedHistory ))"
done < "$1"
