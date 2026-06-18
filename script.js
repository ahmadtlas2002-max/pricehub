let products = [
{
name:"iPhone 16 Pro",
price:999,
rating:4.8,
category:"phone",
image:"https://picsum.photos/300/200?1",
stores:["Amazon : $999","MediaMarkt : $1020","Elgiganten : $1040"]
},
{
let products = [
{
name:"iPhone 16 Pro",
price:999,
rating:4.8,
category:"phone",
image:"https://picsum.photos/300/200?1",
stores:["Amazon : $999","MediaMarkt : $1020","Elgiganten : $1040"]
},
{
name:"Samsung Galaxy S25",
price:899,
rating:4.6,
category:"phone",
image:"https://picsum.photos/300/200?2",
stores:["Amazon : $899","MediaMarkt : $920","Elgiganten : $940"]
},
{
name:"PlayStation 5",
price:499,
rating:4.7,
category:"gaming",
image:"https://picsum.photos/300/200?3",
stores:["Amazon : $499","MediaMarkt : $520"]
},
{
name:"MacBook Pro",
price:1799,
rating:4.9,
category:"laptop",
image:"https://picsum.photos/300/200?4",
stores:["Amazon : $1799","MediaMarkt : $1820","Elgiganten : $1850"]
}
];

const container = document.getElementById("products");
const search = document.getElementById("search");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function showProducts(list){
container.innerHTML = "";

const countBox = document.getElementById("productCount");
if(countBox){
countBox.innerHTML = "عدد المنتجات: " + list.length;
}

list.forEach(product=>{
const cheapestStore = product.stores[0];

container.innerHTML += `
<div class="card">
<img src="${product.image}">
<div class="content">

<h2>
${product.name}
<span style="cursor:pointer;float:left;" onclick="toggleFav('${product.name}')">❤️</span>
</h2>

<div class="badge">🏆 أفضل سعر</div>

<p class="price">$${product.price}</p>

<p class="rating">⭐ ${product.rating} / 5</p>

<p class="bestStore">
🏪 أفضل متجر:
${cheapestStore}
</p>

${product.stores.map(store=>`
<div class="store">${store}</div>
`).join("")}

<button onclick="showDetails('${product.name}')">عرض المنتج</button>
<button onclick="addToCart('${product.name}')">🛒 أضف للسلة</button>

</div>
</div>
`;
});
}

showProducts(products);

search.addEventListener("input",function(){

const value = search.value.toLowerCase();

const filtered = products.filter(product => {

const nameMatch = product.name.toLowerCase().includes(value);

const storeMatch = product.stores.some(store =>
store.toLowerCase().includes(value)
);

return nameMatch || storeMatch;

});

showProducts(filtered);

});

function showDetails(name){

const product = products.find(p => p.name === name);

document.getElementById("popup").style.display = "block";
document.getElementById("popupName").innerHTML = product.name;
document.getElementById("popupImage").src = product.image;
document.getElementById("popupPrice").innerHTML = "$" + product.price;

let stores = "";

product.stores.forEach(store=>{
stores += `<p>${store}</p>`;
});

document.getElementById("popupStores").innerHTML = stores;

}

function closePopup(){
document.getElementById("popup").style.display = "none";
}

function toggleFav(name){

if(favorites.includes(name)){
favorites = favorites.filter(item => item !== name);
showToast(name + " تمت إزالته من المفضلة");
}else{
favorites.push(name);
showToast(name + " تمت إضافته للمفضلة");
}

localStorage.setItem("favorites", JSON.stringify(favorites));

updateFavCount();
updateStats();

}

function updateFavCount(){
document.getElementById("favCount").innerHTML =
"❤️ المفضلة: " + favorites.length;
}

updateFavCount();

function addToCart(name){

const product = products.find(p => p.name === name);

cart.push(product);

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();

showToast("تمت إضافة المنتج للسلة");

}

function updateCartCount(){
document.getElementById("cartCount").innerHTML =
"🛒 السلة: " + cart.length;
}

updateCartCount();

function sortLow(){
const sorted = [...products].sort((a,b)=>a.price-b.price);
showProducts(sorted);
}

function sortHigh(){
const sorted = [...products].sort((a,b)=>b.price-a.price);
showProducts(sorted);
}

function toggleDarkMode(){

document.body.classList.toggle("dark");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark")
);

}

if(localStorage.getItem("darkMode") === "true"){
document.body.classList.add("dark");
}

function openCart(){

document.getElementById("cartPopup").style.display = "block";

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

cartItems.innerHTML = "";

let total = 0;

if(cart.length === 0){
cartItems.innerHTML = "<p>السلة فارغة</p>";
cartTotal.innerHTML = "المجموع: $0";
return;
}

cart.forEach((item,index)=>{
total += item.price;

cartItems.innerHTML += `
<div class="cart-item">
<span>${item.name} - $${item.price}</span>
<button onclick="removeFromCart(${index})">حذف</button>
</div>
`;
});

cartTotal.innerHTML = "المجموع: $" + total;

}

function closeCart(){
document.getElementById("cartPopup").style.display = "none";
}

function removeFromCart(index){

cart.splice(index,1);

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();

openCart();

}

function clearCart(){

cart = [];

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();

openCart();

}

function filterCategory(category){

if(category === "all"){
showProducts(products);
return;
}

const filtered = products.filter(product =>
product.category === category
);

showProducts(filtered);

}

function openFavorites(){

document.getElementById("favPopup").style.display = "block";

const favItems = document.getElementById("favItems");

favItems.innerHTML = "";

if(favorites.length === 0){
favItems.innerHTML = "<p>لا يوجد منتجات في المفضلة</p>";
return;
}

favorites.forEach((name,index)=>{
favItems.innerHTML += `
<div class="fav-item">
<span>${name}</span>
<button onclick="removeFromFavorites(${index})">حذف</button>
</div>
`;
});

}

function closeFavorites(){
document.getElementById("favPopup").style.display = "none";
}

function removeFromFavorites(index){

favorites.splice(index,1);

localStorage.setItem("favorites", JSON.stringify(favorites));

updateFavCount();
updateStats();

openFavorites();

}

function updateStats(){

const statProducts = document.getElementById("statProducts");
const statFavs = document.getElementById("statFavs");
const statCart = document.getElementById("statCart");
const statRating = document.getElementById("statRating");

if(!statProducts) return;

statProducts.innerHTML = products.length;
statFavs.innerHTML = favorites.length;
statCart.innerHTML = cart.length;

const avg = products.reduce((sum,p)=>sum+p.rating,0) / products.length;

statRating.innerHTML = avg.toFixed(1);

}

function showToast(message){

const toast = document.getElementById("toast");

toast.innerHTML = message;
toast.style.display = "block";

setTimeout(function(){
toast.style.display = "none";
}, 2000);

}

window.setFirebaseProducts = function(firebaseProducts){

products = firebaseProducts.map(product => {
return {
name: product.name || "منتج بدون اسم",
price: Number(product.price || 0),
rating: Number(product.rating || 0),
category: product.category || "other",
image: product.image || "https://picsum.photos/300/200",
stores: product.stores || ["Firebase Store : $" + Number(product.price || 0)]
};
});

showProducts(products);
updateStats();

};

setTimeout(async function(){

if(window.loadFirebaseProducts){
await window.loadFirebaseProducts();
showToast("تم تحميل المنتجات من Firebase ✅");
}

},1000);

updateStats();
category:"phone",
image:"https://picsum.photos/300/200?2",
stores:["Amazon : $899","MediaMarkt : $920","Elgiganten : $940"]
},
{
name:"PlayStation 5",
price:499,
rating:4.7,
category:"gaming",
image:"https://picsum.photos/300/200?3",
stores:["Amazon : $499","MediaMarkt : $520"]
},
{
name:"MacBook Pro",
price:1799,
rating:4.9,
category:"laptop",
image:"https://picsum.photos/300/200?4",
stores:["Amazon : $1799","MediaMarkt : $1820","Elgiganten : $1850"]
}
];

const container = document.getElementById("products");
const search = document.getElementById("search");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function showProducts(list){
container.innerHTML = "";

const countBox = document.getElementById("productCount");
if(countBox){
countBox.innerHTML = "عدد المنتجات: " + list.length;
}

list.forEach(product=>{
	const cheapestStore = product.stores[0];
container.innerHTML += `
<div class="card">
<img src="${product.image}">
<div class="content">

<h2>
${product.name}
<span style="cursor:pointer;float:left;" onclick="toggleFav('${product.name}')">❤️</span>
</h2>

<div class="badge">🏆 أفضل سعر</div>

<p class="price">$${product.price}</p>

<p class="rating">⭐ ${product.rating} / 5</p>
	<p class="bestStore">
🏪 أفضل متجر:
${cheapestStore}
</p>

${product.stores.map(store=>`
<div class="store">${store}</div>
`).join("")}

<button onclick="showDetails('${product.name}')">عرض المنتج</button>

<button onclick="addToCart('${product.name}')">🛒 أضف للسلة</button>

</div>
</div>
`;
});
}

showProducts(products);

search.addEventListener("input",function(){

const value = search.value.toLowerCase();

const filtered = products.filter(product => {

const nameMatch =
product.name.toLowerCase().includes(value);

const storeMatch =
product.stores.some(store =>
store.toLowerCase().includes(value)
);

return nameMatch || storeMatch;

});

showProducts(filtered);

});

function showDetails(name){
const product = products.find(p => p.name === name);

document.getElementById("popup").style.display = "block";
document.getElementById("popupName").innerHTML = product.name;
document.getElementById("popupImage").src = product.image;
document.getElementById("popupPrice").innerHTML = "$" + product.price;

let stores = "";

product.stores.forEach(store=>{
stores += `<p>${store}</p>`;
});

document.getElementById("popupStores").innerHTML = stores;
}

function closePopup(){
document.getElementById("popup").style.display = "none";
}

function toggleFav(name){

if(favorites.includes(name)){

favorites = favorites.filter(item => item !== name);

showToast(name + " تمت إزالته من المفضلة");

}else{

favorites.push(name);

showToast(name + " تمت إضافته للمفضلة");

}

localStorage.setItem("favorites", JSON.stringify(favorites));

updateFavCount();

updateStats();

}
function updateFavCount(){
document.getElementById("favCount").innerHTML =
"❤️ المفضلة: " + favorites.length;
}

updateFavCount();

function addToCart(name){
const product = products.find(p => p.name === name);

cart.push(product);

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();

showToast("تمت إضافة المنتج للسلة");
}

function updateCartCount(){
document.getElementById("cartCount").innerHTML =
"🛒 السلة: " + cart.length;
}

updateCartCount();

function sortLow(){
const sorted = [...products].sort((a,b)=>a.price-b.price);
showProducts(sorted);
}

function sortHigh(){
const sorted = [...products].sort((a,b)=>b.price-a.price);
showProducts(sorted);
}

function toggleDarkMode(){
document.body.classList.toggle("dark");

localStorage.setItem(
"darkMode",
document.body.classList.contains("dark")
);
}

if(localStorage.getItem("darkMode") === "true"){
document.body.classList.add("dark");
}

function openCart(){
document.getElementById("cartPopup").style.display = "block";

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

cartItems.innerHTML = "";

let total = 0;

if(cart.length === 0){
cartItems.innerHTML = "<p>السلة فارغة</p>";
cartTotal.innerHTML = "المجموع: $0";
return;
}

cart.forEach((item,index)=>{
total += item.price;

cartItems.innerHTML += `
<div class="cart-item">
<span>${item.name} - $${item.price}</span>
<button onclick="removeFromCart(${index})">حذف</button>
</div>
`;
});

cartTotal.innerHTML = "المجموع: $" + total;
}

function closeCart(){
document.getElementById("cartPopup").style.display = "none";
}

function removeFromCart(index){

cart.splice(index,1);

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();

updateStats();

openCart();

}

function clearCart(){
cart = [];

localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();

openCart();
}

function filterCategory(category){
if(category === "all"){
showProducts(products);
return;
}

const filtered = products.filter(product =>
product.category === category
);

showProducts(filtered);
}

function openFavorites(){
document.getElementById("favPopup").style.display = "block";

const favItems = document.getElementById("favItems");

favItems.innerHTML = "";

if(favorites.length === 0){
favItems.innerHTML = "<p>لا يوجد منتجات في المفضلة</p>";
return;
}

favorites.forEach((name,index)=>{
favItems.innerHTML += `
<div class="fav-item">
<span>${name}</span>
<button onclick="removeFromFavorites(${index})">حذف</button>
</div>
`;
});
}

function closeFavorites(){
document.getElementById("favPopup").style.display = "none";
}

function removeFromFavorites(index){

favorites.splice(index,1);

localStorage.setItem("favorites", JSON.stringify(favorites));

updateFavCount();

updateStats();

openFavorites();

}

function updateStats(){

const statProducts = document.getElementById("statProducts");
const statFavs = document.getElementById("statFavs");
const statCart = document.getElementById("statCart");
const statRating = document.getElementById("statRating");

if(!statProducts) return;

statProducts.innerHTML = products.length;
statFavs.innerHTML = favorites.length;
statCart.innerHTML = cart.length;

const avg =
products.reduce((sum,p)=>sum+p.rating,0) / products.length;

statRating.innerHTML = avg.toFixed(1);

}

function showToast(message){
const toast = document.getElementById("toast");

toast.innerHTML = message;
toast.style.display = "block";

setTimeout(function(){
toast.style.display = "none";
}, 2000);
}

window.setFirebaseProducts = function(firebaseProducts){

products = firebaseProducts.map(product => {
return {
name: product.name || "منتج بدون اسم",
price: Number(product.price || 0),
rating: Number(product.rating || 0),
category: product.category || "other",
image: product.image || "https://picsum.photos/300/200",
stores: product.stores || ["Firebase Store : $" + Number(product.price || 0)]
};
});

showProducts(products);
updateStats();

};

setTimeout(async function(){

if(window.loadFirebaseProducts){
await window.loadFirebaseProducts();
showToast("تم تحميل المنتجات من Firebase ✅");
}

},1000);

updateStats();
