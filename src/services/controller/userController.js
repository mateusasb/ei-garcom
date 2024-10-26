import { db } from '../../firebase'
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";

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
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar usuário pelo Email:", error);
        throw new Error("Erro ao buscar o usuário");
    }
}

export const createNewUser = async(userInfo) => {
    let userAlreadyExists = await getUserByEmail(userInfo.email);
    if(userAlreadyExists === null) {
        try{
            const usersCollection = collection(db, "users");
            await addDoc(usersCollection, {
                creation_date: Timestamp.now(),
                current_service_location: 'Bar do Zé',
                email: userInfo.email,
                first_name: userInfo.name,
                last_name: userInfo.lastName,
                phone: '71994042861',
                profile_picture_url: 'https://via.placeholder.com/150',
                slug: (userInfo.name + '-' + userInfo.lastName).toLowerCase()
            })
        } catch(error) {
            console.error("Erro ao cadastrar usuário:", error);
            throw new Error("Erro ao buscar o usuário", error);
        }
    }
}