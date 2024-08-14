import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const [amount, setAmount] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [toCurrency, setToCurrency] = useState("USD");

  const handleFromCurrency = (value) => {
    setFromCurrency(value);
  };

  const handleToCurrency = (value) => {
    setToCurrency(value);
  };

  const handleInsertedValue = (value) => {
    setAmount((value * amount).toFixed(2));
  };

  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchCurrency = async () => {
      try {
        const res = await axios.get(
          `https://api.frankfurter.app/latest?amount=100&from=${fromCurrency}&to=${toCurrency}`,
          { cancelToken: source.token },
        );
        const { rates } = res.data;
        const rate = rates[toCurrency];
        setAmount(rate / 100);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.log("Error:", err);
        }
      }
    };
    fetchCurrency();

    return () => {
      source.cancel("Component unmounted");
    };
  }, [fromCurrency, toCurrency]);

  return (
    <div className="container">
      <input
        type="text"
        onChange={(e) => handleInsertedValue(e.target.value)}
        placeholder="Enter amount"
      />

      <select
        onChange={(e) => handleFromCurrency(e.target.value)}
        value={fromCurrency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="PLN">PLN</option>
      </select>
      <select
        onChange={(e) => handleToCurrency(e.target.value)}
        value={toCurrency}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="PLN">PLN</option>
      </select>
      {fromCurrency === toCurrency ? (
        <p>You can't set the same currency!</p>
      ) : isNaN(amount) ? (
        <p>Enter a valid amount</p>
      ) : (
        <p>{amount ? `${amount} ${toCurrency}` : "Enter an amount"}</p>
      )}
    </div>
  );
}
