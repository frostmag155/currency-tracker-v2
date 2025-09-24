import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Converter = ({ exchangeRates }) => {
    const [amount, setAmount] = useState(1);
    const [fromCurrency, setFromCurrency] = useState('USD');
    const [toCurrency, setToCurrency] = useState('EUR');
    const [convertedAmount, setConvertedAmount] = useState(0);

    useEffect(() => {
        if (exchangeRates && Object.keys(exchangeRates).length > 0) {
            handleConvert();
        }
    }, [amount, fromCurrency, toCurrency, exchangeRates]);

    const handleConvert = () => {
        if (exchangeRates[fromCurrency] && exchangeRates[toCurrency]) {
            const rateFrom = exchangeRates[fromCurrency];
            const rateTo = exchangeRates[toCurrency];
            const result = (amount / rateFrom) * rateTo;
            setConvertedAmount(result);
        }
    };

    const currencies = Object.keys(exchangeRates || {});

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="input-group">
                <input 
                    type="number" 
                    value={amount} 
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Amount"
                    min="0"
                />
            </div>

            <div className="input-group">
                <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: 0 }}
                style={{ fontSize: '24px', margin: '10px 0' }}
            >
                ⬇️
            </motion.div>

            <div className="input-group">
                <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
                    {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>

            {convertedAmount > 0 && (
                <motion.div
                    className="result"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {amount} {fromCurrency} = {convertedAmount.toFixed(4)} {toCurrency}
                </motion.div>
            )}
        </motion.div>
    );
};

export default Converter;