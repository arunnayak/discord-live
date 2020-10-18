import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBpDBzDnxK1BixOp1dTCo0nGcyvhCHFnEA",
    authDomain: "discord-5c51a.firebaseapp.com",
    databaseURL: "https://discord-5c51a.firebaseio.com",
    projectId: "discord-5c51a",
    storageBucket: "discord-5c51a.appspot.com",
    messagingSenderId: "1083375295701",
    appId: "1:1083375295701:web:db12afc80d9bb09362565c",
    measurementId: "G-0T3348PZD0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig)

const db = firebaseApp.firestore()
const auth = firebase.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { auth, provider }
export default db