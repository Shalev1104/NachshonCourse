import todo from '../model/todo';
import user from '../model/user';
import { firestore } from './firebaseConfig';

export async function insert (table : string, {...props} : todo|user) : Promise<firebase.default.firestore.DocumentData | undefined> {
    const document = (await firestore.collection(table).add({...props}));
    return { id : document.id, ...(await document.get()).data() }
}
export async function get  (table : string, id?: string) : Promise<firebase.default.firestore.DocumentData[] | firebase.default.firestore.DocumentData | undefined>{
    if(id)
        return (await firestore.collection(table).doc(id).get()).data();
    return (await firestore.collection(table).get()).docs.map(doc => { return {id : doc.id, ...doc.data()} });
}
export async function remove  (table : string, id : string) : Promise<void> {
    return await firestore.collection(table).doc(id).delete();
}
export async function update  (table : string, id : string, {...props} : todo|user) : Promise<todo|user> {
    await firestore.collection(table).doc(id).update({...props});
    return {id, ...props};
}