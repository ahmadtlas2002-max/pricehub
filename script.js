let products = [];
const container = document.getElementById("products");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let coupons = [];
let discountPercent = 0;
let appliedCoupon = "";

// ملاحظة: خليك على نفس كودك السابق، فقط استبدل دالة applyCoupon بهذه:

function applyCoupon(){

const couponInput = document.getElementById("couponCode");
const couponMessage = document.getElementById("couponMessage");

if(!couponInput || !couponMessage) return;

const code = couponInput.value.trim().toUpperCase();

if(!code){
couponMessage.innerHTML = "اكتب كود الخصم";
return;
}

const firebaseCoupon = coupons.find(c =>
(c.code || "").toUpperCase() === code
);

if(firebaseCoupon){
discountPercent = Number(firebaseCoupon.discount || 0);
appliedCoupon = code;
couponMessage.innerHTML =
"تم تطبيق خصم " + discountPercent + "% ✅";
openCart();
return;
}

const staticCoupons = {
PRICE10: 10,
SAVE20: 20,
WELCOME30: 30
};

if(staticCoupons[code]){
discountPercent = staticCoupons[code];
appliedCoupon = code;
couponMessage.innerHTML =
"تم تطبيق خصم " + discountPercent + "% ✅";
openCart();
return;
}

discountPercent = 0;
appliedCoupon = "";
couponMessage.innerHTML = "كود الخصم غير صحيح";

}
