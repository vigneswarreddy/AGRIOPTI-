import requests
import json

def test_yield_farmer():
    url = "http://localhost:5001/predict-yield-farmer"
    payload = {
        "crop_type": "rice",
        "soil_type": "black",
        "season": "Kharif",
        "irrigation": "well",
        "land_size": 5
    }
    
    print(f"Testing Farmer Yield API: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status Code: {response.status_code}")
        print("Response:")
        print(json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_yield_farmer()
