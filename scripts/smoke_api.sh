#!/usr/bin/env bash
set -e
echo "Waiting for ML service..."
sleep 2
echo "Testing ML service..."
curl -sSf http://127.0.0.1:8000/predict?sample=1 | jq .
echo "Testing API..."
curl -sSf http://127.0.0.1:5000/api/predict?sample=1 | jq .
echo "Smoke tests passed."
