import { db, admin } from "../utils/firebase.js";

// Helper to map snapshot to array
const mapSnapshot = (snapshot) => {
  return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
};

// Create a new message
export const createMessage = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ message: "Database not connected" });
    const { Name, mssg, user, replyTo, role } = req.body;

    const newMessage = {
      Name,
      mssg,
      user: user || null,
      replyTo: replyTo || null,
      role: role || 'user',
      time: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const messagesRef = db.collection("messages");
    const addedDocRef = await messagesRef.add(newMessage);
    newMessage._id = addedDocRef.id;

    return res.status(200).json({ success: true, message: newMessage });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ message: "Database not connected" });
    const snapshot = await db.collection("messages").orderBy("createdAt", "desc").get();
    const messages = mapSnapshot(snapshot);

    return res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

// Get messages by user ID
export const getUserMessages = async (req, res, next) => {
  try {
    if (!db) return res.status(500).json({ message: "Database not connected" });
    const user = req.params.user; // Assuming the user ID is provided as a URL parameter

    const snapshot = await db.collection("messages").where("user", "==", user).get();
    let messages = mapSnapshot(snapshot);
    messages.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));

    return res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};

