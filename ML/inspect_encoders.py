import joblib
import os

MODEL_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "models", "fertilizer")

try:
    le_soil = joblib.load(os.path.join(MODEL_DIR, "soil_type_encoder.joblib"))
    le_crop = joblib.load(os.path.join(MODEL_DIR, "crop_type_encoder.joblib"))
    
    print("Soil Classes:", le_soil.classes_)
    print("Crop Classes:", le_crop.classes_)
except Exception as e:
    print(f"Error: {e}")
