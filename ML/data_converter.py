# data_converter.py

import json

class CropDataConverter:
    """
    Converts farmer-friendly inputs into ML-compatible NPK and climate values.
    Uses rule-based estimation for Indian agricultural conditions.
    """
    
    # Default NPK values based on Indian Soil Research (ICAR/NAPT)
    SOIL_NPK_DEFAULTS = {
        "black": {"N": 50, "P": 45, "K": 70, "ph_default": 7.5},
        "red":   {"N": 40, "P": 30, "K": 50, "ph_default": 6.5},
        "sandy": {"N": 25, "P": 20, "K": 30, "ph_default": 7.0},
        "clay":  {"N": 65, "P": 55, "K": 60, "ph_default": 6.0},
        "alluvial": {"N": 60, "P": 50, "K": 80, "ph_default": 7.0},
        "unknown": {"N": 45, "P": 40, "K": 50, "ph_default": 7.0}
    }

    # Seasonal weather defaults (Approximate for India)
    SEASON_DEFAULTS = {
        "Kharif": {"temperature": 30, "humidity": 80, "rainfall": 1000}, # Monsoon
        "Rabi":   {"temperature": 22, "humidity": 50, "rainfall": 200},  # Winter
        "Summer": {"temperature": 38, "humidity": 30, "rainfall": 50}    # Pre-monsoon
    }

    # Impact of previous crop on Nitrogen levels
    PREVIOUS_CROP_IMPACT = {
        "legumes": 15,    # Pulses, Peanuts (N-Fixers)
        "cereals": -10,   # Wheat, Maize (N-Depleters)
        "fiber": -5,      # Cotton
        "sugar":-20       # Sugarcane (Extremely heavy feeder)
    }

    @classmethod
    def convert(cls, farmer_input):
        """
        Main conversion logic for Crop Recommendation.
        """
        # (Existing logic for recommendation)
        soil = farmer_input.get("soil_type", "unknown").lower()
        if soil not in cls.SOIL_NPK_DEFAULTS:
            soil = "unknown"
            
        base_npk = cls.SOIL_NPK_DEFAULTS[soil].copy()
        prev_crop_group = farmer_input.get("prev_crop_group", "unknown").lower()
        n_impact = cls.PREVIOUS_CROP_IMPACT.get(prev_crop_group, 0)
        base_npk["N"] += n_impact

        season = farmer_input.get("season", "Kharif")
        weather = cls.SEASON_DEFAULTS.get(season, cls.SEASON_DEFAULTS["Kharif"])
        
        irrigation = farmer_input.get("irrigation", "rainfed").lower()
        if irrigation != "rainfed":
            base_npk["N"] += 5
            base_npk["P"] += 5

        transformed_output = {
            "N": max(0, base_npk["N"]),
            "P": max(0, base_npk["P"]),
            "K": max(0, base_npk["K"]),
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "ph": base_npk["ph_default"],
            "rainfall": weather["rainfall"]
        }
        
        return transformed_output

    @classmethod
    def convert_yield(cls, farmer_input):
        """
        Conversion logic for Crop Yield Prediction.
        Expected input: { crop_type, soil_type, season, irrigation, land_size }
        """
        # 1. Weather from Season
        season = farmer_input.get("season", "Kharif")
        weather = cls.SEASON_DEFAULTS.get(season, cls.SEASON_DEFAULTS["Kharif"])
        
        # 2. pH from Soil Type
        soil = farmer_input.get("soil_type", "unknown").lower()
        if soil not in cls.SOIL_NPK_DEFAULTS:
            soil = "unknown"
        soil_ph = cls.SOIL_NPK_DEFAULTS[soil]["ph_default"]
        
        # 3. Estimate Fertilizer Used (kg/ha)
        # Using 150 as a standard baseline for major crops (Wheat/Rice)
        fertilizer_base = 150
        irrigation = farmer_input.get("irrigation", "rainfed").lower()
        
        # Better irrigation usually correlates with higher fertilizer intensity/usage in India
        if irrigation == "drip":
            fertilizer_base += 30
        elif irrigation == "well" or "canal" in irrigation:
            fertilizer_base += 15
        
        # Soil health impact on fertilizer uptake/requirement
        if soil == "alluvial" or soil == "black":
            fertilizer_base += 10 # More productive soils often get more inputs
            
        return {
            "rainfall": weather["rainfall"],
            "temperature": weather["temperature"],
            "soil_ph": soil_ph,
            "fertilizer_used": fertilizer_base,
            "crop_type": farmer_input.get("crop_type", "wheat"),
            "irrigation_type": farmer_input.get("irrigation", "rainfed")
        }

    @classmethod
    def convert_fertilizer(cls, farmer_input):
        """
        Conversion logic for Fertilizer Prediction.
        Expected input: { soil_type, crop_type, nutrient_status, season }
        """
        # 1. Map Farmer Soil to Model Soil
        soil_input = farmer_input.get("soil_type", "Loamy")
        soil_map = {
            "Black Soil": "Black",
            "Red Soil": "Red",
            "Sandy Soil": "Sandy",
            "Clayey Soil": "Clayey",
            "Alluvial Soil": "Loamy",
            "Loamy Soil": "Loamy"
        }
        model_soil = soil_map.get(soil_input, "Loamy")
        
        # 2. Map Farmer Crop to Model Crop
        crop_input = farmer_input.get("crop_type", "Wheat")
        crop_map = {
            "Rice": "Paddy",
            "Maize": "Maize",
            "Wheat": "Wheat",
            "Cotton": "Cotton",
            "Sugarcane": "Sugarcane",
            "Tobacco": "Tobacco",
            "Millets": "Millets",
            "Pulses": "Pulses",
            "Groundnuts": "Groundnuts"
        }
        model_crop = crop_map.get(crop_input, "Wheat")

        # 3. Base NPK from Soil Type (using lowercase key for defaults)
        soil_key = model_soil.lower()
        if soil_key not in cls.SOIL_NPK_DEFAULTS:
            soil_key = "unknown"
        base_npk = cls.SOIL_NPK_DEFAULTS[soil_key].copy()

        # 4. Adjust NPK based on Nutrient Status
        status = farmer_input.get("nutrient_status", "Average").lower()
        multiplier = 1.0
        if status == "exhausted": multiplier = 0.6
        elif status == "good": multiplier = 1.4
        
        # 5. Weather from Season
        season = farmer_input.get("season", "Kharif")
        weather = cls.SEASON_DEFAULTS.get(season, cls.SEASON_DEFAULTS["Kharif"])

        return {
            "temperature": weather["temperature"],
            "humidity": weather["humidity"],
            "moisture": 45 if season == "Kharif" else 30, # Default moisture
            "soil_type": model_soil,
            "crop_type": model_crop,
            "nitrogen": int(base_npk["N"] * multiplier),
            "phosphorous": int(base_npk["P"] * multiplier),
            "potassium": int(base_npk["K"] * multiplier)
        }

# Example Usage
if __name__ == "__main__":
    farmer_data = {
        "crop_type": "rice",
        "soil_type": "black",
        "season": "Kharif",
        "irrigation": "canal",
        "land_size": 10
    }
    
    yield_input = CropDataConverter.convert_yield(farmer_data)
    print("Yield Model Input Mapping:")
    print(json.dumps(yield_input, indent=2))
