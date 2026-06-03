// Role-based access control utility

export const ROLES = {
    FARMER: 'farmer',
    RETAILER: 'retailer',
    GOVERNMENT: 'government',
};

// Role display config
export const ROLE_CONFIG = {
    farmer: { label: '🌾 Farmer', badge: 'bg-green-600', color: 'text-green-400' },
    retailer: { label: '🏪 Retailer', badge: 'bg-blue-600', color: 'text-blue-400' },
    government: { label: '🏛️ Government Official', badge: 'bg-amber-600', color: 'text-amber-400' },
};

// Page-level access: which roles can visit each route
export const ROUTE_ROLES = {
    '/home': ['farmer', 'retailer', 'government'],
    '/dashboard': ['farmer', 'retailer', 'government'],
    '/weather': ['farmer', 'retailer', 'government'],
    '/forum': ['farmer', 'retailer', 'government'],
    '/ai-chatbot': ['farmer', 'retailer', 'government'],
    '/education': ['farmer', 'retailer', 'government'],
    '/about': ['farmer', 'retailer', 'government'],
    '/market': ['farmer', 'retailer', 'government'],
    '/land-records': ['farmer', 'retailer', 'government'],
    '/nearby': ['farmer', 'retailer', 'government'],
    '/crop-recommendation': ['farmer', 'government'],          // Retailers excluded
    '/inventory': ['farmer', 'retailer'],            // Government excluded
    '/order': ['farmer', 'retailer'],            // Government excluded
};

// Feature-level access for UI gating
export const FEATURES = {
    cropRecommendation: ['farmer', 'government'],
    inventory: ['farmer', 'retailer'],
    orders: ['farmer', 'retailer'],
    marketSell: ['retailer'],
    marketBuy: ['farmer'],
    marketMonitor: ['government'],
    landRecords: ['farmer', 'retailer', 'government'],
};

export const hasAccess = (role, feature) =>
    FEATURES[feature]?.includes(role) ?? true;

export const canVisit = (role, path) =>
    ROUTE_ROLES[path]?.includes(role) ?? true;

export const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
        return null;
    }
};

export const getCurrentRole = () => getCurrentUser()?.role || 'farmer';
