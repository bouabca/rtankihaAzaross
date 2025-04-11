# AC Maintenance Prediction API

This API provides endpoints to interact with an LSTM model for predicting AC maintenance needs based on sensor data and operational metrics.

## Features

- Binary classification to predict if maintenance is needed
- Support for sequence-based LSTM predictions
- Batch prediction capability for time series analysis
- Model evaluation with comprehensive metrics (accuracy, precision, recall, F1, ROC AUC)
- Easy scaling with feature normalization

## Prerequisites

- Python 3.7+
- Flask
- TensorFlow
- NumPy
- Pandas
- scikit-learn
- joblib

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   pip install flask tensorflow numpy pandas scikit-learn joblib matplotlib seaborn
   ```
3. Make sure you have the following files:
   - `ac_maintenance_lstm_model.h5` - The trained LSTM model
   - `x_scaler.pkl` - (Optional) Scaler for features

If you don't have the scaler file, you can create and upload it using the API.

## Running the API

```bash
python app.py
```

The API will run on `http://localhost:5000` by default.

## API Endpoints

### 1. Health Check

**Endpoint:** `/health`  
**Method:** GET  
**Description:** Check if the API is running and model/scaler are loaded.

**Example Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "x_scaler_loaded": true
}
```

### 2. Make Predictions

**Endpoint:** `/predict`  
**Method:** POST  
**Description:** Predict maintenance needs based on sequence of operational data.

**Request Format:**
```json
{
  "data": [
    {
      "temperature": 25.5,
      "humidity": 60.2,
      "vibration": 0.28,
      ...
    },
    ...
  ],
  "threshold": 0.5
}
```

**Example Response:**
```json
{
  "probability": 0.75,
  "maintenance_needed": true,
  "threshold_used": 0.5,
  "input_features": ["temperature", "humidity", "vibration", ...],
  "sequence_used": [...]
}
```

### 3. Batch Predict

**Endpoint:** `/batch_predict`  
**Method:** POST  
**Description:** Make predictions on sliding windows of data.

**Request Format:**
```json
{
  "data": [
    {
      "temperature": 25.5,
      "humidity": 60.2,
      ...
    },
    ...
  ],
  "threshold": 0.5,
  "window_size": 3
}
```

**Example Response:**
```json
{
  "predictions": [
    {
      "window_start_idx": 0,
      "window_end_idx": 2,
      "probability": 0.12,
      "maintenance_needed": false
    },
    {
      "window_start_idx": 1,
      "window_end_idx": 3,
      "probability": 0.85,
      "maintenance_needed": true
    },
    ...
  ],
  "threshold_used": 0.5,
  "window_size": 3,
  "total_windows": 18
}
```

### 4. Evaluate Model

**Endpoint:** `/evaluate`  
**Method:** POST  
**Description:** Evaluate model performance on test data.

**Request Format:**
```json
{
  "data": [
    {
      "temperature": 25.5,
      "humidity": 60.2,
      ...,
      "maintenance_needed": 0
    },
    ...
  ],
  "threshold": 0.5
}
```

**Example Response:**
```json
{
  "metrics": {
    "accuracy": 0.92,
    "precision": 0.88,
    "recall": 0.95,
    "f1_score": 0.91,
    "roc_auc": 0.96
  },
  "confusion_matrix": {
    "true_negative": 45,
    "false_positive": 3,
    "false_negative": 2,
    "true_positive": 50
  },
  "sample_size": 100,
  "threshold_used": 0.5
}
```

### 5. Save Scaler

**Endpoint:** `/save_scaler`  
**Method:** POST  
**Description:** Upload scaler for feature normalization.

**Request Format:**  
Multipart form with file:
- `x_scaler`: The pickle file for feature scaler

**Example Response:**
```json
{
  "message": "Scaler saved and loaded successfully"
}
```

### 6. Get Features

**Endpoint:** `/get_features`  
**Method:** GET  
**Description:** Get the list of features expected by the model.

**Example Response:**
```json
{
  "features": ["temperature", "humidity", "vibration", "pressure", "noise_level", "runtime_hours", "power_consumption"],
  "sequence_length": 3
}
```

## Using the Client

The provided client file `client.py` demonstrates how to interact with the API. See the included example code for:

1. Checking API health
2. Creating and uploading scalers
3. Making predictions (single and batch)
4. Evaluating the model
5. Visualizing prediction results

## Example Usage

```python
import pandas as pd
from client import check_api_health, predict_maintenance, batch_predict, visualize_predictions

# Check if API is running
health = check_api_health()
print("API Health:", health)

# Prepare sample data for prediction
sample_data = [
    {
        "temperature": 24.5,
        "humidity": 60.2,
        "pressure": 1013.2,
        "vibration": 0.25,
        "noise_level": 45.1,
        "runtime_hours": 350.5,
        "power_consumption": 3.2
    },
    {
        "temperature": 25.0,
        "humidity": 62.0,
        "pressure": 1012.8,
        "vibration": 0.28,
        "noise_level": 46.5,
        "runtime_hours": 351.5,
        "power_consumption": 3.3
    },
    {
        "temperature": 25.8,
        "humidity": 63.5,
        "pressure": 1012.5,
        "vibration": 0.32,
        "noise_level": 48.2,
        "runtime_hours": 352.5,
        "power_consumption": 3.4
    }
]

# Get prediction
prediction = predict_maintenance(sample_data)
print(f"Maintenance needed: {prediction['maintenance_needed']}")
print(f"Probability: {prediction['probability']:.4f}")
```

## Advanced Usage: Time Series Analysis

The API supports analyzing time series data with the batch prediction endpoint:

```python
# Create a sequence of sensor readings
sensor_readings = []
for i in range(50):
    # Add your sensor data here
    sensor_readings.append({
        "temperature": 24.0 + i * 0.1,
        "humidity": 60.0 + (i % 10) * 0.5,
        # Add other features...
    })

# Get predictions for sliding windows
batch_results = batch_predict(sensor_readings, window_size=5)

# Visualize the results
visualize_predictions(batch_results)
```

## Notes

- The default sequence length is 3, matching the LSTM model's training configuration
- For accurate predictions, provide the same features that were used during model training
- You can customize the classification threshold (default is 0.5) for different sensitivity levels
- The batch predict feature is useful for continuous monitoring applications