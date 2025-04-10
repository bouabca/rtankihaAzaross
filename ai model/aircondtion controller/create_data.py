import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

def get_season(date):
    """Determine season based on date."""
    month = date.month
    day = date.day
    
    if (month == 3 and day >= 21) or (month > 3 and month < 6) or (month == 6 and day < 21):
        return "Spring"
    elif (month == 6 and day >= 21) or (month > 6 and month < 9) or (month == 9 and day < 23):
        return "Summer"
    elif (month == 9 and day >= 23) or (month > 9 and month < 12) or (month == 12 and day < 21):
        return "Fall"
    else:
        return "Winter"

def generate_data(num_rows=10000):
    """Generate synthetic data for air conditioner system."""
    
    # Create a starting date and generate sequential dates for a year
    start_date = datetime(2023, 1, 1)
    dates = [start_date + timedelta(days=i % 365) for i in range(num_rows)]
    
    # Extract month and day information
    months = [date.month for date in dates]
    days = [date.day for date in dates]
    
    # Create dataframe
    df = pd.DataFrame({
        'date': dates,
        'month': months,
        'day': days
    })
    
    # Add day of year (1-365)
    df['day_of_year'] = df['date'].dt.dayofyear
    
    # Generate seasonal temperature based on day of year
    # Temperature follows a sinusoidal pattern through the year
    df['base_temp'] = 15 - 15 * np.cos(2 * np.pi * df['day_of_year'] / 365)
    
    # Add random variations to temperature
    df['random_var'] = np.random.normal(0, 3, size=len(df))
    df['temperature'] = df['base_temp'] + df['random_var']
    
    # Round temperature to one decimal place
    df['temperature'] = df['temperature'].round(1)
    
    # Generate window status (more likely to be open in mild weather)
    # Logic: Windows tend to be closed in extreme temperatures
    df['prob_window_open'] = 0.7 * np.exp(-((df['temperature'] - 22)**2) / 50)
    df['window_open'] = np.random.binomial(1, df['prob_window_open'])
    
    # Create target variable: air conditioner setting
    # Logic:
    # - When very cold (below 10°C): high heating (20-24)
    # - When cold (10-18°C): medium heating (18-22)
    # - When mild (18-24°C): minimal AC (17-20)
    # - When warm (24-30°C): medium cooling (16-19)
    # - When hot (above 30°C): high cooling (14-17)
    # - If window open, reduce AC intensity
    
    # Base AC setting related to temperature
    df['base_ac'] = np.where(
        df['temperature'] < 10, np.random.uniform(20, 24, size=len(df)),
        np.where(
            df['temperature'] < 18, np.random.uniform(18, 22, size=len(df)),
            np.where(
                df['temperature'] < 24, np.random.uniform(17, 20, size=len(df)),
                np.where(
                    df['temperature'] < 30, np.random.uniform(16, 19, size=len(df)),
                    np.random.uniform(14, 17, size=len(df))
                )
            )
        )
    )
    
    # Adjust for window status (if window is open, reduce AC intensity)
    window_adjustment = df['window_open'] * np.where(
        df['temperature'] < 20, -1.5,  # Reduce heating if window open when cold
        2.0  # Increase cooling setpoint if window open when warm
    )
    
    df['ac_setting'] = df['base_ac'] + window_adjustment
    df['ac_setting'] = df['ac_setting'].round(1)
    
    # Keep only the relevant columns
    result_df = df[['date', 'temperature', 'window_open', 'ac_setting']]
    
    # Convert window_open to integer for machine learning
    result_df['window_open'] = result_df['window_open'].astype(int)
    
    # Add season as a string column (for better visualization)
    result_df['season'] = result_df['date'].apply(get_season)
    
    # Add day_of_year as feature for better learning
    result_df['day_of_year'] = df['day_of_year']
    
    return result_df

def visualize_data(data):
    """Create visualizations to understand the generated data."""
    plt.figure(figsize=(15, 10))
    
    # Plot 1: Temperature vs Day of Year
    plt.subplot(2, 2, 1)
    plt.scatter(data['day_of_year'], data['temperature'], alpha=0.5, c=data['temperature'], cmap='coolwarm')
    plt.title('Temperature Throughout the Year')
    plt.xlabel('Day of Year')
    plt.ylabel('Temperature (°C)')
    plt.colorbar(label='Temperature (°C)')
    
    # Plot 2: AC Setting vs Temperature colored by window status
    plt.subplot(2, 2, 2)
    for window in [0, 1]:
        subset = data[data['window_open'] == window]
        label = 'Window Open' if window == 1 else 'Window Closed'
        plt.scatter(subset['temperature'], subset['ac_setting'], alpha=0.5, label=label)
    plt.title('AC Setting vs Temperature')
    plt.xlabel('Temperature (°C)')
    plt.ylabel('AC Setting')
    plt.legend()
    
    # Plot 3: Temperature distribution by season
    plt.subplot(2, 2, 3)
    seasons = data['season'].unique()
    for season in seasons:
        subset = data[data['season'] == season]
        plt.hist(subset['temperature'], alpha=0.5, label=season, bins=20)
    plt.title('Temperature Distribution by Season')
    plt.xlabel('Temperature (°C)')
    plt.ylabel('Frequency')
    plt.legend()
    
    # Plot 4: Window open probability vs temperature
    plt.subplot(2, 2, 4)
    temp_bins = np.linspace(data['temperature'].min(), data['temperature'].max(), 20)
    window_probs = []
    bin_centers = []
    
    for i in range(len(temp_bins)-1):
        mask = (data['temperature'] >= temp_bins[i]) & (data['temperature'] < temp_bins[i+1])
        if mask.sum() > 0:
            prob = data.loc[mask, 'window_open'].mean()
            window_probs.append(prob)
            bin_centers.append((temp_bins[i] + temp_bins[i+1]) / 2)
    
    plt.plot(bin_centers, window_probs, 'o-')
    plt.title('Window Open Probability vs Temperature')
    plt.xlabel('Temperature (°C)')
    plt.ylabel('Probability of Window Open')
    
    plt.tight_layout()
    plt.savefig('ac_data_visualization.png')
    print("Visualizations saved to ac_data_visualization.png")

if __name__ == "__main__":
    # Generate data
    print("Generating synthetic data...")
    data = generate_data(10000)
    
    # Save complete dataset
    data.to_csv('ac_dataset.csv', index=False)
    print("Full dataset saved to ac_dataset.csv")
    
    # Split data into train and test sets (80% train, 20% test)
    train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)
    
    # Save train and test datasets
    train_data.to_csv('ac_train_data.csv', index=False)
    test_data.to_csv('ac_test_data.csv', index=False)
    print("Train and test datasets saved to ac_train_data.csv and ac_test_data.csv")
    
    # Create visualizations
    visualize_data(data)
    
    print("Data generation complete!")