# crop_predict_pro.py
# Production version integrating the Data Conversion Layer

import numpy as np
import joblib
from tensorflow.keras.models import load_model
import os
from data_converter import CropDataConverter

# -----------------------
# Load ML artifacts
# -----------------------
base_path = os.path.dirname(os.path.abspath(__file__))
model = load_model(os.path.join(base_path, "models/Crop_Recomm/crop_recommendation_CNN.keras"))
label_encoder = joblib.load(os.path.join(base_path, "models/Crop_Recomm/crop_label_encoder.pkl"))
scaler = joblib.load(os.path.join(base_path, "models/Crop_Recomm/feature_scaler.pkl"))

def predict_crop_from_farmer_input(farmer_data):
    """
    Takes farmer input, converts it to NPK/weather, and runs prediction.
    """
    # 1. Convert farmer data to model input
    model_input = CropDataConverter.convert(farmer_data)
    
    # 2. Extract features in correct order
    features = np.array([
        model_input["N"],
        model_input["P"],
        model_input["K"],
        model_input["temperature"],
        model_input["humidity"],
        model_input["ph"],
        model_input["rainfall"]
    ]).reshape(1, -1)

    # 3. Scale and Reshape for CNN
    scaled_features = scaler.transform(features)
    cnn_input = scaled_features.reshape(scaled_features.shape[0], scaled_features.shape[1], 1)

    # 4. Predict
    pred_probs = model.predict(cnn_input, verbose=0)
    pred_class = np.argmax(pred_probs, axis=1)
    crop = label_encoder.inverse_transform(pred_class)[0]

    return crop, model_input

if __name__ == "__main__":
    print("\n--- AgriOpti Pro: Farmer-Friendly Prediction ---")
    
    # Simulating Farmer Interface
    inputs = {
        "soil_type": "black",
        "season": "Kharif",
        "irrigation": "well",
        "prev_crop_group": "legumes"
    }
    
    crop, transformed = predict_crop_from_farmer_input(inputs)
    
    print("\n[Transformation Step]")
    print(f"Calculated NPK: N={transformed['N']}, P={transformed['P']}, K={transformed['K']}")
    print(f"Climate Estimates: Temp={transformed['temperature']}°C, Rain={transformed['rainfall']}mm")
    
    print(f"\n✅ Recommended Crop for these conditions: {crop.upper()}")
