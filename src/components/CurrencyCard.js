import React from 'react';
import { motion } from 'framer-motion';

const CurrencyCard = ({ currency, rate, baseCurrency }) => {
    return (
        <motion.div
            className="currency-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
        >
            <h3>{currency}</h3>
            <p>1 {baseCurrency} = {rate.toFixed(4)} {currency}</p>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                    height: "3px",
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    marginTop: "10px"
                }}
            />
        </motion.div>
    );
};

export default CurrencyCard;