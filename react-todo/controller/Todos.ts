import todo from '../model/todo';
import admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

const table = __filename;

export async function insert ({...todo} : todo) : Promise<admin.firestore.DocumentReference<admin.firestore.DocumentData>> {
    return await db.collection(table).add({...todo});
}
export async function get  (id?: string) : Promise<admin.firestore.QuerySnapshot<admin.firestore.DocumentData> | admin.firestore.DocumentSnapshot<admin.firestore.DocumentData>>{
    if(id)
        return await db.collection(table).doc(id).get();
    return await db.collection(table).get();

}
export async function remove  (id : string) : Promise<admin.firestore.WriteResult> {
    return await db.collection(table).doc(id).delete();

}
export async function update  (id : string, {...todo} : todo) : Promise<admin.firestore.WriteResult> {
    return await db.collection(table).doc(id).update({...todo});
}