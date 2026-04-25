#!/bin/bash
set -e

echo "Submitting job through frontend..."
# Step 1: Submit job to the frontend
RESPONSE=$(curl -s -X POST http://localhost:3000/submit)
JOB_ID=$(echo $RESPONSE | jq -r '.job_id')

if [ "$JOB_ID" == "null" ] || [ -z "$JOB_ID" ]; then
  echo "Failed to submit job. Response: $RESPONSE"
  exit 1
fi

echo "Job ID received: $JOB_ID. Polling status..."

# Step 2: Poll status
ATTEMPTS=0
MAX_ATTEMPTS=30 # 30 attempts x 2 seconds = 60 seconds timeout

while [ $ATTEMPTS -lt $MAX_ATTEMPTS ]; do
  STATUS_RES=$(curl -s http://localhost:3000/status/$JOB_ID)
  STATUS=$(echo $STATUS_RES | jq -r '.status')
  
  echo "Current Status: $STATUS"
  
  # Step 3: Assert final status
  if [ "$STATUS" == "completed" ]; then
    echo "Success! Job completed as expected."
    exit 0
  elif [ "$STATUS" == "failed" ]; then
    echo "Job failed in the backend!"
    exit 1
  fi

  ATTEMPTS=$((ATTEMPTS+1))
  sleep 2
done

echo "Integration test timed out after 60 seconds!"
exit 1
