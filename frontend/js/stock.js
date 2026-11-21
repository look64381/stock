


lucide.createIcons();

// 取得圓餅圖的畫布
const ctx = document.getElementById('stockPieChart');

// 建立圓餅圖
new Chart(ctx, {
type: 'pie',

data: {
    labels: ['台積電', '鴻海', '0050','1234','5555'],

    datasets: [{
        data: [100000, 32000, 55500,1111,5555],

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
    }
];

const stockList = document.getElementById("stockList");

stocks.forEach(stock => {
    const marketValue = stock.shares * stock.price;
    const profit = (stock.price - stock.cost) * stock.shares;

    stockList.innerHTML += `
         <tr class="border-b border-gray-300 hover:bg-[#F8F7F4] transition">
            <td class="px-3 py-4">
                <span class="font-bold text-gray-800">${stock.name}</span><br>
                ${stock.code}
            </td>
            <td class="px-3 py-4 font-medium">${stock.shares} 股</td>
            <td class="px-3 py-4 font-medium">$${stock.cost}</td>
            <td class="px-3 py-4 font-medium">$${stock.price}</td>
            <td class="px-3 py-4 font-medium">$${marketValue.toLocaleString()}</td>
            <td class="px-3 py-4 text-green-600 font-medium whitespace-nowrap">+$${profit.toLocaleString()}</td>
        </tr>
    `;
});