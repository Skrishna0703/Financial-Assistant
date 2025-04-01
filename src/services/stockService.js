import axios from 'axios';

const ALPHA_VANTAGE_API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

// Common Indian stock symbols
const INDIAN_STOCKS = {
  'reliance': 'RELIANCE.BSE',
  'tcs': 'TCS.BSE',
  'hdfc': 'HDFCBANK.BSE',
  'infosys': 'INFY.BSE',
  'icici': 'ICICIBANK.BSE',
  'sbi': 'SBIN.BSE',
  'bharti': 'BHARTIARTL.BSE',
  'itc': 'ITC.BSE',
  'kotak': 'KOTAKBANK.BSE',
  'axis': 'AXISBANK.BSE'
};

const validateApiKey = () => {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('Alpha Vantage API key is missing. Please add REACT_APP_ALPHA_VANTAGE_API_KEY to your .env file.');
  }
};

const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    if (error.response.status === 401) {
      throw new Error('Invalid API key. Please check your Alpha Vantage API key.');
    } else if (error.response.status === 429) {
      throw new Error('API rate limit exceeded. Please try again in a minute.');
    } else {
      throw new Error(`API Error: ${error.response.data.message || 'Unknown error occurred'}`);
    }
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('Unable to connect to the stock service. Please check your internet connection.');
  } else {
    // Something happened in setting up the request
    throw new Error(error.message || 'An unexpected error occurred while fetching stock data.');
  }
};

export const fetchStockData = async (symbol) => {
  try {
    validateApiKey();

    // Convert symbol to BSE format if it's an Indian stock
    const bseSymbol = INDIAN_STOCKS[symbol.toLowerCase()] || `${symbol}.BSE`;

    // Fetch daily time series data
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: bseSymbol,
        apikey: ALPHA_VANTAGE_API_KEY,
        outputsize: 'compact'
      }
    });

    // Check for API error messages
    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    if (response.data['Note']) {
      if (response.data['Note'].includes('API call frequency')) {
        throw new Error('API rate limit reached. Please try again in a minute.');
      }
      console.warn('API Note:', response.data['Note']);
    }

    const timeSeriesData = response.data['Time Series (Daily)'];
    if (!timeSeriesData) {
      throw new Error(`No data available for ${symbol}. Please verify the stock symbol and try again.`);
    }

    // Transform the data for the chart
    const chartData = Object.entries(timeSeriesData)
      .slice(0, 30) // Get last 30 days of data
      .map(([date, values]) => ({
        date: date,
        price: parseFloat(values['4. close']),
        volume: parseInt(values['5. volume']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        open: parseFloat(values['1. open'])
      }))
      .reverse();

    if (chartData.length < 2) {
      throw new Error(`Insufficient data available for ${symbol}. Please try again later.`);
    }

    const currentPrice = chartData[chartData.length - 1].price;
    const previousPrice = chartData[chartData.length - 2].price;
    const dailyChange = currentPrice - previousPrice;
    const dailyChangePercent = (dailyChange / previousPrice) * 100;

    return {
      chartData,
      currentPrice,
      dailyChange,
      dailyChangePercent,
      lastUpdated: chartData[chartData.length - 1].date,
      market: 'BSE'
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    handleApiError(error);
  }
};

export const searchStocks = async (query) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'SYMBOL_SEARCH',
        keywords: query,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    return response.data.bestMatches || [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    throw error;
  }
};

export const getCompanyOverview = async (symbol) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'OVERVIEW',
        symbol: symbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching company overview:', error);
    throw error;
  }
};

export const getRealTimePrice = async (symbol) => {
  try {
    if (!ALPHA_VANTAGE_API_KEY) {
      throw new Error('API key not found. Please check your environment variables.');
    }

    // Convert symbol to BSE format if it's an Indian stock
    const bseSymbol = INDIAN_STOCKS[symbol.toLowerCase()] || `${symbol}.BSE`;

    const response = await axios.get(BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: bseSymbol,
        apikey: ALPHA_VANTAGE_API_KEY
      }
    });

    // Check for API error messages
    if (response.data['Error Message']) {
      throw new Error(response.data['Error Message']);
    }

    if (response.data['Note']) {
      console.warn('API Rate Limit Note:', response.data['Note']);
    }

    const quote = response.data['Global Quote'];
    if (!quote) {
      throw new Error(`No real-time data available for ${symbol}. Please check if the symbol is correct.`);
    }

    const price = parseFloat(quote['05. price']);
    const change = parseFloat(quote['09. change']);
    const changePercent = parseFloat(quote['10. change percent']);

    if (isNaN(price) || isNaN(change) || isNaN(changePercent)) {
      throw new Error('Invalid price data received from the API');
    }

    return {
      price,
      change,
      changePercent,
      high: parseFloat(quote['03. high']),
      low: parseFloat(quote['04. low']),
      volume: parseInt(quote['06. volume']),
      lastUpdated: quote['07. latest trading day'],
      market: 'BSE' // Indicate this is from BSE
    };
  } catch (error) {
    console.error('Error fetching real-time price:', error);
    throw new Error(error.message || 'Failed to fetch real-time price. Please try again later.');
  }
}; 