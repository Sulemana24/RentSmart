import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const signupUser = async (
  email: string,
  password: string,
  data: any,
) => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const uid = userCred.user.uid;

    await setDoc(doc(db, "users", uid), {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      role: data.userType,
      createdAt: new Date(),
    });

    return userCred.user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered");
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return userCred.user;
  } catch (error: any) {
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      throw new Error("Invalid email or password");
    }
    throw error;
  }
};

export const getUserRole = async (uid: string) => {
  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) return null;
  const data = userSnap.data();
  return data.role as string;
};
