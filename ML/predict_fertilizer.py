# predict_fertilizer.py — Fertilizer Recommendation

import os
import joblib
import pandas as pd

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models", "fertilizer")

# ── Load models at import time ─────────────────────────────────────────
fertilizer_model = None
le_soil = None
le_crop = None
le_fertilizer = None

try:
    fertilizer_model = joblib.load(os.path.join(MODEL_DIR, "fertilizer_prediction_model.joblib"))
    le_soil = joblib.load(os.path.join(MODEL_DIR, "soil_type_encoder.joblib"))
    le_crop = joblib.load(os.path.join(MODEL_DIR, "crop_type_encoder.joblib"))
    le_fertilizer = joblib.load(os.path.join(MODEL_DIR, "fertilizer_name_encoder.joblib"))
    print("✅ Fertilizer prediction model loaded")
except Exception as e:
    print(f"⚠️ Fertilizer model failed to load: {e}")


# ── Fertilizer Details Logic ──────────────────────────────────────────
FERTILIZER_DETAILS = {
    "Urea": {
        "base_quantity": 50, # kg per acre
        "schedule": [
            "Basal Dose: Apply 50% during sowing.",
            "Top Dressing 1: Apply 25% after 30 days (tillering/branching stage).",
            "Top Dressing 2: Apply 25% after 60 days (panicle initiation/flowering)."
        ],
        "advice": "Apply when soil is moist but not waterlogged. Avoid application during heavy rain."
    },
    "DAP": {
        "base_quantity": 40,
        "schedule": [
            "Basal Dose: Apply 100% at the time of sowing/planting near the root zone."
        ],
        "advice": "Ensure proper depth (2-3 inches) for better phosphorous availability."
    },
    "MOP": {
        "base_quantity": 30,
        "schedule": [
            "Basal Dose: Apply 100% during sowing for most crops.",
            "Note: For Sandy soils, apply in two split doses to prevent leaching."
        ],
        "advice": "Improves disease resistance and grain quality."
    },
    "10-26-26": {
        "base_quantity": 60,
        "schedule": ["Basal Dose: Apply 100% during sowing."],
        "advice": "Good for root crops and oilseeds."
    },
    "14-35-14": {
        "base_quantity": 50,
        "schedule": ["Basal Dose: Apply 100% during sowing."],
        "advice": "High phosphorous content aids early root vigor."
    },
    "17-17-17": {
        "base_quantity": 45,
        "schedule": ["Basal Dose: Apply 100% during sowing."],
        "advice": "General purpose balanced fertilizer."
    },
    "20-20-0": {
        "base_quantity": 55,
        "schedule": [
            "Basal Dose: Apply 75% during sowing.",
            "Top Dressing: Apply 25% after 30 days."
        ],
        "advice": "Best suited for crops requiring high Nitrogen and Phosphorous."
    },
    "28-28-0": {
        "base_quantity": 40,
        "schedule": [
            "Basal Dose: Apply 70% during sowing.",
            "Top Dressing: Apply 30% after 40 days."
        ],
        "advice": "Highly concentrated Nitrogen-Phosphorous mix."
    }
}

def get_fertilizer_details(fertilizer_name, crop_type):
    """
    Returns quantity (kg/acre) and schedule for the given fertilizer.
    """
    details = FERTILIZER_DETAILS.get(fertilizer_name, {
        "base_quantity": 50,
        "schedule": ["Apply as per local agricultural extension officer's advice."],
        "advice": "Generic fertilizer application."
    })
    
    # Slight adjustment based on crop intensity (simplified)
    multiplier = 1.0
    if crop_type.lower() in ['sugarcane', 'paddy', 'wheat']:
        multiplier = 1.2
    elif crop_type.lower() in ['pulses', 'oil seeds']:
        multiplier = 0.8
        
    return {
        "base_quantity": round(details["base_quantity"] * multiplier, 2),
        "schedule": details["schedule"],
        "advice": details["advice"]
    }


# ── Main prediction function ───────────────────────────────────────────
def predict_fertilizer(data):
    """
    Predict optimal fertilizer and return application details.
    data dict keys: temperature, humidity, moisture, soil_type, crop_type,
                    nitrogen, potassium, phosphorous
    """
    if fertilizer_model is None:
        raise RuntimeError("Fertilizer model is not loaded")

    # Pre-process
    input_data = {
        "Temparature": [float(data["temperature"])],
        "Humidity ": [float(data["humidity"])],
        "Moisture": [int(data["moisture"])],
        "Soil Type": int(le_soil.transform([data["soil_type"]])[0]),
        "Crop Type": int(le_crop.transform([data["crop_type"]])[0]),
        "Nitrogen": [int(data["nitrogen"])],
        "Potassium": [int(data["potassium"])],
        "Phosphorous": [int(data["phosphorous"])],
    }
    input_df = pd.DataFrame(input_data)

    # Predict
    prediction = fertilizer_model.predict(input_df)
    predicted_fertilizer = str(le_fertilizer.inverse_transform(prediction)[0])

    # Get additional details
    details = get_fertilizer_details(predicted_fertilizer, data["crop_type"])

    return {
        "predicted_fertilizer": predicted_fertilizer,
        "base_quantity_per_acre": details["base_quantity"],
        "schedule": details["schedule"],
        "advice": details["advice"]
    }
