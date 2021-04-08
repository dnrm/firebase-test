// ! GET THE AUTH SERVICE
const auth = firebase.auth();

// * GET THE HTML ELEMENTS

const whenSignedIn = document.getElementById('whensignedin');
const whenSignedOut = document.getElementById('whensignedout');
const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const userDetails = document.getElementById('userDetails');
const thingsList = document.getElementById('thingsList');
const createThing = document.getElementById('createThing');
const provider = new firebase.auth.GoogleAuthProvider();

// ? Normal Code

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedIn.hidden = false;
        createThing.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Welcome, ${user.displayName}!</h3>`
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        createThing.hidden = true;
        userDetails.innerHTML = '';
        thingsList.innerHTML = '';
    }
});

// ? Firestore

const db = firebase.firestore();

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection('test')
        createThing.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;
            thingsRef.add({
                uid: user.uid,
                name: document.getElementById('songInput').value, 
                createdAt: serverTimestamp()
            });
        }

        unsubscribe = thingsRef
            .orderBy('createdAt')
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li class="list-group-item">${doc.data().name}</li>`
                })
                thingsList.innerHTML = items.join('');
            })

    } else {
        unsubscribe && unsubscribe();
        document.getElementById('songInput').value = '';
    }
});