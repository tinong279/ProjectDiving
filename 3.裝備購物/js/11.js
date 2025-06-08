let cart = JSON.parse(localStorage.getItem("cart")) || [];
let totalPrice = 0;

// 更新購物車顯示
function saveAndRenderCart() {
  updateLocalStorage();
  updateCartCount();
  updateTotalPrice();
  displayCart();
}

// 更新購物車計數
function updateCartCount() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = totalItems;
}

// 更新總價格
function updateTotalPrice() {
  totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("total-price").textContent = `總金額: $${totalPrice}`;
}

// 顯示購物車內容
function displayCart() {
  const cartItemsElement = document.getElementById("cart-items");
  cartItemsElement.innerHTML = "";

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price * item.quantity}
      <button class="decrease" data-index="${index}">−</button>
      <span>${item.quantity}</span>
      <button class="increase" data-index="${index}">+</button>
      <button class="remove" data-index="${index}" style="background-color: red; color: white;">刪除</button>
    `;
    cartItemsElement.appendChild(li);
  });
}

// 事件委派處理按鈕點擊
const cartItemsElement = document.getElementById("cart-items");
cartItemsElement.addEventListener("click", (event) => {
  const index = event.target.dataset.index;
  if (!index) return;

  if (event.target.classList.contains("increase")) {
    cart[index].quantity++;
  } else if (event.target.classList.contains("decrease")) {
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
    } else {
      cart.splice(index, 1);
    }
  } else if (event.target.classList.contains("remove")) {
    cart.splice(index, 1);
  }
  saveAndRenderCart();
});

// 更新 localStorage
function updateLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// 結帳功能
document.getElementById("checkout").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("購物車是空的");
    return;
  }
  alert(`購物成功！總金額為 $${totalPrice}`);
  cart = [];
  saveAndRenderCart();
});

// 加入購物車
document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", (event) => {
    const productElement = event.target.closest(".product");
    const quantity =
      parseInt(productElement.querySelector(".quantity-input").value, 10) || 1;
    const productId = productElement.getAttribute("data-id");
    const productName = productElement.getAttribute("data-name");
    const productPrice = parseInt(
      productElement.getAttribute("data-price"),
      10
    );

    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: productId,
        name: productName,
        price: productPrice,
        quantity: quantity,
      });
    }

    saveAndRenderCart();
  });
});

// 初始載入購物車內容
displayCart();
updateCartCount();
updateTotalPrice();
