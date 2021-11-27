import admin from "firebase-admin";

const serviceAccount = require('./ServiceAccountKey')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const auth = admin.auth();
export const firestore = admin.firestore();