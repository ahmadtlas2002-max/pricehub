import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
addDoc,
doc,
updateDoc,
getDoc,
setDoc,
increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

onAuthStateChanged(auth,(user)=>{
const userBox = document.getElementById("userBox");
const loginBtn = document.getElementById("loginBtn");

if(user){
if(userBox) userBox.innerHTML = "👤 " + user.email;
if(loginBtn) loginBtn.style.display = "none";
}else{
if(userBox) userBox.innerHTML = "👤 غير مسجل الدخول";
if(loginBtn) loginBtn.style.display = "block";
}
});

window.loadFirebaseProducts = async function(){
const querySnapshot = await getDocs(collection(db,"products"));
const firebaseProducts = [];

querySnapshot.forEach((productDoc)=>{
const data = productDoc.data();

firebaseProducts.push({
id: productDoc.id,
name: data.name || "",
price: Number(data.price || 0),
rating: Number(data.rating || 0),
category: data.category || "other",
image: data.image || "https://picsum.photos/300/200",
featured: data.featured || false,
stock: Number(data.stock || 0),
stores: data.stores || ["Firebase Store : $" + Number(data.price || 0)]
});
});

window.setFirebaseProducts(firebaseProducts);
};

window.saveOrder = async function(order){
await addDoc(collection(db,"orders"),order);
};

window.loadCoupons = async function(){
const snapshot = await getDocs(collection(db,"coupons"));
const coupons = [];

snapshot.forEach((couponDoc)=>{
coupons.push({
id: couponDoc.id,
...couponDoc.data()
});
});

return coupons;
};

window.updateProductStock = async function(id,newStock){
await updateDoc(doc(db,"products",id),{
stock:newStock
});
};
window.addVisit = async function(){
const visitRef = doc(db,"stats","visits");

await setDoc(visitRef,{
count: increment(1)
},{merge:true});
};

window.getVisits = async function(){
const visitRef = doc(db,"stats","visits");
const visitSnap = await getDoc(visitRef);

if(visitSnap.exists()){
return visitSnap.data().count || 0;
}

return 0;
};
addDoc,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getAuth,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const auth = getAuth(app);

onAuthStateChanged(auth,(user)=>{
const userBox = document.getElementById("userBox");
const loginBtn = document.getElementById("loginBtn");

if(user){
if(userBox) userBox.innerHTML = "👤 " + user.email;
if(loginBtn) loginBtn.style.display = "none";
}else{
if(userBox) userBox.innerHTML = "👤 غير مسجل الدخول";
if(loginBtn) loginBtn.style.display = "block";
}
});

window.loadFirebaseProducts = async function(){
const querySnapshot = await getDocs(collection(db,"products"));
const firebaseProducts = [];

querySnapshot.forEach((productDoc)=>{
const data = productDoc.data();

firebaseProducts.push({
id: productDoc.id,
name: data.name || "",
price: Number(data.price || 0),
rating: Number(data.rating || 0),
category: data.category || "other",
image: data.image || "https://picsum.photos/300/200",
featured: data.featured || false,
stock: Number(data.stock || 0),
stores: data.stores || ["Firebase Store : $" + Number(data.price || 0)]
});
});

window.setFirebaseProducts(firebaseProducts);
};

window.saveOrder = async function(order){
await addDoc(collection(db,"orders"),order);
};

window.loadCoupons = async function(){
const snapshot = await getDocs(collection(db,"coupons"));
const coupons = [];

snapshot.forEach((couponDoc)=>{
coupons.push({
id: couponDoc.id,
...couponDoc.data()
});
});

return coupons;
};

window.updateProductStock = async function(id,newStock){
await updateDoc(doc(db,"products",id),{
stock:newStock
});
};
