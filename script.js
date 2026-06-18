import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "AIzaSyA4jGrncraaaktuaDpsO7nz1-qmrqYKM3k",
authDomain: "pricehub-6d3c4.firebaseapp.com",
projectId: "pricehub-6d3c4",
storageBucket: "pricehub-6d3c4.firebasestorage.app",
messagingSenderId: "991179979836",
appId: "1:991179979836:web:cb23f4d31e55364d1ed739",
measurementId: "G-HLCHBX5FF7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.loadFirebaseProducts = async function(){

const querySnapshot = await getDocs(collection(db,"products"));

const firebaseProducts = [];

querySnapshot.forEach((doc)=>{
const data = doc.data();

firebaseProducts.push({
name: data.name || "",
price: Number(data.price),
rating: Number(data.rating),
category: data.category || "",
image: data.image || "https://picsum.photos/300/200",
stores:[
"Firebase Store : $" + Number(data.price)
]
});
});

window.setFirebaseProducts(firebaseProducts);

};
