import os
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
import joblib
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_curve, auc, confusion_matrix

app = Flask(__name__)

# Global variables to store model and scalers
MODEL = None
X_SCALER = None
SEQUENCE_LENGTH = 3
THRESHOLD = 0.5

def load_resources():
    """Load the model and scaler if they exist."""
    global MODEL, X_SCALER
    
    if os.path.exists('ac_maintenance_lstm_model.h5'):
        MODEL = load_model('ac_maintenance_lstm_model.h5')
        print("Model loaded successfully")
    else:
        print("Model file not found!")
        
    if os.path.exists('x_scaler.pkl'):
        X_SCALER = joblib.load('x_scaler.pkl')
        print("X scaler loaded successfully")
    else:
        print("X scaler file not found!")

@app.route('/health', methods=['GET'])
def health_check():
    """Endpoint to check if the API is running."""
    return jsonify({
        'status': 'healthy',
        'model_loaded': MODEL is not None,
        'x_scaler_loaded': X_SCALER is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to make maintenance predictions using the loaded model.
    
    Expected JSON input format:
    {
        "data": [
            {
                "feature1": value1,
                "feature2": value2,
                ...
            },
            ...
        ],
        "threshold": 0.5  # Optional, default is 0.5
    }
    
    The input should contain at least SEQUENCE_LENGTH entries.
    """
    if MODEL is None or X_SCALER is None:
        return jsonify({
            'error': 'Model or scaler not loaded. Please check if files exist and try again.'
        }), 500
    
    try:
        # Get input data
        input_data = request.get_json()
        
        if 'data' not in input_data or len(input_data['data']) < SEQUENCE_LENGTH:
            return jsonify({
                'error': f'Input data must contain at least {SEQUENCE_LENGTH} entries'
            }), 400
        
        # Get optional threshold
        threshold = input_data.get('threshold', THRESHOLD)
        
        # Convert to DataFrame
        df = pd.DataFrame(input_data['data'])
        
        # Get the feature list from the model
        # We'll use all columns except potential target column if it exists
        if 'maintenance_needed' in df.columns:
            features = list(df.columns.drop('maintenance_needed'))
        else:
            features = list(df.columns)
        
        # Check if all required features are present (at least some features)
        if len(features) == 0:
            return jsonify({
                'error': 'Input data must contain features'
            }), 400
        
        # Scale the features
        scaled_features = X_SCALER.transform(df[features])
        
        # Create the sequence for LSTM
        X = np.array([scaled_features[-SEQUENCE_LENGTH:]])
        
        # Make prediction
        prediction_prob = float(MODEL.predict(X)[0][0])
        prediction_class = 1 if prediction_prob > threshold else 0
        maintenance_needed = bool(prediction_class == 1)
        
        return jsonify({
            'probability': prediction_prob,
            'maintenance_needed': maintenance_needed,
            'threshold_used': threshold,
            'input_features': features,
            'sequence_used': input_data['data'][-SEQUENCE_LENGTH:]
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
                "feature1": value1,
                "feature2": value2,
                ...,
                "maintenance_needed": 0 or 1
            },
            ...
        ],
        "threshold": 0.5  # Optional, default is 0.5
    }
    """
    if MODEL is None or X_SCALER is None:
        return jsonify({
            'error': 'Model or scaler not loaded. Please check if files exist and try again.'
        }), 500
    
    try:
        # Get input data
        input_data = request.get_json()
        
        if 'data' not in input_data or len(input_data['data']) <= SEQUENCE_LENGTH:
            return jsonify({
                'error': f'Input data must contain more than {SEQUENCE_LENGTH} entries'
            }), 400
        
        # Get optional threshold
        threshold = input_data.get('threshold', THRESHOLD)
        
        # Convert to DataFrame
        df = pd.DataFrame(input_data['data'])
        
        # Check if target column is present
        if 'maintenance_needed' not in df.columns:
            return jsonify({
                'error': 'Input data must contain maintenance_needed column for evaluation'
            }), 400
            
        # Get features (all columns except target)
        features = list(df.columns.drop('maintenance_needed'))
        target = 'maintenance_needed'
        
        # Prepare data for evaluation
        X, y = [], []
        
        # Scale the features
        df_features = X_SCALER.transform(df[features])
        df_target = df[target].values
        
        for i in range(len(df) - SEQUENCE_LENGTH):
            X.append(df_features[i:i+SEQUENCE_LENGTH])
            y.append(df_target[i+SEQUENCE_LENGTH])
        
        X = np.array(X)
        y = np.array(y)
        
        # Make predictions
        y_pred_prob = MODEL.predict(X)
        y_pred = (y_pred_prob > threshold).astype(int)
        
        # Calculate metrics
        accuracy = float(accuracy_score(y, y_pred))
        precision = float(precision_score(y, y_pred))
        recall = float(recall_score(y, y_pred))
        f1 = float(f1_score(y, y_pred))
        
        # Calculate ROC curve
        fpr, tpr, _ = roc_curve(y, y_pred_prob)
        roc_auc = float(auc(fpr, tpr))
        
        # Calculate confusion matrix
        cm = confusion_matrix(y, y_pred)
        cm_dict = {
            'true_negative': int(cm[0, 0]),
            'false_positive': int(cm[0, 1]),
            'false_negative': int(cm[1, 0]),
            'true_positive': int(cm[1, 1])
        }
        
        return jsonify({
            'metrics': {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'roc_auc': roc_auc
            },
            'confusion_matrix': cm_dict,
            'sample_size': len(X),
            'threshold_used': threshold
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/save_scaler', methods=['POST'])
def save_scaler():
    """
    Endpoint to save the scaler provided by the user.
    Expects a multipart form with file: x_scaler.pkl
    """
    try:
        if 'x_scaler' not in request.files:
            return jsonify({
                'error': 'x_scaler file is required'
            }), 400
            
        x_scaler_file = request.files['x_scaler']
        x_scaler_file.save('x_scaler.pkl')
        
        # Reload the scaler
        global X_SCALER
        X_SCALER = joblib.load('x_scaler.pkl')
        
        return jsonify({
            'message': 'Scaler saved and loaded successfully'
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """
    Endpoint to make batch predictions on multiple sequences.
    
    Expected JSON input format:
    {
        "data": [
            {
                "feature1": value1,
                "feature2": value2,
                ...
            },
            ...
        ],
        "threshold": 0.5,  # Optional, default is 0.5
        "window_size": 3  # Optional, default is SEQUENCE_LENGTH
    }
    """
    if MODEL is None or X_SCALER is None:
        return jsonify({
            'error': 'Model or scaler not loaded. Please check if files exist and try again.'
        }), 500
    
    try:
        # Get input data
        input_data = request.get_json()
        
        if 'data' not in input_data:
            return jsonify({
                'error': 'Input data is required'
            }), 400
            
        data = input_data['data']
        if len(data) < SEQUENCE_LENGTH:
            return jsonify({
                'error': f'Input data must contain at least {SEQUENCE_LENGTH} entries'
            }), 400
        
        # Get optional parameters
        threshold = input_data.get('threshold', THRESHOLD)
        window_size = input_data.get('window_size', SEQUENCE_LENGTH)
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Get features
        if 'maintenance_needed' in df.columns:
            features = list(df.columns.drop('maintenance_needed'))
        else:
            features = list(df.columns)
        
        # Scale the features
        scaled_features = X_SCALER.transform(df[features])
        
        # Create sliding windows for prediction
        predictions = []
        
        for i in range(len(df) - window_size + 1):
            # Create sequence
            sequence = scaled_features[i:i+window_size]
            X = np.array([sequence[-SEQUENCE_LENGTH:]])  # Use last SEQUENCE_LENGTH elements
            
            # Make prediction
            prob = float(MODEL.predict(X)[0][0])
            maintenance_needed = bool(prob > threshold)
            
            predictions.append({
                'window_start_idx': i,
                'window_end_idx': i + window_size - 1,
                'probability': prob,
                'maintenance_needed': maintenance_needed
            })
        
        return jsonify({
            'predictions': predictions,
            'threshold_used': threshold,
            'window_size': window_size,
            'total_windows': len(predictions)
        })
    
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

@app.route('/get_features', methods=['GET'])
def get_features():
    """
    Endpoint to retrieve the list of features expected by the model.
    This is useful for clients to know what features to provide.
    """
    if X_SCALER is None:
        return jsonify({
            'error': 'X scaler not loaded. Cannot determine feature names.'
        }), 500
    
    try:
        feature_names = X_SCALER.feature_names_in_.tolist()
        return jsonify({
            'features': feature_names,
            'sequence_length': SEQUENCE_LENGTH
        })
    except Exception as e:
        return jsonify({
            'error': str(e)
        }), 500

if __name__ == '__main__':
    # Load model and scaler on startup
    load_resources()
    
    # Start the Flask app
    app.run(host='0.0.0.0', port=5002, debug=True)