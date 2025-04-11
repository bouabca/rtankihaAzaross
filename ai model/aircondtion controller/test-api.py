import requests
import json
import pandas as pd
import joblib
from sklearn.preprocessing import MinMaxScaler

API_BASE_URL = "http://localhost:5000"

def check_api_health():
    """Check if the API is running and resources are loaded."""
    response = requests.get(f"{API_BASE_URL}/health")
    return response.json()

def save_scalers(train_data, features, target):
    """
    Prepare and save scalers to the API.
    
    Args:
        train_data: DataFrame with training data
        features: List of feature column names
        target: Target column name
    """
    # Create the scalers
    x_scaler = MinMaxScaler()
    y_scaler = MinMaxScaler()
    
    # Fit the scalers
    x_scaler.fit(train_data[features])
    y_scaler.fit(train_data[[target]])
    
    # Save locally
    joblib.dump(x_scaler, 'x_scaler.pkl')
    joblib.dump(y_scaler, 'y_scaler.pkl')
    
    # Upload to the API
    files = {
        'x_scaler': open('x_scaler.pkl', 'rb'),
        'y_scaler': open('y_scaler.pkl', 'rb')
    }
    
    response = requests.post(f"{API_BASE_URL}/save_scalers", files=files)
    return response.json()

def predict_ac_setting(data):
    """
    Predict AC setting using the API.
    
    Args:
        data: List of dictionaries containing temperature, window_open, and day_of_year values
              Must contain at least 7 entries (SEQUENCE_LENGTH)
    
    Returns:
        Predicted AC setting value
    """
    headers = {'Content-Type': 'application/json'}
    payload = {'data': data}
    
    response = requests.post(
        f"{API_BASE_URL}/predict",
        headers=headers,
        data=json.dumps(payload)
    )
    
    return response.json()

def evaluate_model(test_data):
    """
    Evaluate the model using test data.
    
    Args:
        test_data: DataFrame or list of dictionaries containing test data
                  Must include temperature, window_open, day_of_year, and ac_setting columns
    
    Returns:
        Evaluation metrics
    """
    # If test_data is a DataFrame, convert to list of dictionaries
    if isinstance(test_data, pd.DataFrame):
        data = test_data.to_dict('records')
    else:
        data = test_data
        
    headers = {'Content-Type': 'application/json'}
    payload = {'data': data}
    
    response = requests.post(
        f"{API_BASE_URL}/evaluate",
        headers=headers,
        data=json.dumps(payload)
    )
    
    return response.json()

if __name__ == "__main__":
    # Example usage
    
    # Check API health
    health = check_api_health()
    print("API Health:", health)
    
    # If scalers are not loaded, we need to save them
    if not health['x_scaler_loaded'] or not health['y_scaler_loaded']:
        print("Scalers not loaded. Please prepare and upload scalers.")
        # Uncomment and run when you have the training data
        # train_data = pd.read_csv('ac_train_data.csv')
        # features = ['temperature', 'window_open', 'day_of_year']
        # target = 'ac_setting'
        # save_scalers(train_data, features, target)
    
    # Example prediction request
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
    try:
        prediction = predict_ac_setting(sample_data)
        print("Prediction result:", prediction)
    except Exception as e:
        print(f"Prediction failed: {e}")
    
    # Example evaluation
    # To evaluate the model, load test data with actual AC settings
    try:
        test_data = pd.read_csv('ac_test_data.csv')
        evaluation = evaluate_model(test_data)
        print("Evaluation metrics:", evaluation)
    except Exception as e:
        print(f"Evaluation failed: {e}")