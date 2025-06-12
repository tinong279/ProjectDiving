function showContents(x, contentId, skipHistoryUpdate = false) {
  const currentShown = document.querySelector(".contents.show");
  if (currentShown && currentShown.id === contentId) return;

  var tabs = document.querySelectorAll(".btn");
  var contents = document.querySelectorAll(".contents");

  tabs.forEach((tab) => tab.classList.remove("show"));
  contents.forEach((content) => content.classList.remove("show"));

  x.classList.add("show");
  document.getElementById(contentId).classList.add("show");

  if (!skipHistoryUpdate) {
    var url = new URL(window.location);
    url.searchParams.set("tab", contentId);
    window.history.pushState(null, "", url);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const tabId = params.get("tab") || "content_1";
  const targetTab = document.querySelector(`[onclick*="${tabId}"]`);
  if (targetTab) {
    showContents(targetTab, tabId, true);
  }
});

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
