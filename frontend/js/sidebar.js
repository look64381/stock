const sidebar=document.getElementById("sidebar");
const sidebarbtn=document.getElementById("sidebarbtn");
const sidebarclose=document.getElementById("sidebarclose");
const windonMedia=window.matchMedia("(min-width:1024px)");
//matchMedia() 使用 CSS Media Query 語法，能監聽條件變化 返回MediaQueryList物件 
//屬性:1. matches 布林 是否符合條件 2. media String 媒體寬 方法:addEventListener() 新增事件監聽

let isOpen=windonMedia.matches;

function updateSidebar() {
    if (windonMedia.matches) {
        //較寬 如電腦版
        //sidebar.classList.remove("-translate-x-full");//預設顯示sidebar (此CSS表示 sidebar往左移動自身寬度 translate負號表向左 即往左隱藏 )
        sidebar.classList.toggle("lg:w-64", isOpen);
        sidebar.classList.toggle("lg:w-0", !isOpen);

    } else {
        //較窄 如行動裝置

    }
}

windonMedia.addEventListener("change",(e)=>{
    updateSidebar();
});
sidebarbtn.addEventListener("click",()=>{
    isOpen = !isOpen;
    updateSidebar();
});
updateSidebar();