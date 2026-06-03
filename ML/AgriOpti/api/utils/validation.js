import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    role: z.enum(["farmer", "retailer", "government", "admin"]),
    preferredLanguage: z.enum(["en", "hi", "te", "ta", "ml"]).default("en"),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum(["farmer", "retailer", "government", "admin"]),
});

export const orderSchema = z.object({
    name: z.string().min(2),
    image: z.string(),
    desc: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    item: z.string(),
    user: z.string().min(1, "Invalid User ID"),
});

export const productSchema = z.object({
    name: z.string().min(2),
    image: z.string().url(),
    desc: z.string(),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    productType: z.enum(["pesticides", "tools", "crops", "fertilizers", "machinery", "irrigation", "greenhouses", "harvesting", "transport"]),
    user: z.string().min(1, "Invalid User ID"),
});

export const mlPredictionSchema = z.object({
    type: z.string({ required_error: "type is required" }),
    features: z.object({
        Nitrogen: z.number({ required_error: "Nitrogen is required", invalid_type_error: "Nitrogen must be a number" }).min(0, "Nitrogen cannot be negative"),
        Phosphorous: z.number({ required_error: "Phosphorous is required", invalid_type_error: "Phosphorous must be a number" }).min(0, "Phosphorous cannot be negative"),
        Potassium: z.number({ required_error: "Potassium is required", invalid_type_error: "Potassium must be a number" }).min(0, "Potassium cannot be negative"),
        Temperature: z.number({ required_error: "Temperature is required", invalid_type_error: "Temperature must be a number" }),
        Humidity: z.number({ required_error: "Humidity is required", invalid_type_error: "Humidity must be a number" }).min(0, "Humidity must be at least 0").max(100, "Humidity must be at most 100"),
        pH: z.number({ required_error: "pH is required", invalid_type_error: "pH must be a number" }).min(0, "pH must be at least 0").max(14, "pH must be at most 14"),
        Rainfall: z.number({ required_error: "Rainfall is required", invalid_type_error: "Rainfall must be a number" }).min(0, "Rainfall cannot be negative")
    }, { required_error: "features object is required" })
});

export const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.errors,
        });
    }
};
