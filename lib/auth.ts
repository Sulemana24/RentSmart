import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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

    const userData: any = {
      email: data.email,
      phone: data.phone,
      role: data.userType,
      createdAt: serverTimestamp(),
      isGoogleAccount: false,
    };

    if (data.userType === "hostel") {
      userData.hostelName = data.hostelName;

      userData.firstName = data.hostelName;
      userData.lastName = "";
    } else {
      userData.firstName = data.firstName;
      userData.lastName = data.lastName;
    }

    await setDoc(doc(db, "users", uid), userData);

    return userCred.user;
  } catch (error: any) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered");
    }
    throw error;
  }
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<{
  user: User;
  role: "renter" | "homeowner" | "hostel" | "admin";
}> => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCred.user.uid;

    const userSnap = await getDoc(doc(db, "users", uid));

    if (!userSnap.exists()) {
      await auth.signOut();
      throw new Error("User profile not found");
    }

    const { role } = userSnap.data();

    if (!role) {
      await auth.signOut();
      throw new Error("User role not found");
    }

    return { user: userCred.user, role };
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
