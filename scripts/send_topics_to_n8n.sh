#!/bin/bash

# Function to URL-encode strings
urlencode() {
  local string="${1}"
  local encoded=""
  local pos c o
  
  for (( pos=0 ; pos<${#string} ; pos++ )); do
    c=${string:$pos:1}
    case "$c" in
      [-_.~a-zA-Z0-9] ) o="${c}" ;;
      * ) printf -v o '%%%02x' "'$c"
    esac
    encoded+="${o}"
  done
  echo "${encoded}"
}

# Base URL
base_url="https://n8n.pistachio.blueshroomhomestead.com/webhook/research-topic"

# Topic 1: Bitcoin Reserve Bill
topic1=$(urlencode "Bitcoin Reserve Bill and Cryptocurrency Adoption")
echo "Sending topic 1: $topic1"
curl -s "${base_url}?topic=${topic1}" > /dev/null
echo "Topic 1 sent"
sleep 5

# Topic 2: Michael Saylor's influence on institutional crypto investment
topic2=$(urlencode "Michael Saylor's Influence on Institutional Cryptocurrency Investment")
echo "Sending topic 2: $topic2"
curl -s "${base_url}?topic=${topic2}" > /dev/null
echo "Topic 2 sent"
sleep 5

# Topic 3: AI integration with blockchain
topic3=$(urlencode "Integration of AI Companies with Blockchain and Web3 Technologies")
echo "Sending topic 3: $topic3"
curl -s "${base_url}?topic=${topic3}" > /dev/null
echo "Topic 3 sent"
sleep 5

# Topic 4: Biometrics and blockchain
topic4=$(urlencode "Biometric Technology and Blockchain for Secure Identity Verification")
echo "Sending topic 4: $topic4"
curl -s "${base_url}?topic=${topic4}" > /dev/null
echo "Topic 4 sent"

echo "All topics submitted to the ResearchTopic workflow"
