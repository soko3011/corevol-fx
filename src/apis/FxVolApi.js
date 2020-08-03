import axios from "axios";

const Api = axios.create({
  baseURL: "https://widget.sentryd.com/widget/sentry/api/Pricing"
});

var body = {
  Type: "Volatilities",
  Products:
    "EUR/USD,USD/JPY,GBP/USD,USD/CHF,USD/CAD,AUD/USD,NZD/USD,EUR/CAD,EUR/CHF,EUR/GBP,EUR/JPY,EUR/AUD,GBP/JPY,USD/CNH,USD/ILS,USD/MXN,USD/TRY,XAU/USD",
  POSTAccessCode: "sentryPricingApi",
  POSTAccessPassword: "sentrypricingapi_167",
  timestamp: "1592235237474"
};

export default {
  GetVols() {
    // return axios.post('https://widget.sentryd.com/widget/sentry/api/Pricing', {
    //     mode: 'no-cors',
    //     headers: {
    //         'Access-Control-Allow-Origin': '*',
    //         'Content-Type': 'application/json',
    //     },
    //     withCredentials: true,
    //     credentials: 'same-origin',
    //     Type: "Volatilities",
    //     Products: "EUR/USD,USD/JPY,GBP/USD,USD/CHF,USD/CAD,AUD/USD,NZD/USD,EUR/CAD,EUR/CHF,EUR/GBP,EUR/JPY,EUR/AUD,GBP/JPY,USD/CNH,USD/ILS,USD/MXN,USD/TRY,XAU/USD",
    //     POSTAccessCode: "sentryPricingApi",
    //     POSTAccessPassword: "sentrypricingapi_167",
    //     timestamp: "1592235237474"
    // })

    return axios
      .post("https://widget.sentryd.com/widget/sentry/api/Pricing", {
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        Type: "Volatilities",
        Products:
          "EUR/USD,USD/JPY,GBP/USD,USD/CHF,USD/CAD,AUD/USD,NZD/USD,EUR/CAD,EUR/CHF,EUR/GBP,EUR/JPY,EUR/AUD,GBP/JPY,USD/CNH,USD/ILS,USD/MXN,USD/TRY,XAU/USD",
        POSTAccessCode: "sentryPricingApi",
        POSTAccessPassword: "sentrypricingapi_167",
        timestamp: "1592235237474"
      })
      .then(res => {})
      .catch(err => {
        console.log(err.response);
      });
  }
};
