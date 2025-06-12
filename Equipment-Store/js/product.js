// product.js
let product;
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      product = products.find((p) => p.id === productId);
      if (!product) {
        document.getElementById("product-detail").innerHTML =
          "<p>找不到商品</p>";
        return;
      }

      const container = document.getElementById("product-detail");
      container.innerHTML = `
        <div class="product-gallery">
          <div class="small-images">
            ${product.images
              .map((src) => `<img src="${src}" class="small-img" alt="小圖" />`)
              .join("")}
          </div>
          <img class="product-img" src="${product.images[0]}" alt="主圖" />
        </div>
        <div class="product-details">
          <h1 id="product-name">${product.name}</h1>
          <p>${product.description}</p>
          <h2>NT$: <span id="price">${product.price}</span></h2>
          <label for="size">尺寸：</label>
          <select id="size">
            ${product.sizes
              .map((s) => `<option value="${s}">${s}</option>`)
              .join("")}
          </select>
          <label for="color">顏色：</label>
          <select id="color">
            ${product.colors
              .map((c) => `<option value="${c}">${c}</option>`)
              .join("")}
          </select>
          <label for="quantity">數量：</label>
          <input type="number" id="quantity" min="1" value="1" />
          <button class="btn" onclick="addToCart('${
            product.id
          }')">加入購物車</button>
          <button class="btn" onclick="buyNow('${
            product.id
          }')">直接購買</button>
        </div>`;

      const mainImage = document.querySelector(".product-img");
      document.querySelectorAll(".small-img").forEach((img) => {
        img.addEventListener("click", () => {
          mainImage.src = img.src;
        });
      });
    });
});

function addToCart(productId) {
  const size = document.getElementById("size").value;
  const color = document.getElementById("color").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const price = parseInt(document.getElementById("price").textContent);
  const pid = `${productId}-${size}-${color}`;
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find((item) => item.pid === pid);
  if (existingItem) {
    existingItem.quantity += quantity;
    existingItem.total = existingItem.quantity * existingItem.price;
  } else {
    cart.push({
      pid,
      name: product.name,
      size,
      color,
      quantity,
      price,
      total: price * quantity,
    });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert("商品已加入購物車！");
}

function buyNow(productId) {
  addToCart(productId);
  window.location.href = "購物車.html";
}
// 測試區 底部
function toggleCart() {
  document.getElementById("cart").classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItemsContainer = document.getElementById("cart-items");
  const totalPriceContainer = document.getElementById("total-price");

  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item) => {
      totalPrice += item.total;
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price} 元</td>
              <td><button class="btn1" onclick="removeFromCart('${item.pid}')"><i class="fas fa-trash-alt"></i></button></td>
              `;
      cartItemsContainer.appendChild(row);
    });

    totalPriceContainer.textContent = `總金額：${totalPrice} 元`;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  window.updateQuantity = function (pid, change) {
    let item = cart.find((item) => item.pid === pid);
    if (item) {
      item.quantity += change;
      if (item.quantity < 1) {
        item.quantity = 1; // 防止數量變成 0
      }
      item.total = item.quantity * item.price; // 確保價格計算正確
      renderCart();
    }
  };

  window.removeFromCart = function (pid) {
    cart = cart.filter((item) => item.pid !== pid);
    renderCart();
  };

  renderCart();
});
function toggleMenu() {
  const navUl = document.querySelector("nav ul");
  navUl.classList.toggle("active");
}

function updateHrefForResponsive() {
  const link = document.getElementById("cartLink");
  const mediaQuery = window.matchMedia("(max-width: 1024px)");

  if (mediaQuery.matches) {
    link.setAttribute("href", "./購物車.html"); // ✅ 小螢幕改網址
    link.removeAttribute("onclick"); // ✅ 可選：移除原來的 toggleCart()
  } else {
    link.setAttribute("href", "#"); // ✅ 大螢幕恢復原來行為
    link.setAttribute("onclick", "toggleCart()");
  }
}

// 初次載入時執行一次
updateHrefForResponsive();

// 畫面大小改變時自動調整
window.addEventListener("resize", updateHrefForResponsive);
