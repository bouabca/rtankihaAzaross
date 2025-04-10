import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Set random seed for reproducibility
np.random.seed(42)

# Number of data points to generate
n_samples = 10000

# Generate features
day_of_year = np.random.randint(1, 366, n_samples)
hours_of_use = np.random.randint(0, 24, n_samples)
daily_use = np.random.randint(1, 13, n_samples)  # 1-12 hours

# Generate categorical features
sensor_types = ['strong', 'medium', 'weak']
sensor_type = np.random.choice(sensor_types, n_samples)

ac_types = ['central', 'split', 'window', 'portable']
ac_type = np.random.choice(ac_types, n_samples)

# Create a function to determine if maintenance is needed based on the features
def needs_maintenance(day, hours, daily, sensor, ac):
    # Base probability
    prob = 0.2
    
    # Increase probability based on day of year (summer months have higher wear)
    if 150 <= day <= 250:  # Summer months
        prob += 0.1
    
    # Increase probability based on hours of use
    prob += hours / 100
    
    # Increase probability based on daily use
    prob += daily / 60
    
    # Adjust based on sensor type
    if sensor == 'weak':
        prob += 0.15
    elif sensor == 'medium':
        prob += 0.05
    
    # Adjust based on AC type
    if ac == 'window':
        prob += 0.1
    elif ac == 'portable':
        prob += 0.05
    
    # Determine maintenance needed using probability
    return 1 if np.random.random() < prob else 0

# Generate target variable
maintenance_needed = np.array([needs_maintenance(day_of_year[i], hours_of_use[i], 
                                               daily_use[i], sensor_type[i], 
                                               ac_type[i]) for i in range(n_samples)])

# Convert sensor_type to one-hot encoding
sensor_type_dummies = pd.get_dummies(sensor_type, prefix='sensor_type')
sensor_strong = sensor_type_dummies['sensor_type_strong'].values
sensor_medium = sensor_type_dummies['sensor_type_medium'].values
sensor_weak = sensor_type_dummies['sensor_type_weak'].values

# Convert ac_type to one-hot encoding
ac_type_dummies = pd.get_dummies(ac_type, prefix='ac_type')
ac_central = ac_type_dummies['ac_type_central'].values
ac_split = ac_type_dummies['ac_type_split'].values
ac_window = ac_type_dummies['ac_type_window'].values
ac_portable = ac_type_dummies['ac_type_portable'].values

# Create DataFrame
data = pd.DataFrame({
    'day_of_year': day_of_year,
    'hours_of_use': hours_of_use,
    'daily_use': daily_use,
    'sensor_type_strong': sensor_strong,
    'sensor_type_medium': sensor_medium,
    'sensor_type_weak': sensor_weak,
    'ac_type_central': ac_central,
    'ac_type_split': ac_split,
    'ac_type_window': ac_window,
    'ac_type_portable': ac_portable,
    'maintenance_needed': maintenance_needed
})

# Split the data into training and testing sets (80% train, 20% test)
train_data, test_data = train_test_split(data, test_size=0.2, random_state=42)

# Create directory if it doesn't exist
if not os.path.exists('data'):
    os.makedirs('data')

# Save the datasets to CSV files
train_data.to_csv('data/ac_maintenance_train.csv', index=False)
test_data.to_csv('data/ac_maintenance_test.csv', index=False)

print(f"Generated {n_samples} samples of data:")
print(f"Training set: {train_data.shape[0]} samples")
print(f"Testing set: {test_data.shape[0]} samples")
print("\nSample of the data:")
print(data.head())

# Count the number of maintenance cases
print(f"\nMaintenance required: {maintenance_needed.sum()} ({maintenance_needed.sum()/n_samples:.2%})")
print(f"No maintenance required: {n_samples - maintenance_needed.sum()} ({1 - maintenance_needed.sum()/n_samples:.2%})")

# Create some visualizations to understand the data
import matplotlib.pyplot as plt
import seaborn as sns

# Create directory for plots if it doesn't exist
if not os.path.exists('plots'):
    os.makedirs('plots')

# Plot maintenance distribution
plt.figure(figsize=(10, 6))
sns.countplot(x='maintenance_needed', data=data)
plt.title('Distribution of Maintenance Needed')
plt.xlabel('Maintenance Needed (1 = Yes, 0 = No)')
plt.ylabel('Count')
plt.savefig('plots/maintenance_distribution.png')

# Plot maintenance by sensor type
plt.figure(figsize=(12, 6))
maintenance_by_sensor = data.groupby(['sensor_type_strong', 'sensor_type_medium', 'sensor_type_weak'])['maintenance_needed'].mean()

# Convert back to original categories for plotting
sensor_mapping = []
for strong, medium, weak in maintenance_by_sensor.index:
    if strong == 1:
        sensor_mapping.append('strong')
    elif medium == 1:
        sensor_mapping.append('medium')
    elif weak == 1:
        sensor_mapping.append('weak')

plt.bar(sensor_mapping, maintenance_by_sensor.values)
plt.title('Maintenance Probability by Sensor Type')
plt.xlabel('Sensor Type')
plt.ylabel('Probability of Needing Maintenance')
plt.savefig('plots/maintenance_by_sensor.png')

# Plot maintenance by AC type
plt.figure(figsize=(12, 6))
maintenance_by_ac = data.groupby(['ac_type_central', 'ac_type_split', 'ac_type_window', 'ac_type_portable'])['maintenance_needed'].mean()

# Convert back to original categories for plotting
ac_mapping = []
for central, split, window, portable in maintenance_by_ac.index:
    if central == 1:
        ac_mapping.append('central')
    elif split == 1:
        ac_mapping.append('split')
    elif window == 1:
        ac_mapping.append('window')
    elif portable == 1:
        ac_mapping.append('portable')

plt.bar(ac_mapping, maintenance_by_ac.values)
plt.title('Maintenance Probability by AC Type')
plt.xlabel('AC Type')
plt.ylabel('Probability of Needing Maintenance')
plt.savefig('plots/maintenance_by_ac.png')

print("Data generation and exploratory visualizations complete.")