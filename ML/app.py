# app.py

from flask import Flask, request, jsonify
from flask_cors import CORS
from crop_predict import predict_crop
from crop_predict_pro import predict_crop_from_farmer_input
from predict_disease import predict_plant_disease
from predict_yield import predict_crop_yield
from predict_land import predict_aerial_land
from predict_fertilizer import predict_fertilizer

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from the React frontend


# -----------------------
# Health Check
# -----------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Crop Recommendation API Running",
        "test": "OK"
    })

@app.route("/test-route", methods=["GET"])
def test_route():
    return jsonify({"status": "alive"})


# -----------------------
# Prediction Endpoint
# -----------------------
@app.route("/predict-crop", methods=["POST"])
def predict():

    data = request.get_json()

    try:
        crop = predict_crop(data)

        return jsonify({
            "recommended_crop": crop
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


@app.route("/predict-crop-farmer", methods=["POST", "OPTIONS"])
def predict_farmer():
    """
    New endpoint for farmer-friendly inputs.
    Expected JSON: { soil_type, season, irrigation, prev_crop_group }
    """
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response, 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        crop, transformed = predict_crop_from_farmer_input(data)

        # Return both the recommendation and the estimated NPK for transparency
        response = jsonify({
            "recommended_crop": crop,
            "estimated_npk": transformed
        })
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    except Exception as e:
        print(f"[ERROR] Farmer prediction failed: {e}")
        response = jsonify({
            "error": str(e)
        })
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400


# -----------------------
# Plant Disease Endpoint
# -----------------------
@app.route("/predict-disease", methods=["POST"])
def disease_predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400
        
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        # Read the file bytes
        image_bytes = file.read()
        
        # Get prediction
        result = predict_plant_disease(image_bytes)
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# -----------------------
# Crop Yield Endpoints
# -----------------------
@app.route("/predict-yield", methods=["POST", "OPTIONS"])
def yield_predict():
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response, 200

    data = request.get_json()
    try:
        result = predict_crop_yield(data)
        response = jsonify(result)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    except Exception as e:
        response = jsonify({"error": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400

@app.route("/predict-yield-farmer", methods=["POST", "OPTIONS"])
def yield_predict_farmer():
    """
    Farmer-friendly yield prediction endpoint.
    Expected JSON: { crop_type, soil_type, season, irrigation, land_size }
    """
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response, 200

    data = request.get_json()
    print(f"\n[INFO] --- INCOMING /predict-yield-farmer REQUEST ---")
    print(f"[INFO] Payload: {data}")

    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        from data_converter import CropDataConverter
        # 1. Convert farmer inputs to model parameters
        transformed = CropDataConverter.convert_yield(data)
        print(f"[INFO] Data Converted: {transformed}")
        
        # 2. Get prediction in Quintals per Hectare
        result = predict_crop_yield(transformed)
        print(f"[INFO] Raw Prediction: {result}")
        
        # 3. Calculate total yield based on land size (Acre to Hectare conversion: 1 Acre = 0.4047 Hectare)
        land_size_acre = float(data.get("land_size", 1))
        yield_per_hectare = result["predicted_yield"]
        
        total_yield_quintals = yield_per_hectare * (land_size_acre * 0.4047)
        total_yield_tons = total_yield_quintals * 0.1 # 1 Quintal = 0.1 Ton
        
        response = jsonify({
            "predicted_yield_per_hec": yield_per_hectare,
            "total_expected_yield_tons": round(total_yield_tons, 2),
            "unit": "Tons",
            "estimated_params": transformed,
            "land_size_acre": land_size_acre
        })
        print(f"[INFO] Final Calculated Yield: {total_yield_tons} Tons")
        print(f"[INFO] --- END /predict-yield-farmer REQUEST ---\n")
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response

    except Exception as e:
        print(f"[ERROR] Farmer yield prediction failed: {e}")
        response = jsonify({"error": str(e)})
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 400


# -----------------------
# Aerial Land Analysis Endpoint
# -----------------------
@app.route("/predict-land", methods=["POST"])
def land_predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image file in request"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    lat = request.form.get('lat', 28.6, type=float)
    lon = request.form.get('lon', 77.2, type=float)

    try:
        image_bytes = file.read()
        result = predict_aerial_land(image_bytes, lat, lon)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] Land analysis failed: {e}")
        return jsonify({"error": str(e)}), 400


# -----------------------
# Fertilizer Prediction Endpoint
# -----------------------
@app.route("/predict-fertilizer", methods=["POST"])
def fertilizer_predict():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body provided"}), 400

    required = ['temperature', 'humidity', 'moisture', 'soil_type', 'crop_type', 'nitrogen', 'potassium', 'phosphorous']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    try:
        result = predict_fertilizer(data)
        return jsonify(result)
    except Exception as e:
        print(f"[ERROR] Fertilizer prediction failed: {e}")
        return jsonify({"error": str(e)}), 400


@app.route("/predict-fertilizer-farmer", methods=["POST", "OPTIONS"])
def fertilizer_predict_farmer():
    """
    Farmer-friendly fertilizer prediction endpoint.
    Expected JSON: { soil_type, crop_type, nutrient_status, season, land_size }
    """
    if request.method == "OPTIONS":
        response = jsonify({})
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
        response.headers.add("Access-Control-Allow-Methods", "POST,OPTIONS")
        return response, 200

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        from data_converter import CropDataConverter
        # 1. Convert farmer inputs to model parameters
        transformed = CropDataConverter.convert_fertilizer(data)
        
        # 2. Get prediction
        result = predict_fertilizer(transformed)
        
        # 3. Calculate total quantity based on land size
        land_size = float(data.get("land_size", 1))
        total_qty = result["base_quantity_per_acre"] * land_size

        return jsonify({
            "predicted_fertilizer": result["predicted_fertilizer"],
            "base_quantity_per_acre": result["base_quantity_per_acre"],
            "total_quantity": round(total_qty, 2),
            "schedule": result["schedule"],
            "advice": result["advice"],
            "estimated_params": transformed,
            "land_size": land_size
        })

    except Exception as e:
        print(f"[ERROR] Farmer fertilizer prediction failed: {e}")
        return jsonify({"error": str(e)}), 400


# -----------------------
# Run Server
# -----------------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)