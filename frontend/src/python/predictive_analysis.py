import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from datetime import datetime, timedelta

# Load the CSV files
gas_data = pd.read_csv('datasets/gas.csv')
oil_data = pd.read_csv('datasets/oil.csv')

# Check for duplicates
gas_data.drop_duplicates(inplace=True)
oil_data.drop_duplicates(inplace=True)

# Convert timeStamp to datetime
gas_data['timeStamp'] = pd.to_datetime(gas_data['timeStamp'])
oil_data['timeStamp'] = pd.to_datetime(oil_data['timeStamp'])

# Prepare data for prediction
def prepare_data(df, value_col, status_col):
    df['label'] = df[status_col].apply(lambda x: 1 if x == 'BAD' else 0)
    X = df[['sectorNo', value_col]]
    y = df['label']
    return X, y

# Gas data
X_gas, y_gas = prepare_data(gas_data, 'gasValue', 'gasStatus')
X_train_gas, X_test_gas, y_train_gas, y_test_gas = train_test_split(X_gas, y_gas, test_size=0.2, random_state=42)

# Oil data
X_oil, y_oil = prepare_data(oil_data, 'oilValue', 'oilStatus')
X_train_oil, X_test_oil, y_train_oil, y_test_oil = train_test_split(X_oil, y_oil, test_size=0.2, random_state=42)

# Train models
model_gas = LogisticRegression().fit(X_train_gas, y_train_gas)
model_oil = LogisticRegression().fit(X_train_oil, y_train_oil)

# Predict on sector 1 for gas and sector 2 for oil
future_mean_gas = gas_data[gas_data['sectorNo'] == 1]['gasValue'].mean()
future_mean_oil = oil_data[oil_data['sectorNo'] == 2]['oilValue'].mean()
pred_gas = model_gas.predict([[1, future_mean_gas]])
pred_oil = model_oil.predict([[2, future_mean_oil]])

print(f"Prediction for sector 1 (gas): {'BAD' if pred_gas[0] == 1 else 'GOOD'}")
print(f"Prediction for sector 2 (oil): {'BAD' if pred_oil[0] == 1 else 'GOOD'}")

# Visualization
plt.figure(figsize=(14, 7))

# Plot historical data for gas
plt.subplot(2, 1, 1)
plt.scatter(gas_data[gas_data['label'] == 1]['timeStamp'], gas_data[gas_data['label'] == 1]['gasValue'], color='red', label='BAD')
plt.scatter(gas_data[gas_data['label'] == 0]['timeStamp'], gas_data[gas_data['label'] == 0]['gasValue'], color='green', label='GOOD')
plt.axhline(y=future_mean_gas, color='blue', linestyle='--', label='Mean Value (Sector 1)')
plt.title('Historical Gas Values and Predictions')
plt.xlabel('Time')
plt.ylabel('Gas Value')
plt.legend()

# Plot predicted data points for gas for the next month
future_dates_gas = [gas_data['timeStamp'].max() + timedelta(days=i) for i in range(1, 31)]
predicted_status_gas = ['BAD' if pred_gas[0] == 1 else 'GOOD'] * 30
predicted_values_gas = [future_mean_gas] * 30
plt.scatter(future_dates_gas, predicted_values_gas, color='orange', label='Predicted BAD' if pred_gas[0] == 1 else 'Predicted GOOD', marker='*', s=100)

# Plot historical data for oil
plt.subplot(2, 1, 2)
plt.scatter(oil_data[oil_data['label'] == 1]['timeStamp'], oil_data[oil_data['label'] == 1]['oilValue'], color='red', label='BAD')
plt.scatter(oil_data[oil_data['label'] == 0]['timeStamp'], oil_data[oil_data['label'] == 0]['oilValue'], color='green', label='GOOD')
plt.axhline(y=future_mean_oil, color='blue', linestyle='--', label='Mean Value (Sector 2)')
plt.title('Historical Oil Values and Predictions')
plt.xlabel('Time')
plt.ylabel('Oil Value')
plt.legend()

# Plot predicted data points for oil for the next month
future_dates_oil = [oil_data['timeStamp'].max() + timedelta(days=i) for i in range(1, 31)]
predicted_status_oil = ['BAD' if pred_oil[0] == 1 else 'GOOD'] * 30
predicted_values_oil = [future_mean_oil] * 30
plt.scatter(future_dates_oil, predicted_values_oil, color='orange', label='Predicted BAD' if pred_oil[0] == 1 else 'Predicted GOOD', marker='*', s=100)

plt.tight_layout()
plt.show()