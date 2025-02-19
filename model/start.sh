#!/bin/bash
cd model  # Navigate to the folder containing your FastAPI app
uvicorn main:app --host 0.0.0.0 --port 10000