import { db } from '../../firebase'
import { collection, query, where, getDocs } from "firebase/firestore";

export const getUserBySlug = async (slug) => {
    try{
        const usersCollection = collection(db, "users");
        const queryCollection = query(usersCollection, where("slug", "==", slug));
        const querySnapshot = await getDocs(queryCollection);

        if(!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return { id: userDoc.id, ...userDoc.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar usuário pelo slug:", error);
        throw new Error("Erro ao buscar o usuário");
    }
}

export const getUserByEmail = async (email) => {
    try{
        const usersCollection = collection(db, "users");
        const queryCollection = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(queryCollection);

        if(!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.data();
        } else {
            console.error("Usuário não encontrado");
            throw new Error("Usuário não encontrado");
        }
    } catch (error) {
        console.error("Erro ao buscar usuário pelo Email:", error);
        throw new Error("Erro ao buscar o usuário");
    }
}