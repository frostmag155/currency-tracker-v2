import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Loader, RefreshCw } from 'lucide-react';
import './styles/App.css';
import './styles/animations.css';

function App() {
    const [currencyData, setCurrencyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState('');
    const [stats, setStats] = useState({
        maxRate: { value: 0, currency: '', date: '' },
        minRate: { value: 0, currency: '', date: '' },
        averageRate: 0
    });

    // Функция для получения данных ЦБ РФ
    const fetchCurrencyData = async () => {
        try {
            setLoading(true);
            
            // Используем актуальную дату (20.09.2025)
            const response = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
            const data = await response.json();
            
            // Преобразуем данные в нужный формат
            const currencies = Object.values(data.Valute);
            const currentDate = new Date().toLocaleDateString('ru-RU');
            
            // Рассчитываем статистику для рубля
            const rubleRates = currencies.map(currency => currency.Value);
            const maxRate = Math.max(...rubleRates);
            const minRate = Math.min(...rubleRates);
            const averageRate = rubleRates.reduce((a, b) => a + b, 0) / rubleRates.length;
            
            // Находим валюты с максимальным и минимальным курсом
            const maxCurrency = currencies.find(currency => currency.Value === maxRate);
            const minCurrency = currencies.find(currency => currency.Value === minRate);
            
            setStats({
                maxRate: { 
                    value: maxRate, 
                    currency: maxCurrency?.Name || '', 
                    charCode: maxCurrency?.CharCode || '',
                    date: currentDate
                },
                minRate: { 
                    value: minRate, 
                    currency: minCurrency?.Name || '', 
                    charCode: minCurrency?.CharCode || '',
                    date: currentDate
                },
                averageRate: averageRate
            });
            
            setCurrencyData(currencies);
            setLastUpdate(new Date().toLocaleTimeString('ru-RU'));
            setLoading(false);
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrencyData();
        
        // Обновляем данные каждые 30 минут (вместо постоянных запросов)
        const interval = setInterval(fetchCurrencyData, 30 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Анимации для карточек
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };

    if (loading) {
        return (
            <div className="app-loading">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="loading-container"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                        <Loader size={60} color="#667eea" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Загрузка курсов валют...
                    </motion.h2>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="App">
            {/* Хедер */}
            <motion.header 
                className="app-header"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <div className="header-content">
                    <motion.h1
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        💎 Аналитика курсов валют ЦБ РФ
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        Актуальные данные на {lastUpdate}
                    </motion.p>
                    <motion.button
                        onClick={fetchCurrencyData}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="refresh-btn"
                    >
                        <RefreshCw size={18} />
                        Обновить
                    </motion.button>
                </div>
            </motion.header>

            {/* Основные метрики */}
            <motion.div 
                className="stats-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Максимальный курс */}
                <motion.div className="stat-card max-rate" variants={itemVariants}>
                    <div className="stat-header">
                        <TrendingUp size={32} color="#10b981" />
                        <h3>Максимальный курс</h3>
                    </div>
                    <div className="stat-value">{stats.maxRate.value.toFixed(2)} ₽</div>
                    <div className="stat-currency">{stats.maxRate.charCode} - {stats.maxRate.currency}</div>
                    <div className="stat-date">
                        <Calendar size={16} />
                        {stats.maxRate.date}
                    </div>
                </motion.div>

                {/* Минимальный курс */}
                <motion.div className="stat-card min-rate" variants={itemVariants}>
                    <div className="stat-header">
                        <TrendingDown size={32} color="#ef4444" />
                        <h3>Минимальный курс</h3>
                    </div>
                    <div className="stat-value">{stats.minRate.value.toFixed(2)} ₽</div>
                    <div className="stat-currency">{stats.minRate.charCode} - {stats.minRate.currency}</div>
                    <div className="stat-date">
                        <Calendar size={16} />
                        {stats.minRate.date}
                    </div>
                </motion.div>

                {/* Средний курс */}
                <motion.div className="stat-card average-rate" variants={itemVariants}>
                    <div className="stat-header">
                        <DollarSign size={32} color="#3b82f6" />
                        <h3>Средний курс рубля</h3>
                    </div>
                    <div className="stat-value">{stats.averageRate.toFixed(2)} ₽</div>
                    <div className="stat-description">По всем валютам</div>
                    <div className="stat-date">
                        <Calendar size={16} />
                        {lastUpdate}
                    </div>
                </motion.div>
            </motion.div>

            {/* Таблица валют */}
            <motion.div 
                className="currency-table-container"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
            >
                <h2>Курсы валют ЦБ РФ</h2>
                <div className="currency-table">
                    <div className="table-header">
                        <span>Валюта</span>
                        <span>Код</span>
                        <span>Курс (₽)</span>
                        <span>Изменение</span>
                    </div>
                    <AnimatePresence>
                        {currencyData.map((currency, index) => (
                            <motion.div
                                key={currency.ID}
                                className="table-row"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, backgroundColor: 'rgba(102, 126, 234, 0.1)' }}
                            >
                                <span>{currency.Name}</span>
                                <span className="currency-code">{currency.CharCode}</span>
                                <span className="currency-rate">{currency.Value.toFixed(2)} ₽</span>
                                <span className={currency.Value > currency.Previous ? 'change-up' : 'change-down'}>
                                    {currency.Value > currency.Previous ? '↗' : '↘'} 
                                    {Math.abs(currency.Value - currency.Previous).toFixed(2)}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

export default App;