import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import joblib

app = Flask(__name__)

# Global variables to store model and scalers
MODEL = None
X_SCALER = None
Y_SCALER = None
SEQUENCE_LENGTH = 7
FEATURES = ['temperature', 'window_open', 'day_of_year']
TARGET = 'ac_setting'

def load_resources():
    """Load the model and scalers if they exist."""
    global MODEL, X_SCALER, Y_SCALER
    
    if os.path.exists('ac_lstm_model.h5'):
        MODEL = load_model('ac_lstm_model.h5')
        print("Model loaded successfully")
    else:
        print("Model file not found!")
        
    if os.path.exists('x_scaler.pkl'):
        X_SCALER = joblib.load('x_scaler.pkl')
        print("X scaler loaded successfully")
    else:
        print("X scaler file not found!")
        
    if os.path.exists('y_scaler.pkl'):
        Y_SCALER = joblib.load('y_scaler.pkl')
        print("Y scaler loaded successfully")
    else:
        print("Y scaler file not found!")

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check if the API is running."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': MODEL is not None,
        'x_scaler_loaded': X_SCALER is not None,
        'y_scaler_loaded': Y_SCALER is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to make predictions using the loaded model.
    
    Expected JSON input format:
    {
        "data": [
            {
                "temperature": 25.5,
                "window_open": 0,
                "day_of_year": 182
            },
            ...
        ]
    }
    
    The input should contain at least SEQUENCE_LENGTH entries.
    """
    if MODEL is None or X_SCALER is None or Y_SCALER is None:
        return jsonify({
            'error': 'Model or scalers not loaded. Please check if files exist and try again.'
        }), 500
    
    try:
        # Get input data
        input_data = request.get_json()
        
        if 'data' not in input_data or len(input_data['data']) < SEQUENCE_LENGTH:
            return jsonify({
                'error': f'Input data must contain at least {SEQUENCE_LENGTH} entries'
            }), 400
        
        # Convert to DataFrame
        df = pd.DataFrame(input_data['data'])
        
        # Check if all required features are present
        if not all(feature in df.columns for feature in FEATURES):
            return jsonify({
                'error': f'Input data must contain all features: {FEATURES}'
            }), 400
        
        # Scale the features
        scaled_features = X_SCALER.transform(df[FEATURES])
        
        # Create the sequence for LSTM
        X = np.array([scaled_features[-SEQUENCE_LENGTH:]])
        
        # Make prediction
        prediction_scaled = MODEL.predict(X)
        prediction = Y_SCALER.inverse_transform(prediction_scaled)[0][0]
        
        return jsonify({
            'prediction': float(prediction),
            'input': input_data['data'][-SEQUENCE_LENGTH:]
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/evaluate', methods=['POST'])
def evaluate():
    """
    Endpoint to evaluate model on provided test data.
    
    Expected JSON input format:
    {
        "data": [
            {
                "temperature": 25.5,
                "window_open": 0,
                "day_of_year": 182,
                "ac_setting": 22.0
            },
            ...
        ]
    }
    """
    if MODEL is None or X_SCALER is None or Y_SCALER is None:
        return jsonify({
            'error': 'Model or scalers not loaded. Please check if files exist and try again.'
        }), 500
    
    try:
        # Get input data
        input_data = request.get_json()
        
        if 'data' not in input_data or len(input_data['data']) <= SEQUENCE_LENGTH:
            return jsonify({
                'error': f'Input data must contain more than {SEQUENCE_LENGTH} entries'
            }), 400
        
        # Convert to DataFrame
        df = pd.DataFrame(input_data['data'])
        
        # Check if all required features and target are present
        required_columns = FEATURES + [TARGET]
        if not all(col in df.columns for col in required_columns):
            return jsonify({
                'error': f'Input data must contain all features and target: {required_columns}'
            }), 400
        
        # Prepare data for evaluation
        X, y = [], []
        
        # Scale the features and target
        df_features = X_SCALER.transform(df[FEATURES])
        df_target = Y_SCALER.transform(df[[TARGET]])
        
        for i in range(len(df) - SEQUENCE_LENGTH):
            X.append(df_features[i:i+SEQUENCE_LENGTH])
            y.append(df_target[i+SEQUENCE_LENGTH])
        
        X = np.array(X)
        y = np.array(y)
        
        # Make predictions
        y_pred = MODEL.predict(X)
        
        # Inverse transform the scaled values
        y_actual = Y_SCALER.inverse_transform(y)
        y_pred_actual = Y_SCALER.inverse_transform(y_pred)
        
        # Calculate metrics
        mse = float(np.mean((y_actual - y_pred_actual) ** 2))
        rmse = float(np.sqrt(mse))
        mae = float(np.mean(np.abs(y_actual - y_pred_actual)))
        
        return jsonify({
            'metrics': {
                'mse': mse,
                'rmse': rmse,
                'mae': mae
            },
            'sample_size': len(X)
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/save_scalers', methods=['POST'])
def save_scalers():
    """
    Endpoint to save the scalers provided by the user.
    Expects a multipart form with two files: x_scaler.pkl and y_scaler.pkl
    """
    try:
        if 'x_scaler' not in request.files or 'y_scaler' not in request.files:
            return jsonify({
                'error': 'Both x_scaler and y_scaler files are required'
            }), 400
            
        x_scaler_file = request.files['x_scaler']
        y_scaler_file = request.files['y_scaler']
        
        x_scaler_file.save('x_scaler.pkl')
        y_scaler_file.save('y_scaler.pkl')
        
        # Reload the scalers
        global X_SCALER, Y_SCALER
        X_SCALER = joblib.load('x_scaler.pkl')
        Y_SCALER = joblib.load('y_scaler.pkl')
        
        return jsonify({
            'message': 'Scalers saved and loaded successfully'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/retrain', methods=['POST'])
def retrain():
    """
    Endpoint to retrain the model with new data.
    Not implemented in this version - would be a more complex endpoint.
    """
    return jsonify({
        'message': 'Retraining functionality not implemented in this version',
        'status': 'not_implemented'
    }), 501

if __name__ == '__main__':
    # Load model and scalers on startup
    load_resources()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)