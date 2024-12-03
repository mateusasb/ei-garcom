import { db } from '../../firebase'
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getUserBySlug } from './userController';

export const createNewReview = async(reviewInfo) => {
    let userAlreadyExists = await getUserBySlug(reviewInfo.waiter_id);
    if(userAlreadyExists !== null) {
        try{
            const reviewsCollection = collection(db, "reviews");
            await addDoc(reviewsCollection, {
                creation_date: Timestamp.now(),
                review_rating: reviewInfo.rating,
                visitor_id: reviewInfo.visitor_id,
                waiter_id: reviewInfo.waiter_id,
                user_reviewed: `/users/${userAlreadyExists.id}`
            })
        } catch(error) {
            console.error("Erro ao cadastrar avaliação:", error);
            throw new Error("Erro ao cadastrar avaliação", error);
        }
    }
}