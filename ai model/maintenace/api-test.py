import requests
import json
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
import seaborn as sns

API_BASE_URL = "http://localhost:5002"

def check_api_health():
    """Check if the API is running and resources are loaded."""
    response = requests.get(f"{API_BASE_URL}/health")
    return response.json()

def save_scaler(train_data, features):
    """
    Prepare and save scaler to the API.
    
    Args:
        train_data: DataFrame with training data
        features: List of feature column names
    """
    # Create the scaler
    x_scaler = MinMaxScaler()
    
    # Fit the scaler
    x_scaler.fit(train_data[features])
    
    # Save locally
    joblib.dump(x_scaler, 'x_scaler.pkl')
    
    # Upload to the API
    files = {
        'x_scaler': open('x_scaler.pkl', 'rb')
    }
    
    response = requests.post(f"{API_BASE_URL}/save_scaler", files=files)
    return response.json()

def predict_maintenance(data, threshold=0.5):
    """
    Predict maintenance needed using the API.
    
    Args:
        data: List of dictionaries containing feature values
              Must contain at least 3 entries (SEQUENCE_LENGTH)
        threshold: Probability threshold for classification (default: 0.5)
    
    Returns:
        Prediction result including probability and classification
    """
    headers = {'Content-Type': 'application/json'}
    payload = {
        'data': data,
        'threshold': threshold
    }
    
    response = requests.post(
        f"{API_BASE_URL}/predict",
        headers=headers,
        data=json.dumps(payload)
    )
    
    return response.json()

def batch_predict(data, threshold=0.5, window_size=3):
    """
    Make batch predictions on multiple sequences.
    
    Args:
        data: List of dictionaries containing feature values
        threshold: Probability threshold for classification (default: 0.5)
        window_size: Size of sliding window (default: 3)
    
    Returns:
        Predictions for each sliding window
    """
    headers = {'Content-Type': 'application/json'}
    payload = {
        'data': data,
        'threshold': threshold,
        'window_size': window_size
    }
    
    response = requests.post(
        f"{API_BASE_URL}/batch_predict",
        headers=headers,
        data=json.dumps(payload)
    )
    
    return response.json()

def evaluate_model(test_data, threshold=0.5):
    """
    Evaluate the model using test data.
    
    Args:
        test_data: DataFrame or list of dictionaries containing test data
                  Must include feature columns and maintenance_needed column
        threshold: Probability threshold for classification (default: 0.5)
    
    Returns:
        Evaluation metrics
    """
    # If test_data is a DataFrame, convert to list of dictionaries
    if isinstance(test_data, pd.DataFrame):
        data = test_data.to_dict('records')
    else:
        data = test_data
        
    headers = {'Content-Type': 'application/json'}
    payload = {
        'data': data,
        'threshold': threshold
    }
    
    response = requests.post(
        f"{API_BASE_URL}/evaluate",
        headers=headers,
        data=json.dumps(payload)
    )
    
    return response.json()

def get_required_features():
    """Get the list of features expected by the model."""
    response = requests.get(f"{API_BASE_URL}/get_features")
    return response.json()

def visualize_predictions(batch_predictions):
    """
    Visualize the probability time series from batch predictions.
    
    Args:
        batch_predictions: Result from batch_predict function
    """
    if 'predictions' not in batch_predictions:
        print("No prediction data to visualize")
        return
    
    # Extract probabilities
    indices = [p['window_end_idx'] for p in batch_predictions['predictions']]
    probs = [p['probability'] for p in batch_predictions['predictions']]
    labels = [p['maintenance_needed'] for p in batch_predictions['predictions']]
    
    threshold = batch_predictions['threshold_used']
    
    # Create visualization
    plt.figure(figsize=(12, 6))
    
    # Plot the probabilities
    plt.plot(indices, probs, 'b-', label='Maintenance Probability')
    
    # Highlight the points based on prediction
    maintenance_indices = [indices[i] for i, label in enumerate(labels) if label]
    maintenance_probs = [probs[i] for i, label in enumerate(labels) if label]
    
    no_maintenance_indices = [indices[i] for i, label in enumerate(labels) if not label]
    no_maintenance_probs = [probs[i] for i, label in enumerate(labels) if not label]
    
    plt.scatter(maintenance_indices, maintenance_probs, color='red', 
                label='Maintenance Needed', zorder=5)
    plt.scatter(no_maintenance_indices, no_maintenance_probs, color='green', 
                label='No Maintenance Needed', zorder=5)
    
    # Add threshold line
    plt.axhline(y=threshold, color='r', linestyle='--', 
                label=f'Threshold ({threshold})')
    
    plt.title('AC Maintenance Prediction Probabilities')
    plt.xlabel('Window End Index')
    plt.ylabel('Maintenance Probability')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig('maintenance_predictions.png')
    plt.show()
    
    print("Visualization saved to maintenance_predictions.png")

if __name__ == "__main__":
    # Example usage
    
    # Check API health
    health = check_api_health()
    print("API Health:", health)
    
    # If scaler is not loaded, we need to save it
    if not health['x_scaler_loaded']:
        print("Scaler not loaded. Please prepare and upload scaler.")
        # Uncomment and run when you have the training data
        # train_data = pd.read_csv('data/ac_maintenance_train.csv')
        # features = list(train_data.columns.drop('maintenance_needed'))
        # save_scaler(train_data, features)
    
    # Get the required features
    try:
        feature_info = get_required_features()
        print("Required features:", feature_info['features'])
        print("Required sequence length:", feature_info['sequence_length'])
    except Exception as e:
        print(f"Could not get features: {e}")
    
    # Example prediction request
    # Replace these with actual feature values for your model
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
    
    # Get single prediction
    try:
        prediction = predict_maintenance(sample_data)
        print("\nPrediction result:")
        print(f"Maintenance needed: {prediction['maintenance_needed']}")
        print(f"Probability: {prediction['probability']:.4f}")
    except Exception as e:
        print(f"Prediction failed: {e}")
    
    # Example batch prediction
    # Create a longer sequence for batch prediction
    batch_data = []
    for i in range(20):
        # Simulate some data with increasing values (just for example)
        batch_data.append({
            "temperature": 24.0 + i * 0.2,
            "humidity": 60.0 + i * 0.3,
            "pressure": 1013.0 - i * 0.1,
            "vibration": 0.2 + i * 0.01,
            "noise_level": 45.0 + i * 0.2,
            "runtime_hours": 350.0 + i * 1.0,
            "power_consumption": 3.0 + i * 0.05
        })
    
    try:
        batch_results = batch_predict(batch_data)
        print("\nBatch predictions:", len(batch_results['predictions']))
        
        # Visualize batch predictions
        visualize_predictions(batch_results)
    except Exception as e:
        print(f"Batch prediction failed: {e}")
    
    # Example evaluation
    # To evaluate the model, load test data with actual maintenance_needed values
    try:
        # Uncomment when you have test data
        # test_data = pd.read_csv('data/ac_maintenance_test.csv')
        # evaluation = evaluate_model(test_data)
        # print("\nEvaluation metrics:", evaluation['metrics'])
        pass
    except Exception as e:
        print(f"Evaluation failed: {e}")