import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import seaborn as sns
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_curve, auc, confusion_matrix, classification_report

def prepare_lstm_data(df, features, target, sequence_length=3):
    """Prepare data for LSTM model with sliding window approach."""
    X, y = [], []
    
    # Scale the features
    scaler_X = MinMaxScaler()
    
    df_features = scaler_X.fit_transform(df[features])
    df_target = df[target].values
    
    for i in range(len(df) - sequence_length):
        X.append(df_features[i:i+sequence_length])
        y.append(df_target[i+sequence_length])
    
    return np.array(X), np.array(y), scaler_X

def create_lstm_model(input_shape):
    """Create LSTM model for maintenance classification."""
    model = Sequential()
    model.add(LSTM(64, input_shape=input_shape, return_sequences=True))
    model.add(Dropout(0.2))
    model.add(LSTM(32))
    model.add(Dropout(0.2))
    model.add(Dense(1, activation='sigmoid'))
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

def evaluate_model(model, X_test, y_test):
    """Evaluate the model and visualize predictions vs actual values."""
    # Make predictions
    y_pred_prob = model.predict(X_test)
    y_pred = (y_pred_prob > 0.5).astype(int)
    
    # Calculate metrics
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred)
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    # Calculate ROC curve
    fpr, tpr, _ = roc_curve(y_test, y_pred_prob)
    roc_auc = auc(fpr, tpr)
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall: {recall:.4f}")
    print(f"F1 Score: {f1:.4f}")
    print(f"ROC AUC: {roc_auc:.4f}")
    
    # Visualize results
    plt.figure(figsize=(12, 10))
    
    # Plot confusion matrix
    plt.subplot(2, 2, 1)
    sns.heatmap(conf_matrix, annot=True, fmt='d', cmap='Blues',
                xticklabels=['No Maintenance', 'Maintenance'],
                yticklabels=['No Maintenance', 'Maintenance'])
    plt.title('Confusion Matrix')
    plt.ylabel('True Label')
    plt.xlabel('Predicted Label')
    
    # Plot ROC curve
    plt.subplot(2, 2, 2)
    plt.plot(fpr, tpr, color='darkorange', lw=2, label=f'ROC curve (area = {roc_auc:.2f})')
    plt.plot([0, 1], [0, 1], color='navy', lw=2, linestyle='--')
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel('False Positive Rate')
    plt.ylabel('True Positive Rate')
    plt.title('ROC Curve')
    plt.legend(loc="lower right")
    
    # Plot prediction distribution
    plt.subplot(2, 2, 3)
    sns.histplot(y_pred_prob, bins=20, kde=True)
    plt.axvline(0.5, color='r', linestyle='--')
    plt.title('Prediction Probability Distribution')
    plt.xlabel('Prediction Probability')
    plt.ylabel('Frequency')
    
    # Plot prediction errors
    plt.subplot(2, 2, 4)
    errors = abs(y_test - y_pred_prob.flatten())
    sns.histplot(errors, kde=True)
    plt.title('Error Distribution')
    plt.xlabel('Prediction Error')
    plt.ylabel('Frequency')
    
    plt.tight_layout()
    plt.savefig('ac_maintenance_model_evaluation.png')
    print("Model evaluation results saved to ac_maintenance_model_evaluation.png")
    
    return accuracy, precision, recall, f1, roc_auc

def plot_training_history(history):
    """Plot the training and validation metrics."""
    plt.figure(figsize=(12, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.legend()
    
    plt.subplot(1, 2, 2)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.xlabel('Epochs')
    plt.ylabel('Accuracy')
    plt.legend()
    
    plt.tight_layout()
    plt.savefig('ac_maintenance_training_history.png')
    print("Training history plot saved to ac_maintenance_training_history.png")

if __name__ == "__main__":
    # Load the datasets
    print("Loading training and testing data...")
    train_data = pd.read_csv('data/ac_maintenance_train.csv')
    test_data = pd.read_csv('data/ac_maintenance_test.csv')
    
    # Define features and target
    features = list(train_data.columns.drop('maintenance_needed'))
    target = 'maintenance_needed'
    
    # Prepare data for LSTM (sequence length of 3)
    sequence_length = 3
    print(f"Preparing LSTM data with sequence length of {sequence_length}...")
    
    X_train, y_train, X_scaler = prepare_lstm_data(
        train_data, features, target, sequence_length
    )
    
    X_test, y_test, _ = prepare_lstm_data(
        test_data, features, target, sequence_length
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
        ModelCheckpoint('best_ac_maintenance_model.h5', save_best_only=True)
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
    model.save('ac_maintenance_lstm_model.h5')
    print("Model saved to ac_maintenance_lstm_model.h5")
    
    # Plot training history
    plot_training_history(history)
    
    # Evaluate the model
    print("Evaluating the model...")
    accuracy, precision, recall, f1, roc_auc = evaluate_model(model, X_test, y_test)
    
    # Save the evaluation metrics
    with open('ac_maintenance_model_metrics.txt', 'w') as f:
        f.write(f"Accuracy: {accuracy:.4f}\n")
        f.write(f"Precision: {precision:.4f}\n")
        f.write(f"Recall: {recall:.4f}\n")
        f.write(f"F1 Score: {f1:.4f}\n")
        f.write(f"ROC AUC: {roc_auc:.4f}\n")
    
    # Plot feature importance (similar to previous version but compatible with sequence data)
    feature_names = features
    
    # Simple feature importance visualization based on coefficients of a simpler model
    from sklearn.linear_model import LogisticRegression
    
    # Flatten the test data for the simple model
    X_test_flat = X_test.reshape(X_test.shape[0], -1)
    
    # Train a logistic regression model
    lr_model = LogisticRegression(random_state=42)
    lr_model.fit(X_test_flat, y_test)
    
    # Get feature importance (coefficients)
    # We repeat each feature by sequence_length to match the flattened data
    repeated_features = []
    for i in range(sequence_length):
        for feature in feature_names:
            repeated_features.append(f"{feature}_{i+1}")
    
    # Plot feature importance
    plt.figure(figsize=(12, 8))
    coefficients = lr_model.coef_[0]
    
    # Sort by absolute value of coefficient
    sorted_idx = np.argsort(np.abs(coefficients))
    plt.barh(
        [repeated_features[i] for i in sorted_idx[-20:]], 
        [coefficients[i] for i in sorted_idx[-20:]]
    )
    plt.title('Top 20 Feature Importances')
    plt.xlabel('Coefficient Magnitude')
    plt.tight_layout()
    plt.savefig('ac_maintenance_feature_importance.png')
    print("Feature importance plot saved to ac_maintenance_feature_importance.png")
    
    print("Training and evaluation complete!")