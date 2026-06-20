let products = [
{
name:"iPhone 16 Pro", price:999, rating:4.8, category:"phone",
image:"https://picsum.photos/300/200?1",
stores:["Amazon : $999","MediaMarkt : $1020","Elgiganten : $1040"],
featured:false, stock:5
},
{
name:"Samsung Galaxy S25", price:899, rating:4.6, category:"phone",
image:"https://picsum.photos/300/200?2",
stores:["Amazon : $899","MediaMarkt : $920","Elgiganten : $940"],
featured:false, stock:4
},
{
name:"PlayStation 5", price:499, rating:4.7, category:"gaming",
image:"https://picsum.photos/300/200?3",
stores:["Amazon : $499","MediaMarkt : $520"],
featured:false, stock:3
},
{
name:"MacBook Pro", price:1799, rating:4.9, category:"laptop",
image:"https://picsum.photos/300/200?4",
stores:["Amazon : $1799","MediaMarkt : $1820","Elgiganten : $1850"],
featured:true, stock:2
}
];

const container = document.getElementById("products");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let coupons = [];
let discountPercent = 0;
let appliedCoupon = "";
let currentReviewProduct = "";
let currentLang = localStorage.getItem("lang") || "ar";

function showProducts(list){
container.innerHTML = "";
document.getElementById("productCount").innerHTML =
currentLang === "en" ? "Products: " + list.length : "عدد المنتجات: " + list.length;

list.forEach(product=>{
const index = products.indexOf(product);
const cheapestStore = product.stores[0];

container.innerHTML += `
<div class="card">
<img src="${product.image}">
<div class="content">
<h2>${product.name}<span style="cursor:pointer;float:left;" onclick="toggleFavByIndex(${index})">❤️</span></h2>

${product.featured ? `<div class="featured-badge">⭐ ${currentLang === "en" ? "Featured Product" : "منتج مميز"}</div>` : `<div class="badge">🏆 ${currentLang === "en" ? "Best Price" : "أفضل سعر"}</div>`}

<p class="price">$${product.price}</p>
<p>📦 ${currentLang === "en" ? "Stock" : "المخزون"}: ${product.stock > 0 ? product.stock : currentLang === "en" ? "Unavailable" : "غير متوفر"}</p>
<p class="rating">⭐ ${product.rating} / 5</p>
<div id="cardReviews-${index}" style="font-size:14px;background:#f1f1f1;padding:8px;border-radius:8px;margin:8px 0;">
جاري تحميل آخر التقييمات...
</div>
<p class="bestStore">🏪 ${currentLang === "en" ? "Best Store" : "أفضل متجر"}: ${cheapestStore}</p>

${product.stores.map(store=>`<div class="store">${store}</div>`).join("")}

<button onclick="showDetailsByIndex(${index})">${currentLang === "en" ? "View Product" : "عرض المنتج"}</button>

${product.stock > 0
? `<button onclick="addToCartByIndex(${index})">🛒 ${currentLang === "en" ? "Add to Cart" : "أضف للسلة"}</button>`
: `<button disabled style="background:#999;">${currentLang === "en" ? "Unavailable" : "غير متوفر"}</button>`}

<button onclick="shareProductByIndex(${index})">📤 ${currentLang === "en" ? "Share" : "مشاركة"}</button>
</div>
</div>
`;
});

showFeaturedProduct();
applyLanguage();
}
setTimeout(()=>{
list.forEach(product=>{
const index = products.indexOf(product);
loadCardReviews(product.name,index);
});
},500);
function showFeaturedProduct(){
const box = document.getElementById("featuredBox");
if(!box) return;

const featured = products.find(p => p.featured);
if(!featured){ box.innerHTML = ""; return; }

const index = products.indexOf(featured);

box.innerHTML = `
<div style="width:90%;margin:20px auto;background:#fff3cd;padding:20px;border-radius:15px;text-align:center;box-shadow:0 3px 10px rgba(0,0,0,.1);">
<h2>⭐ ${currentLang === "en" ? "Featured Product" : "المنتج المميز"}</h2>
<img src="${featured.image}" style="width:100%;max-width:400px;border-radius:12px;">
<h3>${featured.name}</h3>
<p style="font-size:22px;color:green;font-weight:bold;">$${featured.price}</p>
<p>📦 ${currentLang === "en" ? "Stock" : "المخزون"}: ${featured.stock > 0 ? featured.stock : currentLang === "en" ? "Unavailable" : "غير متوفر"}</p>
<button onclick="showDetailsByIndex(${index})">${currentLang === "en" ? "View Product" : "عرض المنتج"}</button>
</div>
`;
}

function showDetailsByIndex(index){
const product = products[index];
if(!product) return;

document.getElementById("popup").style.display = "block";
document.getElementById("popupName").innerHTML = product.name;
document.getElementById("popupImage").src = product.image;
document.getElementById("popupPrice").innerHTML = "$" + product.price;
currentReviewProduct = product.name;
loadProductReviews(product.name);
let stores = "";
product.stores.forEach(store=> stores += `<p>${store}</p>`);
stores += `<p>📦 ${currentLang === "en" ? "Stock" : "المخزون"}: ${product.stock > 0 ? product.stock : currentLang === "en" ? "Unavailable" : "غير متوفر"}</p>`;

document.getElementById("popupStores").innerHTML = stores;
}

function closePopup(){
document.getElementById("popup").style.display = "none";
}

function toggleFavByIndex(index){
const product = products[index];
if(!product) return;

if(favorites.includes(product.name)){
favorites = favorites.filter(item => item !== product.name);
showToast(currentLang === "en" ? "Removed from favorites" : product.name + " تمت إزالته من المفضلة");
}else{
favorites.push(product.name);
showToast(currentLang === "en" ? "Added to favorites" : product.name + " تمت إضافته للمفضلة");
}

localStorage.setItem("favorites", JSON.stringify(favorites));
updateFavCount();
updateStats();
}

function updateFavCount(){
document.getElementById("favCount").innerHTML =
currentLang === "en" ? "❤️ Favorites: " + favorites.length : "❤️ المفضلة: " + favorites.length;
}

function addToCartByIndex(index){
const product = products[index];
if(!product) return;

if(product.stock <= 0){
showToast(currentLang === "en" ? "This product is unavailable" : "هذا المنتج غير متوفر");
return;
}

const quantityInCart = cart.filter(item => item.name === product.name).length;

if(quantityInCart >= product.stock){
showToast(currentLang === "en" ? "No more stock available" : "لا يوجد كمية إضافية من هذا المنتج");
return;
}

cart.push(product);
localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();
showToast(currentLang === "en" ? "Added to cart" : "تمت إضافة المنتج للسلة");
}

function updateCartCount(){
document.getElementById("cartCount").innerHTML =
currentLang === "en" ? "🛒 Cart: " + cart.length : "🛒 السلة: " + cart.length;
}

function openCart(){
document.getElementById("cartPopup").style.display = "block";

const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

cartItems.innerHTML = "";
let total = 0;

if(cart.length === 0){
cartItems.innerHTML = currentLang === "en" ? "<p>Cart is empty</p>" : "<p>السلة فارغة</p>";
cartTotal.innerHTML = currentLang === "en" ? "Total: $0" : "المجموع: $0";
return;
}

cart.forEach((item,index)=>{
total += Number(item.price || 0);
cartItems.innerHTML += `
<div class="cart-item">
<span>${item.name} - $${item.price}</span>
<button onclick="removeFromCart(${index})">${currentLang === "en" ? "Delete" : "حذف"}</button>
</div>
`;
});

if(discountPercent > 0){
const discountAmount = total * discountPercent / 100;
const finalTotal = total - discountAmount;

cartTotal.innerHTML =
(currentLang === "en" ? "Before discount: $" : "المجموع قبل الخصم: $") + total.toFixed(2) +
"<br>" + (currentLang === "en" ? "Discount: " : "الخصم: ") + discountPercent + "%" +
"<br>" + (currentLang === "en" ? "Final total: $" : "المجموع النهائي: $") + finalTotal.toFixed(2);
}else{
cartTotal.innerHTML = currentLang === "en" ? "Total: $" + total.toFixed(2) : "المجموع: $" + total.toFixed(2);
}
}

function applyCoupon(){
const couponInput = document.getElementById("couponCode");
const couponMessage = document.getElementById("couponMessage");

if(!couponInput || !couponMessage) return;

const code = couponInput.value.trim().toUpperCase();

if(!code){
couponMessage.innerHTML = currentLang === "en" ? "Enter coupon code" : "اكتب كود الخصم";
return;
}

const firebaseCoupon = coupons.find(c => (c.code || "").toUpperCase() === code);

if(firebaseCoupon){
discountPercent = Number(firebaseCoupon.discount || 0);
appliedCoupon = code;
couponMessage.innerHTML = currentLang === "en" ? "Discount applied " + discountPercent + "% ✅" : "تم تطبيق خصم " + discountPercent + "% ✅";
openCart();
return;
}

const staticCoupons = { PRICE10:10, SAVE20:20, WELCOME30:30 };

if(staticCoupons[code]){
discountPercent = staticCoupons[code];
appliedCoupon = code;
couponMessage.innerHTML = currentLang === "en" ? "Discount applied " + discountPercent + "% ✅" : "تم تطبيق خصم " + discountPercent + "% ✅";
openCart();
return;
}

discountPercent = 0;
appliedCoupon = "";
couponMessage.innerHTML = currentLang === "en" ? "Invalid coupon code" : "كود الخصم غير صحيح";
openCart();
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
discountPercent = 0;
appliedCoupon = "";
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
showProducts(products.filter(product => product.category === category));
}

function sortLow(){
showProducts([...products].sort((a,b)=>a.price-b.price));
}

function sortHigh(){
showProducts([...products].sort((a,b)=>b.price-a.price));
}

function toggleDarkMode(){
document.body.classList.toggle("dark");
localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

if(localStorage.getItem("darkMode") === "true"){
document.body.classList.add("dark");
}

function openFavorites(){
document.getElementById("favPopup").style.display = "block";

const favItems = document.getElementById("favItems");
favItems.innerHTML = "";

if(favorites.length === 0){
favItems.innerHTML = currentLang === "en" ? "<p>No favorite products</p>" : "<p>لا يوجد منتجات في المفضلة</p>";
return;
}

favorites.forEach((name,index)=>{
favItems.innerHTML += `
<div class="fav-item">
<span>${name}</span>
<button onclick="removeFromFavorites(${index})">${currentLang === "en" ? "Delete" : "حذف"}</button>
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
if(!statProducts) return;

document.getElementById("statProducts").innerHTML = products.length;
document.getElementById("statFavs").innerHTML = favorites.length;
document.getElementById("statCart").innerHTML = cart.length;

const statFeatured = document.getElementById("statFeatured");
if(statFeatured){
statFeatured.innerHTML = products.filter(p => p.featured).length;
}

const avg = products.length
? products.reduce((sum,p)=>sum + Number(p.rating || 0),0) / products.length
: 0;

document.getElementById("statRating").innerHTML = avg.toFixed(1);
}

function showToast(message){
const toast = document.getElementById("toast");
toast.innerHTML = message;
toast.style.display = "block";

setTimeout(()=>{
toast.style.display = "none";
},2000);
}

window.setFirebaseProducts = function(firebaseProducts){
if(firebaseProducts && firebaseProducts.length > 0){
products = firebaseProducts.map(product => ({
id: product.id || "",
name: product.name || "منتج بدون اسم",
price: Number(product.price || 0),
rating: Number(product.rating || 0),
category: product.category || "other",
image: product.image || "https://picsum.photos/300/200",
featured: product.featured || false,
stock: Number(product.stock || 0),
stores: product.stores || ["Firebase Store : $" + Number(product.price || 0)]
}));
}

products.sort((a,b)=> (b.featured === true) - (a.featured === true));

showProducts(products);
updateStats();
loadCompareOptions();
applyLanguage();
};

function loadCompareOptions(){
const compare1 = document.getElementById("compare1");
const compare2 = document.getElementById("compare2");

if(!compare1 || !compare2) return;

compare1.innerHTML = "";
compare2.innerHTML = "";

products.forEach(product=>{
compare1.innerHTML += `<option value="${product.name}">${product.name}</option>`;
compare2.innerHTML += `<option value="${product.name}">${product.name}</option>`;
});
}

function compareProducts(){
const p1 = products.find(p => p.name === document.getElementById("compare1").value);
const p2 = products.find(p => p.name === document.getElementById("compare2").value);

if(!p1 || !p2) return;

let cheaper = p1.price < p2.price ? p1.name + (currentLang === "en" ? " is cheaper ✅" : " هو الأرخص ✅") :
p2.price < p1.price ? p2.name + (currentLang === "en" ? " is cheaper ✅" : " هو الأرخص ✅") :
currentLang === "en" ? "Same price" : "السعر متساوي";

document.getElementById("compareResult").innerHTML = `
<h3>${cheaper}</h3>
<table>
<tr><th>${currentLang === "en" ? "Feature" : "الميزة"}</th><th>${p1.name}</th><th>${p2.name}</th></tr>
<tr><td>${currentLang === "en" ? "Image" : "الصورة"}</td><td><img src="${p1.image}" style="width:120px;border-radius:10px;"></td><td><img src="${p2.image}" style="width:120px;border-radius:10px;"></td></tr>
<tr><td>${currentLang === "en" ? "Price" : "السعر"}</td><td>$${p1.price}</td><td>$${p2.price}</td></tr>
<tr><td>${currentLang === "en" ? "Rating" : "التقييم"}</td><td>${p1.rating}</td><td>${p2.rating}</td></tr>
<tr><td>${currentLang === "en" ? "Category" : "التصنيف"}</td><td>${p1.category}</td><td>${p2.category}</td></tr>
<tr><td>${currentLang === "en" ? "Stock" : "المخزون"}</td><td>${p1.stock > 0 ? p1.stock : "غير متوفر"}</td><td>${p2.stock > 0 ? p2.stock : "غير متوفر"}</td></tr>
</table>
`;
}

function clearCompare(){
document.getElementById("compareResult").innerHTML = "";
}

function shareProductByIndex(index){
const product = products[index];
if(!product) return;

const text =
product.name +
"\n" + (currentLang === "en" ? "Price: $" : "السعر: $") + product.price +
"\n" + (currentLang === "en" ? "Rating: " : "التقييم: ") + product.rating +
"\n" + (currentLang === "en" ? "Stock: " : "المخزون: ") + (product.stock > 0 ? product.stock : "غير متوفر");

if(navigator.share){
navigator.share({title: product.name, text: text});
}else{
navigator.clipboard.writeText(text);
showToast(currentLang === "en" ? "Product info copied" : "تم نسخ معلومات المنتج");
}
}

async function checkout(){
if(cart.length === 0){
showToast(currentLang === "en" ? "Cart is empty" : "السلة فارغة");
return;
}

const name = document.getElementById("customerName").value;
const phone = document.getElementById("customerPhone").value;

if(!name || !phone){
showToast(currentLang === "en" ? "Enter name and phone number" : "اكتب الاسم ورقم الهاتف");
return;
}

const subtotal = cart.reduce((sum,item)=>sum + Number(item.price || 0),0);
const discountAmount = subtotal * discountPercent / 100;
const finalTotal = subtotal - discountAmount;

const order = {
customerName: name,
customerPhone: phone,
customerEmail: (document.getElementById("userBox")?.innerText || "").replace("👤","").trim(),
items: cart,
subtotal,
discountPercent,
discountAmount,
coupon: appliedCoupon,
total: finalTotal,
date: new Date().toLocaleString(),
status: "جديد"
};

try{
if(!window.saveOrder){
showToast(currentLang === "en" ? "Firebase not connected" : "Firebase غير متصل");
return;
}

await window.saveOrder(order);

const stockUpdates = {};

cart.forEach(item=>{
if(item.id){
if(!stockUpdates[item.id]){
stockUpdates[item.id] = {id:item.id, stock:Number(item.stock || 0), quantity:0};
}
stockUpdates[item.id].quantity++;
}
});

for(const key in stockUpdates){
const item = stockUpdates[key];
const newStock = Math.max(item.stock - item.quantity,0);

if(window.updateProductStock){
await window.updateProductStock(item.id,newStock);
}
}

showToast(currentLang === "en" ? "Order saved ✅" : "تم حفظ الطلب ✅");

cart = [];
discountPercent = 0;
appliedCoupon = "";
localStorage.setItem("cart", JSON.stringify(cart));

updateCartCount();
updateStats();
openCart();

if(window.loadFirebaseProducts){
await window.loadFirebaseProducts();
}

document.getElementById("customerName").value = "";
document.getElementById("customerPhone").value = "";

const couponInput = document.getElementById("couponCode");
const couponMessage = document.getElementById("couponMessage");
if(couponInput) couponInput.value = "";
if(couponMessage) couponMessage.innerHTML = "";

}catch(error){
console.error(error);
showToast(currentLang === "en" ? "Order failed, check Firebase Rules" : "فشل حفظ الطلب، افحص Firebase Rules");
}
}

setTimeout(async function(){
if(window.loadFirebaseProducts){
await window.loadFirebaseProducts();
showToast(currentLang === "en" ? "Products loaded from Firebase ✅" : "تم تحميل المنتجات من Firebase ✅");
}

if(window.loadCoupons){
coupons = await window.loadCoupons();
}
},1000);

showProducts(products);
updateFavCount();
updateCartCount();
updateStats();
loadCompareOptions();

const searchInput = document.getElementById("search");

if(searchInput){
searchInput.addEventListener("input", function(){
const text = this.value.toLowerCase().trim();

const filtered = products.filter(product =>
(product.name || "").toLowerCase().includes(text)
);

showProducts(filtered);
});
}

let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", function(e){
e.preventDefault();
deferredPrompt = e;

const installBtn = document.getElementById("installBtn");
if(installBtn){
installBtn.style.display = "block";
}
});

const installBtn = document.getElementById("installBtn");

if(installBtn){
installBtn.addEventListener("click", async function(){
if(deferredPrompt){
deferredPrompt.prompt();
await deferredPrompt.userChoice;
deferredPrompt = null;
installBtn.style.display = "none";
}else{
alert(currentLang === "en" ? "Open the site in Chrome and choose Add to Home Screen" : "افتح الموقع من Chrome ثم اختر Add to Home Screen");
}
});
}

setTimeout(function(){
if(window.addVisit){
window.addVisit().catch(function(error){
console.log("Visit counter error:", error);
});
}
},1500);

function applyLanguage(){
const isEnglish = currentLang === "en";

document.documentElement.lang = isEnglish ? "en" : "ar";
document.body.style.direction = isEnglish ? "ltr" : "rtl";

const subtitle = document.querySelector("header p");
const search = document.getElementById("search");
const coupon = document.getElementById("couponCode");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");

if(subtitle) subtitle.innerHTML = isEnglish ? "Compare prices between stores" : "قارن الأسعار بين المتاجر";
if(search) search.placeholder = isEnglish ? "Search for a product..." : "ابحث عن منتج...";
if(coupon) coupon.placeholder = isEnglish ? "Coupon code" : "كود الخصم";
if(customerName) customerName.placeholder = isEnglish ? "Customer name" : "اسم العميل";
if(customerPhone) customerPhone.placeholder = isEnglish ? "Phone number" : "رقم الهاتف";

document.querySelectorAll("button").forEach(btn=>{
let text = btn.innerText;

if(isEnglish){
btn.innerText = text
.replace("⚙️ لوحة الإدارة","⚙️ Admin Panel")
.replace("📦 تتبع الطلب","📦 Track Order")
.replace("👤 حسابي","👤 My Account")
.replace("👤 تسجيل الدخول","👤 Login")
.replace("📦 طلباتي","📦 My Orders")
.replace("📲 تثبيت PriceHub","📲 Install PriceHub")
.replace("🌍 عربي / English","🌍 Arabic / English")
.replace("🌙 الوضع الليلي","🌙 Dark Mode")
.replace("الأرخص أولاً","Lowest Price")
.replace("الأغلى أولاً","Highest Price")
.replace("الكل","All")
.replace("الهواتف","Phones")
.replace("الألعاب","Gaming")
.replace("اللابتوبات","Laptops")
.replace("مقارنة","Compare")
.replace("مسح المقارنة","Clear Compare")
.replace("🎟️ تطبيق الكوبون","🎟️ Apply Coupon")
.replace("✅ تأكيد الطلب","✅ Checkout")
.replace("🗑️ تفريغ السلة","🗑️ Clear Cart")
.replace("إغلاق السلة","Close Cart")
.replace("إغلاق المفضلة","Close Favorites")
.replace("إغلاق","Close");
}else{
btn.innerText = text
.replace("⚙️ Admin Panel","⚙️ لوحة الإدارة")
.replace("📦 Track Order","📦 تتبع الطلب")
.replace("👤 My Account","👤 حسابي")
.replace("👤 Login","👤 تسجيل الدخول")
.replace("📦 My Orders","📦 طلباتي")
.replace("📲 Install PriceHub","📲 تثبيت PriceHub")
.replace("🌍 Arabic / English","🌍 عربي / English")
.replace("🌙 Dark Mode","🌙 الوضع الليلي")
.replace("Lowest Price","الأرخص أولاً")
.replace("Highest Price","الأغلى أولاً")
.replace("All","الكل")
.replace("Phones","الهواتف")
.replace("Gaming","الألعاب")
.replace("Laptops","اللابتوبات")
.replace("Compare","مقارنة")
.replace("Clear Compare","مسح المقارنة")
.replace("🎟️ Apply Coupon","🎟️ تطبيق الكوبون")
.replace("✅ Checkout","✅ تأكيد الطلب")
.replace("🗑️ Clear Cart","🗑️ تفريغ السلة")
.replace("Close Cart","إغلاق السلة")
.replace("Close Favorites","إغلاق المفضلة")
.replace("Close","إغلاق");
}
});

updateFavCount();
updateCartCount();
}

function toggleLanguage(){
currentLang = currentLang === "ar" ? "en" : "ar";
localStorage.setItem("lang", currentLang);
showProducts(products);
applyLanguage();

if(window.loadFirebaseProducts){
window.loadFirebaseProducts();
}
}

applyLanguage();
async function loadProductReviews(productName){
const reviewsBox = document.getElementById("reviewsBox");
if(!reviewsBox) return;

reviewsBox.innerHTML = "جاري تحميل التقييمات...";

if(!window.loadReviews){
reviewsBox.innerHTML = "التقييمات غير متصلة";
return;
}

const reviews = await window.loadReviews(productName);

if(reviews.length === 0){
reviewsBox.innerHTML = "<p>لا توجد تقييمات بعد</p>";
return;
}

const avgRating = reviews.reduce((sum,r)=>sum + Number(r.rating || 0),0) / reviews.length;

reviewsBox.innerHTML =
"<h4>⭐ متوسط التقييم: " + avgRating.toFixed(1) + " / 5</h4>";


reviews.forEach(review=>{
reviewsBox.innerHTML += `
<div style="background:#eee;padding:10px;margin:8px 0;border-radius:8px;">
<strong>${"⭐".repeat(Number(review.rating || 5))}</strong>
<p>${review.text || ""}</p>
<small>${review.email || "مستخدم"} - ${review.date || ""}</small>
</div>
`;
});
}

async function addReview(){
const rating = document.getElementById("reviewRating").value;
const text = document.getElementById("reviewText").value.trim();

if(!currentReviewProduct){
showToast("افتح منتج أولاً");
return;
}

if(!text){
showToast("اكتب تعليقك");
return;
}

const email = (document.getElementById("userBox")?.innerText || "")
.replace("👤","")
.trim();

if(!email || email === "غير مسجل الدخول"){
showToast("سجل الدخول أولاً حتى تكتب تقييم");
return;
}

if(!window.saveReview){
showToast("Firebase غير متصل بالتقييمات");
return;
}

const review = {
productName: currentReviewProduct,
rating: Number(rating),
text,
email,
date: new Date().toLocaleString()
};

await window.saveReview(review);

document.getElementById("reviewText").value = "";
showToast("تم إرسال التقييم ✅");
loadProductReviews(currentReviewProduct);
}
async function loadCardReviews(productName,index){
const box = document.getElementById("cardReviews-" + index);
if(!box) return;

if(!window.loadReviews){
box.innerHTML = "لا توجد تقييمات";
return;
}

const reviews = await window.loadReviews(productName);

if(reviews.length === 0){
box.innerHTML = "لا توجد تقييمات بعد";
return;
}

const lastReviews = reviews.slice(-3).reverse();

box.innerHTML = lastReviews.map(r =>
`<div>⭐ ${r.rating}/5 - ${r.text || ""}</div>`
).join("");
}
