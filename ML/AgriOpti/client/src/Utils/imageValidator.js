import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

/**
 * ImageValidator handles ML-based image validation to ensure 
 * uploaded photos are related to plants or farmland.
 */
class ImageValidator {
    constructor() {
        this.model = null;
        this.isLoading = false;
        this.agricultureKeywords = [
            'plant', 'leaf', 'tree', 'crop', 'grass', 'field',
            'vegetation', 'forest', 'garden', 'nature', 'agriculture',
            'corn', 'maize', 'wheat', 'rice', 'paddy', 'soil', 'earth'
        ];
        this.confidenceThreshold = 0.6;
    }

    /**
     * Loads the MobileNet model if not already loaded.
     */
    async loadModel() {
        if (this.model) return this.model;
        if (this.isLoading) {
            // Wait for existing loading process
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.model;
        }

        this.isLoading = true;
        try {
            console.log('Loading MobileNet model...');
            // We use the 'lite' or standard version for performance
            this.model = await mobilenet.load({
                version: 1,
                alpha: 1.0
            });
            console.log('MobileNet model loaded successfully.');
            return this.model;
        } catch (error) {
            console.error('Failed to load MobileNet model:', error);
            throw new Error('Could not initialize validation engine.');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Validates if an image contains plant or farmland content.
     * @param {File | HTMLImageElement | HTMLCanvasElement} imageSource 
     * @returns {Promise<{isValid: boolean, reason: string, labels: string[]}>}
     */
    async validateImage(imageSource) {
        try {
            const model = await this.loadModel();

            let imgElement;
            if (imageSource instanceof File) {
                imgElement = await this._createImageElementFromFile(imageSource);
            } else {
                imgElement = imageSource;
            }

            // Get predictions
            const predictions = await model.classify(imgElement);

            // Clean up if we created a temporary image element
            if (imageSource instanceof File) {
                URL.revokeObjectURL(imgElement.src);
            }

            const labels = predictions.map(p => p.className.toLowerCase());
            const topPrediction = predictions[0];

            // Check if any prediction matches our agricultural keywords
            const hasAgriContent = labels.some(label =>
                this.agricultureKeywords.some(keyword => label.includes(keyword))
            );

            // Check confidence of the top prediction
            // Even if it's a plant, if confidence is very low, we might want to reject
            const isConfident = topPrediction && topPrediction.probability >= this.confidenceThreshold;

            if (hasAgriContent && isConfident) {
                return {
                    isValid: true,
                    reason: 'Image verified as relevant agricultural content.',
                    labels: labels
                };
            }

            if (!hasAgriContent) {
                return {
                    isValid: false,
                    reason: 'Please upload a valid plant or farmland image. Detected objects: ' + labels.join(', '),
                    labels: labels
                };
            }

            if (!isConfident) {
                return {
                    isValid: false,
                    reason: `Low confidence (${(topPrediction.probability * 100).toFixed(0)}%). Please provide a clearer image of the plant or land.`,
                    labels: labels
                };
            }

        } catch (error) {
            console.error('Validation error:', error);
            return {
                isValid: false,
                reason: 'Error during image validation: ' + error.message,
                labels: []
            };
        }
    }

    /**
     * Utility to create an HTMLImageElement from a File object
     * @private
     */
    _createImageElementFromFile(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }
}

// Export a singleton instance
const validator = new ImageValidator();
export default validator;
