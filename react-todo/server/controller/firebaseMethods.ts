import todo from '../model/todo';
import user from '../model/user';
import { firestore } from '../config/adminSDK';

export async function insert (table : string, {...props} : todo|user) : Promise<FirebaseFirestore.DocumentData | undefined> {
    const document = (await firestore.collection(table).add({...props}));
    return { id : document.id, ...(await document.get()).data() }
}
export async function get  (table : string, {userId, id} : {id? : string , userId? : string}) : Promise<FirebaseFirestore.DocumentData[] | FirebaseFirestore.DocumentData | undefined>{
    if(id)
        return (await firestore.collection(table).doc(id).get()).data();
    return (await firestore.collection(table).where('userId', "==", userId).get()).docs.map(doc => { return {id : doc.id, ...doc.data()} });
}
export async function remove  (table : string, id : string) : Promise<FirebaseFirestore.WriteResult> {
    return await firestore.collection(table).doc(id).delete();
}
export async function update  (table : string, id : string, {...props} : todo|user) : Promise<todo|user> {
    await firestore.collection(table).doc(id).update({...props});
    return {id, ...props};
}