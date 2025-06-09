// product.js
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  fetch("data/products.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);
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
              .map(
                (src) => `<img src="${src}" class="small-img" alt="小圖" />`
              )
              .join("")}
          </div>
          <img class="product-img" src="${product.images[0]}" alt="主圖" />
        </div>
        <div class="product-details">
          <h1>${product.name}</h1>
          <p>${product.description}</p>
          <h2>NT$: <span id="price">${product.price}</span></h2>
          <label for="size">尺寸：</label>
          <select id="size">
            ${product.sizes.map((s) => `<option value="${s}">${s}</option>`).join("")}
          </select>
          <label for="color">顏色：</label>
          <select id="color">
            ${product.colors.map((c) => `<option value="${c}">${c}</option>`).join("")}
          </select>
          <label for="quantity">數量：</label>
          <input type="number" id="quantity" min="1" value="1" />
          <button class="btn" onclick="addToCart('${product.id}')">加入購物車</button>
          <button class="btn" onclick="buyNow('${product.id}')">直接購買</button>
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
      name: document.querySelector("h1").textContent,
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
