import todo from '../model/todo';
import { auth } from './firebaseConfig';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import admin from 'firebase-admin';
import user from '../model/user';

export async function insert({...user} : user) : Promise<UserRecord> {
    return await admin.auth().createUser({...user});
}
export async function remove(id : string) : Promise<void>
{
    return await admin.auth().deleteUser(id);
}
export async function update(id : string, {...user} : user) : Promise<UserRecord>
{
    return await admin.auth().updateUser(id, {...user});
}
export async function get(id? : string) : Promise<UserRecord | FirebaseFirestore.QuerySnapshot<FirebaseFirestore.DocumentData>>
{
    if(id)
        return await admin.auth().getUser(id);
    return await admin.firestore().collection(__filename).get();
}