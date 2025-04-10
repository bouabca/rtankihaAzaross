import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import seaborn as sns

def prepare_lstm_data(df, features, target, sequence_length=7):
    """Prepare data for LSTM model with sliding window approach."""
    X, y = [], []
    
    # Scale the features
    scaler_X = MinMaxScaler()
    scaler_y = MinMaxScaler()
    
    df_features = scaler_X.fit_transform(df[features])
    df_target = scaler_y.fit_transform(df[[target]])
    
    for i in range(len(df) - sequence_length):
        X.append(df_features[i:i+sequence_length])
        y.append(df_target[i+sequence_length])
    
    return np.array(X), np.array(y), scaler_X, scaler_y

def create_lstm_model(input_shape):
    """Create LSTM model for time series prediction."""
    model = Sequential()
    model.add(LSTM(64, input_shape=input_shape, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(32))
    model.add(Dropout(0.2))
    model.add(Dense(1))
    
    model.compile(optimizer='adam', loss='mse')
    return model

def evaluate_model(model, X_test, y_test, y_scaler):
    """Evaluate the model and visualize predictions vs actual values."""
    # Make predictions
    y_pred = model.predict(X_test)
    
    # Inverse transform the scaled values
    y_test_actual = y_scaler.inverse_transform(y_test)
    y_pred_actual = y_scaler.inverse_transform(y_pred)
    
    # Calculate metrics
    mse = np.mean((y_test_actual - y_pred_actual) ** 2)
    rmse = np.sqrt(mse)
    mae = np.mean(np.abs(y_test_actual - y_pred_actual))
    
    print(f"Mean Squared Error: {mse:.4f}")
    print(f"Root Mean Squared Error: {rmse:.4f}")
    print(f"Mean Absolute Error: {mae:.4f}")
    
    # Visualize results
    plt.figure(figsize=(12, 6))
    
    # Plot actual vs predicted
    plt.subplot(1, 2, 1)
    plt.scatter(y_test_actual, y_pred_actual, alpha=0.5)
    plt.plot([y_test_actual.min(), y_test_actual.max()], [y_test_actual.min(), y_test_actual.max()], 'r--')
    plt.title('Actual vs Predicted AC Settings')
    plt.xlabel('Actual AC Setting')
    plt.ylabel('Predicted AC Setting')
    
    # Plot error distribution
    plt.subplot(1, 2, 2)
    errors = y_test_actual.flatten() - y_pred_actual.flatten()
    sns.histplot(errors, kde=True)
    plt.title('Error Distribution')
    plt.xlabel('Prediction Error')
    plt.ylabel('Frequency')
    
    plt.tight_layout()
    plt.savefig('ac_model_evaluation.png')
    print("Model evaluation results saved to ac_model_evaluation.png")
    
    return mse, rmse, mae

def plot_training_history(history):
    """Plot the training and validation loss."""
    plt.figure(figsize=(10, 6))
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    plt.savefig('ac_training_history.png')
    print("Training history plot saved to ac_training_history.png")

if __name__ == "__main__":
    # Load the datasets
    print("Loading training and testing data...")
    train_data = pd.read_csv('ac_train_data.csv')
    test_data = pd.read_csv('ac_test_data.csv')
    
    # Convert date column to datetime
    train_data['date'] = pd.to_datetime(train_data['date'])
    test_data['date'] = pd.to_datetime(test_data['date'])
    
    # Define features and target
    features = ['temperature', 'window_open', 'day_of_year']
    target = 'ac_setting'
    
    # Prepare data for LSTM (sequence length of 7 days)
    sequence_length = 7
    print(f"Preparing LSTM data with sequence length of {sequence_length}...")
    
    X_train, y_train, X_scaler, y_scaler = prepare_lstm_data(
        train_data, features, target, sequence_length
    )
    
    X_test, y_test, _, _ = prepare_lstm_data(
        test_data, features, target, sequence_length, 
    )
    
    print(f"Training data shape: {X_train.shape}")
    print(f"Testing data shape: {X_test.shape}")
    
    # Create and compile the LSTM model
    print("Creating LSTM model...")
    input_shape = (X_train.shape[1], X_train.shape[2])
    model = create_lstm_model(input_shape)
    model.summary()
    
    # Set up callbacks for early stopping and model checkpointing
    callbacks = [
        EarlyStopping(patience=10, restore_best_weights=True),
        ModelCheckpoint('best_ac_model.h5', save_best_only=True)
    ]
    
    # Train the model
    print("Training the model...")
    history = model.fit(
        X_train, y_train,
        validation_split=0.2,
        epochs=50,
        batch_size=32,
        callbacks=callbacks,
        verbose=1
    )
    
    # Save the model
    model.save('ac_lstm_model.h5')
    print("Model saved to ac_lstm_model.h5")
    
    # Plot training history
    plot_training_history(history)
    
    # Evaluate the model
    print("Evaluating the model...")
    mse, rmse, mae = evaluate_model(model, X_test, y_test, y_scaler)
    
    # Save the evaluation metrics
    with open('ac_model_metrics.txt', 'w') as f:
        f.write(f"Mean Squared Error: {mse:.4f}\n")
        f.write(f"Root Mean Squared Error: {rmse:.4f}\n")
        f.write(f"Mean Absolute Error: {mae:.4f}\n")
    
    print("Training and evaluation complete!")