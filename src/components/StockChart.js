import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StockChart = ({ data, symbol, currentPrice, dailyChange, dailyChangePercent }) => {
  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="stock-chart">
      <div className="stock-header">
        <h3>{symbol} Stock Price</h3>
        <div className="stock-price-info">
          <span className="current-price">{formatPrice(currentPrice)}</span>
          <span className={`price-change ${dailyChange >= 0 ? 'positive' : 'negative'}`}>
            {dailyChange >= 0 ? '+' : ''}{formatPrice(dailyChange)} ({dailyChangePercent.toFixed(2)}%)
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#40414f" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate}
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <YAxis 
            tickFormatter={formatPrice}
            stroke="#888"
            tick={{ fill: '#888' }}
          />
          <Tooltip 
            formatter={(value) => formatPrice(value)}
            labelFormatter={formatDate}
            contentStyle={{ 
              backgroundColor: '#343541', 
              border: '1px solid #40414f',
              borderRadius: '4px'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            name="Stock Price"
            dot={false}
            strokeWidth={2}
          />
          <Line 
            type="monotone" 
            dataKey="volume" 
            stroke="#82ca9d" 
            name="Volume"
            yAxisId={1}
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart; 