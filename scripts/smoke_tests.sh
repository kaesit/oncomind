#!/usr/bin/env bash
set -e  # Exit immediately if a command exits with a non-zero status

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Error: 'jq' is not installed. Please install it to run this script."
    exit 1
fi

echo "Waiting for services to stabilize..."
sleep 2

echo "------------------------------------------------"
echo "Testing ML service (Port 8000)..."
# -s: Silent (no progress bar)
# -S: Show error if fails
# -f: Fail fast (exit code 22 on 404/500 errors so 'set -e' catches it)
curl -sSf "http://127.0.0.1:8000/predict?sample=1" | jq .

echo "------------------------------------------------"
echo "Testing Main API (Port 5000)..."
curl -sSf "http://127.0.0.1:5000/api/predict?sample=1" | jq .

echo "------------------------------------------------"
echo "✅ Smoke tests passed successfully."