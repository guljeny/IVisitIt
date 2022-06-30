import { getAuth } from "firebase/auth"
import firebaseApp from './firebaseApp'

export default getAuth(firebaseApp)
