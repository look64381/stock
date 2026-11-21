
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const closeBtn = document.getElementById("closeSidebar");

const desktopQuery = window.matchMedia("(min-width: 1024px)");

let isOpen = desktopQuery.matches;

function updateSidebar() {

    if (desktopQuery.matches) {
        // 電腦版：控制寬度
        sidebar.classList.remove("-translate-x-full");

        sidebar.classList.toggle("lg:w-64", isOpen);
        sidebar.classList.toggle("lg:w-0", !isOpen);

    } else {
        // 手機版：控制全螢幕
        sidebar.classList.remove("lg:w-0", "lg:w-64");

        sidebar.classList.toggle("-translate-x-full", !isOpen);
    }
}

// 主按鈕
toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    updateSidebar();
});

// 手機版 X 按鈕
closeBtn.addEventListener("click", () => {
    isOpen = false;
    updateSidebar();
});

// 螢幕跨越 lg 斷點時，重新套用預設狀態
desktopQuery.addEventListener("change", (event) => {
    isOpen = event.matches;
    updateSidebar();
});

updateSidebar();
