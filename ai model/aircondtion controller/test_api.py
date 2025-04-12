import requests

url = "http://localhost:5000/predict"
data = {
    "temperature": 25.3,
    "window_open": 0,
    "day_of_year": 180
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
print("Response JSON:", response.json())
