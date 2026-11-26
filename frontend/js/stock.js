


lucide.createIcons();

const ctx = document.getElementById('stockPieChart');

// 建立圓餅圖
const stockChart = new Chart(ctx, {
type: 'pie',
data: {
    labels: [],
    datasets: [{
        data: [],
        backgroundColor: [
            '#2F6B63',
            '#64817B',
            '#B8C9B8'
        ],
        borderWidth: 0
    }]
},

options: {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
        padding: 0
    },

    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                boxWidth: 12,
                boxHeight: 10,
                padding: 6,
                font: {
                    size: 15
                }
            }
        }
    }
}
        });

const stocks = [
    {
        name: "台積電",
        code: "2330",
        shares: 100,
        cost: 950,
        price: 1000
    },
    {
        name: "鴻海",
        code: "2317",
        shares: 200,
        cost: 150,
        price: 160
    },
    {
        name: "元大台灣50",
        code: "0050",
        shares: 300,
        cost: 180,
        price: 185
    },
    {
        name: "國泰永續高股息",
        code: "00878",
        shares: 500,
        cost: 21,
        price: 22.5
    },
    {
        name: "群益台灣精選高息",
        code: "00919",
        shares: 400,
        cost: 23,
        price: 24.2
    },
    {
        name: "元大高股息",
        code: "0056",
        shares: 250,
        cost: 34,
        price: 35.1
    },
    {
        name: "聯發科",
        code: "2454",
        shares: 20,
        cost: 1300,
        price: 1350
    },
    {
        name: "富邦台50",
        code: "006208",
        shares: 100,
        cost: 105,
        price: 108
    },
    {
        name: "台新金",
        code: "2887",
        shares: 800,
        cost: 17,
        price: 18.2
    },
    {
        name: "中信金",
        code: "2891",
        shares: 600,
        cost: 38,
        price: 39.5
    }
];
function updateStockChart() {
    stockChart.data.labels = stocks.map(stock => stock.name);
    stockChart.data.datasets[0].data = stocks.map(stock => stock.shares * stock.price);
    stockChart.update();
}
updateStockChart();

const stockList = document.getElementById("stockList");
const pageSize = 5;
let currentPage = 1;
const pagination = document.getElementById("stockPagination");
const pageInfo = document.getElementById("stockPageInfo");
const previousPageButton = document.getElementById("previousStockPage");
const nextPageButton = document.getElementById("nextStockPage");
const searchInput = document.getElementById("stockSearchInput");
const stockTableHead = document.querySelector("#stockList").closest("table").querySelector("thead");
const resultCount = document.getElementById("stockResultCount");
const pageRange = document.getElementById("stockPageRange");
const addStockDialog = document.getElementById("addStockDialog");
const addStockForm = document.getElementById("addStockForm");
const addStockButton = document.getElementById("openAddStock");
const previewMarketValue = document.getElementById("previewMarketValue");
const previewProfit = document.getElementById("previewProfit");
const previewAverageCost = document.getElementById("previewAverageCost");
const previewTransactionAmount = document.getElementById("previewTransactionAmount");
const previewPurchaseCost = document.getElementById("previewPurchaseCost");
const stockLookupInput = document.getElementById("stockLookupInput");
const stockCatalogOptions = document.getElementById("stockCatalogOptions");
const stockCodeInput = document.getElementById("stockCodeInput");
const stockNameInput = document.getElementById("stockNameInput");
let sortState = { key: null, direction: "asc" };

function escapeHtml(value) {
    const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(value).replace(/[&<>"']/g, character => entities[character]);
}

function renderStockCatalogOptions() {
    stockCatalogOptions.innerHTML = stocks.map(stock =>
        `<option value="${escapeHtml(stock.code)} · ${escapeHtml(stock.name)}"></option>`
    ).join("");
}
renderStockCatalogOptions();


//股票搜尋
function getFilteredStocks() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    if (!query) return [...stocks];//沒輸入 就正常輸出
    //有輸入 篩選name或code中有包含輸入值的股票
    return stocks.filter(stock =>
        stock.name.toLocaleLowerCase().includes(query) ||
        stock.code.toLocaleLowerCase().includes(query)
    );
}

function getSortedStocks() {
    const result = getFilteredStocks();
    if (!sortState.key) return result;

    const getValue = stock => {
        switch (sortState.key) {
            case "name": return stock.name;
            case "shares": return stock.shares;
            case "cost": return stock.cost;
            case "price": return stock.price;
            case "marketValue": return stock.shares * stock.price;
            case "profit": return (stock.price - stock.cost) * stock.shares;
            default: return "";
        }
    };

    return result.sort((a, b) => {
        const aValue = getValue(a);
        const bValue = getValue(b);
        const comparison = typeof aValue === "string"
            ? aValue.localeCompare(bValue, "zh-TW")
            : aValue - bValue;
        return sortState.direction === "asc" ? comparison : -comparison;
    });
}

function updateSortIndicators() {
    stockTableHead.querySelectorAll("[data-sort-key]").forEach(button => {
        const isActive = button.dataset.sortKey === sortState.key;
        const header = button.closest("th");
        const icon = button.querySelector("[data-sort-icon]");
        const ascendingArrow = icon.querySelector('[data-sort-arrow="asc"]');
        const descendingArrow = icon.querySelector('[data-sort-arrow="desc"]');
        const directionLabel = sortState.direction === "asc" ? "升冪" : "降冪";

        header.setAttribute("aria-sort", isActive
            ? (sortState.direction === "asc" ? "ascending" : "descending")
            : "none");
        button.setAttribute("aria-label", `${button.dataset.sortLabel}排序${isActive ? `，${directionLabel}` : ""}`);
        button.setAttribute("aria-pressed", String(isActive));
        ascendingArrow.classList.toggle("text-[#2F6B63]", isActive && sortState.direction === "asc");
        ascendingArrow.classList.toggle("text-gray-400", !isActive || sortState.direction !== "asc");
        descendingArrow.classList.toggle("text-[#2F6B63]", isActive && sortState.direction === "desc");
        descendingArrow.classList.toggle("text-gray-400", !isActive || sortState.direction !== "desc");
    });
}

function renderStocks() {
    const displayedStocks = getSortedStocks();
    updateSortIndicators();
    const pageCount = Math.max(1, Math.ceil(displayedStocks.length / pageSize));
    currentPage = Math.min(currentPage, pageCount);
    const startIndex = (currentPage - 1) * pageSize;
    const pageStocks = displayedStocks.slice(startIndex, startIndex + pageSize);

    stockList.innerHTML = displayedStocks.length === 0
        ? '<tr><td colspan="6" class="px-3 py-10 text-center text-gray-500">找不到符合的股票，請試試其他名稱或代號。</td></tr>'
        : pageStocks.map(stock => {
        const marketValue = stock.shares * stock.price;
        const profit = (stock.price - stock.cost) * stock.shares;

        return `
         <tr class="border-b border-gray-300 hover:bg-[#F8F7F4] transition">
            <td class="px-3 py-4 break-words">
                <span class="font-bold text-gray-800">${escapeHtml(stock.name)}</span><br>
                ${escapeHtml(stock.code)}
            </td>
            <td class="px-3 py-4 font-medium">${stock.shares} 股</td>
            <td class="px-3 py-4 font-medium">$${stock.cost}</td>
            <td class="px-3 py-4 font-medium">$${stock.price}</td>
            <td class="px-3 py-4 font-medium">$${marketValue.toLocaleString()}</td>
            <td class="px-3 py-4 text-green-600 font-medium whitespace-nowrap">+$${profit.toLocaleString()}</td>
        </tr>
    `;
    }).join("");

    
    resultCount.textContent = `共 ${displayedStocks.length} 筆`;
    pageRange.textContent = displayedStocks.length === 0
        ? "沒有符合的資料"
        : `顯示 ${startIndex + 1}–${Math.min(startIndex + pageSize, displayedStocks.length)} 筆`;

    if (pagination) {
        pagination.classList.toggle("hidden", displayedStocks.length <= pageSize);
        pageInfo.textContent = `第 ${currentPage} / ${pageCount} 頁`;
        previousPageButton.disabled = currentPage === 1;
        nextPageButton.disabled = currentPage === pageCount;
    }
}

previousPageButton?.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage -= 1;
        renderStocks();
    }
});

nextPageButton?.addEventListener("click", () => {
    const pageCount = Math.ceil(getSortedStocks().length / pageSize);
    if (currentPage < pageCount) {
        currentPage += 1;
        renderStocks();
    }
});

searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderStocks();
});

stockTableHead.addEventListener("click", event => {
    const button = event.target.closest("[data-sort-key]");
    if (!button) return;

    const key = button.dataset.sortKey;
    if (sortState.key === key) {
        sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
    } else {
        sortState.key = key;
        sortState.direction = button.dataset.sortDefault || "asc";
    }

    currentPage = 1;
    renderStocks();
});

function updateAddStockPreview() {
    const shares = Number(addStockForm.elements.shares.value);
    const executionPrice = Number(addStockForm.elements.executionPrice.value);
    const commissionValue = addStockForm.elements.commission.value.trim();
    const commission = commissionValue === "" ? 0 : Number(commissionValue);
    const price = Number(addStockForm.elements.price.value);
    const code = stockCodeInput.value.trim().toUpperCase();
    const existingStock = stocks.find(stock => stock.code.toUpperCase() === code);

    if (!Number.isFinite(shares) || shares <= 0 ||
        !Number.isFinite(executionPrice) || executionPrice <= 0 ||
        !Number.isFinite(commission) || commission < 0 ||
        !Number.isFinite(price) || price <= 0) {
        previewTransactionAmount.textContent = "—";
        previewPurchaseCost.textContent = "—";
        previewAverageCost.textContent = "—";
        previewMarketValue.textContent = "—";
        previewProfit.textContent = "—";
        previewProfit.classList.remove("text-green-600", "text-red-600");
        return;
    }

    const transactionAmount = shares * executionPrice;
    const purchaseCost = transactionAmount + commission;
    const totalShares = shares + (existingStock?.shares ?? 0);
    const totalCost = purchaseCost + (existingStock ? existingStock.shares * existingStock.cost : 0);
    const averageCost = totalCost / totalShares;
    const marketValue = totalShares * price;
    const profit = (price - averageCost) * totalShares;
    previewTransactionAmount.textContent = `$${transactionAmount.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}`;
    previewPurchaseCost.textContent = `$${purchaseCost.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}`;
    previewAverageCost.textContent = `$${averageCost.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}`;
    previewMarketValue.textContent = `$${marketValue.toLocaleString("zh-TW", { maximumFractionDigits: 2 })}`;
    previewProfit.textContent = `${profit >= 0 ? "+" : "−"}$${Math.abs(profit).toLocaleString("zh-TW", { maximumFractionDigits: 2 })}`;
    previewProfit.classList.toggle("text-green-600", profit >= 0);
    previewProfit.classList.toggle("text-red-600", profit < 0);
}

stockLookupInput.addEventListener("input", () => {
    const selectedStock = stocks.find(stock =>
        stockLookupInput.value === `${stock.code} · ${stock.name}`
    );

    if (selectedStock) {
        stockLookupInput.dataset.selectedCode = selectedStock.code;
        stockLookupInput.dataset.selectedName = selectedStock.name;
        stockCodeInput.value = selectedStock.code;
        stockNameInput.value = selectedStock.name;
    } else if (stockLookupInput.dataset.selectedCode) {
        if (stockCodeInput.value === stockLookupInput.dataset.selectedCode &&
            stockNameInput.value === stockLookupInput.dataset.selectedName) {
            stockCodeInput.value = "";
            stockNameInput.value = "";
        }
        delete stockLookupInput.dataset.selectedCode;
        delete stockLookupInput.dataset.selectedName;
    }
    updateAddStockPreview();
});

addStockButton?.addEventListener("click", () => {
    addStockForm.reset();
    delete stockLookupInput.dataset.selectedCode;
    delete stockLookupInput.dataset.selectedName;
    updateAddStockPreview();
    addStockDialog.showModal();
    stockLookupInput.focus();
});

document.getElementById("closeAddStock")?.addEventListener("click", () => addStockDialog.close());
document.getElementById("cancelAddStock")?.addEventListener("click", () => addStockDialog.close());

addStockForm.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("input", updateAddStockPreview);
});

stockCodeInput.addEventListener("input", updateAddStockPreview);

addStockForm.addEventListener("submit", event => {
    event.preventDefault();

    const formData = new FormData(addStockForm);
    const stock = {
        code: String(formData.get("code")).trim().toUpperCase(),
        name: String(formData.get("name")).trim(),
        shares: Number(formData.get("shares")),
        executionPrice: Number(formData.get("executionPrice")),
        commission: formData.get("commission") === "" ? 0 : Number(formData.get("commission")),
        price: Number(formData.get("price"))
    };

    if (!stock.code || !stock.name || !Number.isFinite(stock.shares) || !Number.isFinite(stock.executionPrice) || !Number.isFinite(stock.commission) || !Number.isFinite(stock.price)) {
        return;
    }

    const purchaseCost = stock.shares * stock.executionPrice + stock.commission;
    const existingIndex = stocks.findIndex(item => item.code.toUpperCase() === stock.code);
    let targetIndex;

    if (existingIndex >= 0) {
        const existingStock = stocks[existingIndex];
        const totalShares = existingStock.shares + stock.shares;
        existingStock.cost = (existingStock.shares * existingStock.cost + purchaseCost) / totalShares;
        existingStock.shares = totalShares;
        existingStock.name = stock.name;
        existingStock.price = stock.price;
        targetIndex = existingIndex;
    } else {
        stocks.push({
            code: stock.code,
            name: stock.name,
            shares: stock.shares,
            cost: purchaseCost / stock.shares,
            price: stock.price
        });
        targetIndex = stocks.length - 1;
    }

    renderStockCatalogOptions();
    searchInput.value = "";
    sortState = { key: null, direction: "asc" };
    currentPage = Math.floor(targetIndex / pageSize) + 1;
    renderStocks();
    addStockForm.reset();
    delete stockLookupInput.dataset.selectedCode;
    delete stockLookupInput.dataset.selectedName;
    updateAddStockPreview();
    addStockDialog.close();
});

renderStocks();

