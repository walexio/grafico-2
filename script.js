

let myChart; 

document.addEventListener("DOMContentLoaded", () => {
  const chartContainer = document.getElementById("chart-container");
  const chartCanvas = document.getElementById("myChart").getContext("2d");
  const currencyPairSelect = document.getElementById("currencyPair");

  currencyPairSelect.addEventListener('change', fetchExchangeRateHistory);


  fetchExchangeRateHistory();

  async function fetchExchangeRateHistory() {
    const currencyPair = currencyPairSelect.value;
    const [baseCurrency, targetCurrency] = currencyPair.split('-');

    const today = new Date();
    const dates = [];

    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date);
    }

  
    const dateFormats = dates.map(date => date.toISOString().split('T')[0]);

    const responses = await Promise.all(dateFormats.map(dateFormat => fetch(`https://api.frankfurter.app/${dateFormat}?from=${baseCurrency}&to=${targetCurrency}`)));

 
    const dataForDays = await Promise.all(responses.map(response => response.json()));

  
    const exchangeRates = dataForDays.map(data => data.rates[targetCurrency]);

    const chartData = {
      labels: dates.map(date => date.toLocaleDateString()),
      datasets: [{
        label: `Valor de 1 ${baseCurrency} en ${targetCurrency}`,
        data: exchangeRates.reverse(), 
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2
      }]
    };

    displayChart(chartData);
  }

  function displayChart(data) {
 
    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(chartCanvas, {
      type: 'line',
      data: data,
      options: {
        scales: {
          x: {
            type: 'category',
            labels: data.labels
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
});