# AC Settings Prediction API

This API provides endpoints to interact with an LSTM model for predicting AC settings based on temperature, window status, and day of the year.

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
   pip install flask tensorflow numpy pandas scikit-learn joblib
   ```
3. Make sure you have the following files:
   - `ac_lstm_model.h5` - The trained LSTM model
   - `x_scaler.pkl` - (Optional) Scaler for features
   - `y_scaler.pkl` - (Optional) Scaler for target variable

If you don't have the scaler files, you can create and upload them using the API.

## Running the API

```bash
python app.py
```

The API will run on `http://localhost:5000` by default.

## API Endpoints

### 1. Health Check

**Endpoint:** `/health`  
**Method:** GET  
**Description:** Check if the API is running and model/scalers are loaded.

**Example Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "x_scaler_loaded": true,
  "y_scaler_loaded": true
}
```

### 2. Make Predictions

**Endpoint:** `/predict`  
**Method:** POST  
**Description:** Predict AC setting based on sequence of environmental conditions.

**Request Format:**
```json
{
  "data": [
    {
      "temperature": 25.5,
      "window_open": 0,
      "day_of_year": 182
    },
    ...
    // Must include at least 7 entries (SEQUENCE_LENGTH)
  ]
}
```

**Example Response:**
```json
{
  "prediction": 22.5,
  "input": [
    // Last 7 entries used for prediction
  ]
}
```

### 3. Evaluate Model

**Endpoint:** `/evaluate`  
**Method:** POST  
**Description:** Evaluate model performance on test data.

**Request Format:**
```json
{
  "data": [
    {
      "temperature": 25.5,
      "window_open": 0,
      "day_of_year": 182,
      "ac_setting": 22.0
    },
    ...
    // Must include more than 7 entries
  ]
}
```

**Example Response:**
```json
{
  "metrics": {
    "mse": 0.0123,
    "rmse": 0.1109,
    "mae": 0.0891
  },
  "sample_size": 50
}
```

### 4. Save Scalers

**Endpoint:** `/save_scalers`  
**Method:** POST  
**Description:** Upload scalers for feature normalization.

**Request Format:**  
Multipart form with files:
- `x_scaler`: The pickle file for feature scaler
- `y_scaler`: The pickle file for target scaler

**Example Response:**
```json
{
  "message": "Scalers saved and loaded successfully"
}
```

### 5. Retrain Model (Not Implemented)

**Endpoint:** `/retrain`  
**Method:** POST  
**Description:** Placeholder for future model retraining functionality.

## Using the Client

The provided client file `client.py` demonstrates how to interact with the API. See the included example code for:

1. Checking API health
2. Creating and uploading scalers
3. Making predictions
4. Evaluating the model

## Example Usage

```python
import pandas as pd
from client import check_api_health, predict_ac_setting, evaluate_model

# Check if API is running
health = check_api_health()
print("API Health:", health)

# Prepare sample data for prediction
sample_data = [
    {"temperature": 25.0, "window_open": 0, "day_of_year": 180},
    {"temperature": 26.0, "window_open": 0, "day_of_year": 181},
    {"temperature": 27.0, "window_open": 1, "day_of_year": 182},
    {"temperature": 26.5, "window_open": 1, "day_of_year": 183},
    {"temperature": 26.0, "window_open": 0, "day_of_year": 184},
    {"temperature": 25.5, "window_open": 0, "day_of_year": 185},
    {"temperature": 25.0, "window_open": 0, "day_of_year": 186}
]

# Get prediction
prediction = predict_ac_setting(sample_data)
print("Predicted AC setting:", prediction["prediction"])
```

## Notes

- The API requires the model and scalers to be loaded before making predictions or evaluations.
- If scalers are not available, you can create them from training data and upload them to the API.
- The sequence length for LSTM predictions is fixed at 7 by default.