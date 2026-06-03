import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

/**
 * ImageValidator – validates that an uploaded image is plant/leaf/farmland content.
 *
 * Strategy: Run MobileNet (ImageNet-1k) classification and check whether ANY
 * of the top-5 predictions belong to a broad set of plant/food/nature labels.
 * We use SUBSTRING matching (not whole-word) so that compound words like
 * "flowerpot", "rosehip", "greenhouse" all match their component keywords.
 */
class ImageValidator {
    constructor() {
        this.model = null;
        this.isLoading = false;

        /**
         * Comprehensive list of strings that appear in ImageNet class names
         * that indicate plant, food, nature, or farmland content.
         *
         * These use SUBSTRING matching, so short tokens like "fig", "pot",
         * "hip" are intentionally kept short to catch compound labels like
         * "flowerpot", "rose hip", "fig tree", etc.
         */
        this.agricultureKeywords = [
            // ── Direct plant parts ──────────────────────────────────────────
            'leaf', 'leaves', 'foliage', 'petal', 'stem', 'root',
            'branch', 'trunk', 'bark', 'thorn', 'bud', 'blossom',
            'sprout', 'seedling', 'seed', 'bulb', 'tuber',
            'frond', 'fronds', 'spore', 'pollen', 'stamen',

            // ── Trees & shrubs ───────────────────────────────────────────────
            'tree', 'shrub', 'bush', 'plant', 'sapling',
            'palm', 'pine', 'oak', 'maple', 'birch', 'willow',
            'bamboo', 'cactus', 'succulent', 'fern', 'moss',
            'reed', 'vine', 'ivy', 'creeper', 'algae',

            // ── Flowers ──────────────────────────────────────────────────────
            'flower', 'rose', 'daisy', 'tulip', 'lily', 'orchid',
            'sunflower', 'dandelion', 'poppy', 'carnation',
            'chrysanthemum', 'lavender', 'hibiscus', 'jasmine',

            // ── Vegetables (incl. ImageNet class names) ───────────────────────
            'vegetable', 'lettuce', 'cabbage', 'broccoli', 'cauliflower',
            'spinach', 'kale', 'celery', 'asparagus', 'artichoke',
            'zucchini', 'cucumber', 'squash', 'pumpkin', 'gourd',
            'pepper', 'chilli', 'tomato', 'eggplant', 'aubergine',
            'onion', 'garlic', 'leek', 'shallot', 'radish',
            'carrot', 'beetroot', 'turnip', 'parsnip', 'yam',

            // ── Fruits & berries (incl. ImageNet class names) ─────────────────
            'fruit', 'berry', 'apple', 'banana', 'mango', 'orange',
            'lemon', 'lime', 'grape', 'strawberry', 'blueberry',
            'raspberry', 'blackberry', 'gooseberry', 'cranberry',
            'cherry', 'plum', 'peach', 'pear', 'apricot',
            'pineapple', 'coconut', 'papaya', 'watermelon', 'melon',
            'fig', 'date', 'pomegranate', 'guava', 'lychee',
            'avocado', 'kiwi', 'passion', 'jackfruit',
            // ImageNet compound labels containing 'hip'
            'hip', 'rosehip', 'rose hip',

            // ── Crops & grains ───────────────────────────────────────────────
            'crop', 'crops', 'grain', 'corn', 'maize', 'wheat',
            'rice', 'paddy', 'barley', 'oats', 'sorghum', 'millet',
            'rye', 'buckwheat', 'quinoa',
            'cotton', 'tobacco', 'sugarcane', 'sugarbeet',
            'soybean', 'soya', 'chickpea', 'lentil', 'peanut',
            'groundnut', 'sunflower seed',

            // ── Land / field ─────────────────────────────────────────────────
            'field', 'farmland', 'farm', 'pasture', 'meadow',
            'grassland', 'grass', 'lawn', 'prairie', 'savanna',
            'soil', 'earth', 'mud', 'dirt', 'loam', 'compost',
            'crop field', 'paddy field',
            'harvest', 'orchard', 'vineyard', 'plantation',

            // ── Plant containers / settings (ImageNet-specific) ───────────────
            'pot', 'flowerpot', 'vase', 'greenhouse', 'garden',
            'herbarium', 'herb', 'botanical',

            // ── General nature / ecology ──────────────────────────────────────
            'nature', 'natural', 'vegetation', 'flora', 'forest',
            'woodland', 'jungle', 'canopy', 'wetland', 'mangrove',
            'agriculture', 'agricultural',

            // ── Fungi (can appear in plant disease contexts) ──────────────────
            'mushroom', 'fungus', 'fungi', 'truffle',
        ];
    }

    /** Loads the MobileNet v2 model lazily (singleton). */
    async loadModel() {
        if (this.model) return this.model;
        if (this.isLoading) {
            while (this.isLoading) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return this.model;
        }

        this.isLoading = true;
        try {
            console.log('[ImageValidator] Loading MobileNet v2…');
            this.model = await mobilenet.load({ version: 2, alpha: 1.0 });
            console.log('[ImageValidator] MobileNet ready.');
            return this.model;
        } catch (err) {
            console.error('[ImageValidator] Model load error:', err);
            throw new Error('Could not initialise the image validation engine.');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Returns true if the given label string contains any keyword as a substring.
     * Substring matching is intentional: it catches "flowerpot" ⊃ "pot",
     * "rose hip" ⊃ "hip", "greenhouse" ⊃ "green", etc.
     */
    _isAgriLabel(label) {
        const lower = label.toLowerCase();
        return this.agricultureKeywords.some(kw => lower.includes(kw));
    }

    /**
     * Validates whether an image is plant / leaf / farmland content.
     * @param {File | HTMLImageElement | HTMLCanvasElement} imageSource
     * @returns {Promise<{isValid: boolean, reason: string, labels: string[]}>}
     */
    async validateImage(imageSource) {
        try {
            const model = await this.loadModel();

            // Build an HTMLImageElement from File if needed
            let imgElement;
            if (imageSource instanceof File) {
                imgElement = await this._fileToImage(imageSource);
            } else {
                imgElement = imageSource;
            }

            // Top-5 predictions
            const predictions = await model.classify(imgElement, 5);

            if (imageSource instanceof File) {
                URL.revokeObjectURL(imgElement.src);
            }

            const labels = predictions.map(p => p.className.toLowerCase());
            console.log('[ImageValidator] Predictions:', predictions);

            // ── Check 1: reject completely unrecognisable / blurry images ────
            const topProb = predictions[0]?.probability ?? 0;
            if (topProb < 0.08) {
                return {
                    isValid: false,
                    reason: 'The image appears too blurry or unclear. Please upload a sharp, well-lit photo of a plant leaf or farmland.',
                    labels,
                };
            }

            // ── Check 2: does ANY top-5 prediction match plant/nature content? ─
            const agriMatch = predictions.find(p => this._isAgriLabel(p.className));

            if (agriMatch) {
                // ✅ At least one prediction is plant/nature-related → allow
                console.log('[ImageValidator] Matched:', agriMatch.className, `(${(agriMatch.probability * 100).toFixed(1)}%)`);
                return {
                    isValid: true,
                    reason: 'Image verified as relevant agricultural content.',
                    labels,
                    matchedLabel: agriMatch.className,
                };
            }

            // ── Check 3: no match at all → reject with helpful message ────────
            const topLabels = predictions.slice(0, 3).map(p => p.className).join(', ');
            return {
                isValid: false,
                reason: `⚠️ This does not appear to be a plant or farmland image.\n\nDetected: ${topLabels}\n\nPlease upload a clear photo of a plant leaf, diseased crop, or aerial/satellite farmland view.`,
                labels,
            };

        } catch (err) {
            console.error('[ImageValidator] Error during validation:', err);
            // Soft fail: let the image through so the HuggingFace model can handle it
            return {
                isValid: true,
                reason: 'Validation skipped due to an internal error.',
                labels: [],
            };
        }
    }

    /** Creates an HTMLImageElement from a File object. */
    _fileToImage(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }
}

// Singleton – model is loaded once and reused across both pages
const imageValidator = new ImageValidator();
export default imageValidator;
