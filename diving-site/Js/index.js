document.addEventListener("DOMContentLoaded", () => {
  const topBackground = document.querySelector("section.background-img");

  topBackground.style.backgroundImage = 'url("./images/綠島.jpg")';

  const images = [
    "./images/綠島.jpg",
    "./images/蘭嶼八代灣沈船.jpg",
    "./images/小琉球.jpeg",
  ];
  let index = 0;

  setInterval(() => {
    index = (index + 1) % images.length;
    topBackground.style.backgroundImage = `url("${images[index]}")`;
  }, 2500);
});

// 可調整參數
const contentToShow = 1; // 輪播內容物的顯示數量
const moveSpeed = 1500; // 輪播切換時的速度 (ms)
const autoPlayInterval = 2500; // 自動播放的時間間隔 (ms)

// 選取會使用的 element
const carousel = document.querySelector(".carousel");
const container = document.querySelector(".container");
const allContent = document.querySelectorAll(".content");
const firstContent = allContent[0];
const lastContent = allContent[allContent.length - 1];
const content = document.querySelector(".content");
const prevBtn = document.querySelector(".btn-prev");
const nextBtn = document.querySelector(".btn-next");
const contentComputeStyle = getComputedStyle(content);

// 取得輪播內容物個數
const contentAmount = document.querySelectorAll(".content").length;

let distanceBetweenContent;
let position = 0; // 輪播容器之位置
let disableMove = false; // 管理輪播是否可以切換
let autoPlayTimer; // 儲存 setInterval 產生的計時器

// 設定輪播所需的 style，也可以在 CSS 中直接新增
carousel.style.overflow = "hidden";
carousel.style.position = "relative";
container.style.display = "flex";
container.style.position = "absolute";

const setContentWidth = function () {
  const carouselWidth = carousel.offsetWidth;
  const gap = parseInt(contentComputeStyle["margin-right"]); // 內容物間的間距
  const contentWidth =
    (carouselWidth - gap * Math.ceil(contentToShow - 1)) / contentToShow;

  allContent.forEach((el) => (el.style.width = `${contentWidth}px`));

  distanceBetweenContent =
    content.nextElementSibling.offsetLeft - content.offsetLeft;
};

const setContentHeight = function () {
  carousel.style.height = contentComputeStyle.height;
};

const move = function (step) {
  if (disableMove) return;
  position -= step;
  container.style.transition = `transform ${moveSpeed}ms`;
  container.style.transform = `translateX(${
    distanceBetweenContent * (position - Math.ceil(contentToShow))
  }px)`;

  if (position <= -contentAmount || position >= Math.ceil(contentToShow)) {
    position =
      position >= Math.ceil(contentToShow)
        ? -contentAmount + Math.ceil(contentToShow)
        : 0;
    container.addEventListener("transitionend", () => {
      container.style.transition = "transform 0s";
      container.style.transform = `translateX(${
        distanceBetweenContent * (position - Math.ceil(contentToShow))
      }px)`;
    });
  }
};

const insertClonedSlider = function () {
  Array.from(allContent)
    .slice(0, Math.ceil(contentToShow))
    .reverse()
    .forEach((el) =>
      lastContent.insertAdjacentElement("afterend", el.cloneNode(true))
    );

  Array.from(allContent)
    .slice(-Math.ceil(contentToShow))
    .forEach((el) =>
      firstContent.insertAdjacentElement("beforebegin", el.cloneNode(true))
    );
};

// 自動播放函式
const autoPlay = function () {
  autoPlayTimer = setInterval(() => {
    move(1);
  }, autoPlayInterval);
};

// 停止自動播放
const stopAutoPlay = function () {
  clearInterval(autoPlayTimer);
};

// 監聽滑鼠進入輪播區時暫停
carousel.addEventListener("mouseenter", stopAutoPlay);
carousel.addEventListener("mouseleave", autoPlay);

// 動畫開始時，禁止移動，直到動畫結束
container.addEventListener("transitionstart", () => {
  disableMove = true;
});
container.addEventListener("transitionend", () => {
  disableMove = false;
});

prevBtn.addEventListener("click", function () {
  move(-1);
});
nextBtn.addEventListener("click", function () {
  move(1);
});

// 初始化函式
const init = () => {
  setContentWidth();
  setContentHeight();
  insertClonedSlider();
  container.style.transform = `translateX(${
    -distanceBetweenContent * Math.ceil(contentToShow)
  }px)`;
  autoPlay(); // 啟動自動播放
};
init();
function revealOnScroll() {
  const ainer = document.querySelector(".ainer");
  const position = ainer.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  if (position < windowHeight - 10) {
    // 當元素快進入視口時
    ainer.classList.add("show");
  }
}

window.addEventListener("scroll", revealOnScroll);
