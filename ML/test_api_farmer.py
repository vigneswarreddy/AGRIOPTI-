import requests
import json

url = "http://localhost:5001/predict-fertilizer-farmer"
payload = {
    "soil_type": "Black Soil",
    "crop_type": "Maize",
    "nutrient_status": "Average",
    "season": "Kharif",
    "land_size": 5
}

try:
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
