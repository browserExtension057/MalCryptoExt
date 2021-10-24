const CacheKey = "Cache_Rate";

class ConvertApp {

    lblLoader = document.querySelector("#lbl-loader");
    lblUpdateTime = document.querySelector("#lbl-update-time");
    txtAmount = document.querySelector("#txt-amount");
    txtUsd = document.querySelector("#txt-usd");
    rate = 0;
    async initialize() {
        this.formatter = new Intl.NumberFormat();

        this.txtAmount.addEventListener("input",
            () => this.calculate());
        this.txtUsd.addEventListener("input",
            () => this.calculate(true));

        document.body.loc();

        this.refreshData();
        this.fetchData();
    }

    async fetchData() {
        const symbol = "BTC";

        const rateRequest = await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD`);
        if (!rateRequest.ok) {
            console.error("Failed to fetch");
            return;
        }

        const rate = await rateRequest.json();

        const historyRequest = await fetch(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=30`);
        if (!historyRequest.ok) {
            console.error("Failed to fetch");
            return;
        }

        const history = await historyRequest.json();

        const cache = {
            cacheTime: Date.now(),
            data: {
                rate: rate,
                history: history,
            },
        };

        localStorage.setItem(CacheKey, JSON.stringify(cache));

        this.lblLoader.classList.add("invisible");
        this.refreshData();
    }

    refreshData() {
        const raw = localStorage.getItem(CacheKey);

        if (!raw) {
            this.lblLoader.classList.remove("invisible");

            return;
        }

        let cache;
        try {
            cache = JSON.parse(raw);
        } catch (e) {
            console.error(e);
            localStorage.removeItem(CacheKey);
            window.location.reload();
        }

        this.rate = cache.data.rate.USD;
        this.lblUpdateTime.innerHTML = new Date(cache.cacheTime).toLocaleString();
        this.drawChart(cache.data.history.Data.Data);
        this.calculate();
    }

    drawChart(data) {
        let counter = 0;
        const labels = data.map(q => {
            counter++;
            if (counter > 1 && counter < data.length && (counter % 5 > 0 || counter > data.length - 5)) {
                return "";
            }

            const d = new Date(q.time * 1000);
            return `${d.toLocaleDateString("default", { month: "short", })} ${d.getDate()}`;
        });
        const values = data.map(q => q.close);

        new Chartist.Line("#chart", {
            labels: labels,
            series: [
                values,
            ],
        });
    }

    calculate(keepUsd) {
        if (keepUsd) {
            const usd = Number(this.txtUsd.value) || 0;
            const amount = usd / this.rate;
            this.txtAmount.value = Math.round(amount * 100) / 100;
        } else {
            const amount = Number(this.txtAmount.value) || 0;
            const usd = amount * this.rate;
            this.txtUsd.value = Math.round(usd * 100) / 100;
        }
    }

}

new ConvertApp().initialize();