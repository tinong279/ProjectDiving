function showContents(x, contentId) {
  var tabs = document.querySelectorAll(".btn"); // 抓取所有按鈕
  var contents = document.querySelectorAll(".contents"); // 抓取所有內容區塊

  // 移除所有按鈕和內容的 'show' 類別
  tabs.forEach((tab) => tab.classList.remove("show"));
  contents.forEach((content) => content.classList.remove("show"));

  // 設定目前點擊的按鈕與內容區塊
  x.classList.add("show");
  document.getElementById(contentId).classList.add("show");

  // 更新網址參數
  var url = new URL(window.location);
  url.searchParams.set("tab", contentId); // 設定 `tab` 參數
  window.history.pushState(null, "", url); // 更新網址但不重新載入頁面
}

// 🚀 當頁面載入時，自動切換到對應的標籤
window.onload = function () {
  var params = new URLSearchParams(window.location.search);
  var tabId = params.get("tab"); // 取得 `tab` 參數值

  if (tabId) {
    var targetTab = document.querySelector(`[onclick*="${tabId}"]`);
    if (targetTab) {
      targetTab.click(); // 觸發對應按鈕的點擊事件
    }
  }
};

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
