import todo from '../model/todo';
import admin from 'firebase-admin';
import firebase from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import user from '../model/user';

admin.initializeApp();

export async function insert({...user} : user) : Promise<UserRecord> {
    return await admin.auth().createUser({...user});
}
export async function remove(id : string) : Promise<void>
{
    return await admin.auth().deleteUser(id);
}
export async function update(id : string, {...user} : user)
{
    return await admin.auth().updateUser(id, {...user});
}
export async function get(id? : string)
{
    if(id)
        return await admin.auth().getUser(id);
    return await admin.firestore().collection(__filename).get();
}