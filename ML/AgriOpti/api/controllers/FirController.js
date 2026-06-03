import { db, admin } from "../utils/firebase.js";

// Helper to map snapshot to array
const mapSnapshot = (snapshot) => {
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
};

export const createFir = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        const { Name, Age, incident, location, Accussed, AccusedDescription, Phone, user, file, Address, stage } = req.body;

        const newFir = {
            Name, Address, Age, incident, location, stage, Accussed, AccusedDescription, Phone, user: user || null, file,
            time: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        };

        const firsRef = db.collection("firs");
        const addedDocRef = await firsRef.add(newFir);
        newFir._id = addedDocRef.id;

        return res.status(200).json({ message: "Fir created Successfully", fir: newFir });
    } catch (err) {
        next(err)
    }
};

export const getuserFir = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        const user = req.params.user;

        const snapshot = await db.collection("firs").where("user", "==", user).get();
        let fir = mapSnapshot(snapshot);
        fir.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

        return res.status(200).json({ fir });
    } catch (err) {
        next(err)
    }
}

export const getFir = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        const snapshot = await db.collection("firs").orderBy("createdAt", "desc").get();
        const fir = mapSnapshot(snapshot);

        return res.status(200).json({ fir });
    } catch (err) {
        next(err)
    }
}

export const deleteFir = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        await db.collection("firs").doc(req.params.id).delete();
        res.status(200).json("doc has been deleted")
    } catch (err) {
        next(err);
    }
}

export const updateFir = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        const firRef = db.collection("firs").doc(req.params.id);
        await firRef.update({ ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        const updatedSnap = await firRef.get();
        res.status(200).json({ _id: updatedSnap.id, ...updatedSnap.data() })
    } catch (err) {
        next(err);
    }
};

// These aliases seem weird but preserving them
export const updateFir2 = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        const firRef = db.collection("firs").doc(req.params.id);
        await firRef.update({ ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        const updatedSnap = await firRef.get();
        res.status(200).json({ _id: updatedSnap.id, ...updatedSnap.data() })
    } catch (err) {
        next(err);
    }
};

export const updateFir3 = async (req, res, next) => {
    try {
        if (!db) return res.status(500).json({ message: "Database not connected" });
        const firRef = db.collection("firs").doc(req.params.id);
        await firRef.update({ ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        const updatedSnap = await firRef.get();
        res.status(200).json({ _id: updatedSnap.id, ...updatedSnap.data() })
    } catch (err) {
        next(err);
    }
};