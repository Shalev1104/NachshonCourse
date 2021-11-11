import { auth } from "../../src/config/firebaseConfig";
import { OAuthCredential, EmailAuthCredential } from "@firebase/auth";
import { signInWithCredential, signOut, UserCredential } from "firebase/auth";

export async function login(credential : OAuthCredential | EmailAuthCredential) : Promise<UserCredential> {
    return await signInWithCredential(auth, credential);
}
export async function register(email : string, password : string) {
    return await auth.createUserWithEmailAndPassword(email, password);
}
export async function logout() {
    return await signOut(auth);
}