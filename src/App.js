import "./App.css";
import financialLogo from "./assets/financial-assistant-logo.svg";
import addbtn from "./assets/add-30.png";
import msg from "./assets/message.svg";
import sent from "./assets/send.svg";
import userIcon from "./assets/user-icon.png";
import translate from "./assets/translate.svg";
import { sendMsgToTogetherAI } from "./openai";
import { useState, useEffect, useRef } from "react";
import StockChart from "./components/StockChart";
import { fetchStockData, searchStocks, getCompanyOverview, getRealTimePrice } from "./services/stockService";
import LanguageSelector from './components/LanguageSelector';
import Translator from './components/Translator';
import Team from './components/Team';
import { Routes, Route, useNavigate } from 'react-router-dom';

function MainContent() {
  const msgEnd = useRef(null);
  const [input, setInput] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [realTimePrice, setRealTimePrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "नमस्ते! मैं आपका वित्तीय सहायक हूं। मैं आपकी मदद कर सकता हूं:\n\n" +
            "📚 बुनियादी निवेश की जानकारी\n" +
            "💰 निवेश उत्पादों की जानकारी\n" +
            "📈 शेयर बाजार की समझ\n" +
            "🎯 व्यक्तिगत वित्तीय योजना\n" +
            "⚠️ जोखिम प्रबंधन\n\n" +
            "आप क्या जानना चाहेंगे?" 
    }
  ]);
  const [isTranslatorOpen, setIsTranslatorOpen] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState(null);
  const [translatingMessage, setTranslatingMessage] = useState(null);
  const navigate = useNavigate();
  
  const scrollToBottom = () => {
    msgEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval;
    if (selectedStock) {
      const updateRealTimePrice = async () => {
        try {
          const price = await getRealTimePrice(selectedStock);
          setRealTimePrice(price);
        } catch (err) {
          console.error("Error updating real-time price:", err);
        }
      };

      updateRealTimePrice();
      
      interval = setInterval(updateRealTimePrice, 60000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [selectedStock]);

  const fetchStockInfo = async (symbol) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStockData(symbol);
      setStockData(data);
      setSelectedStock(symbol);
    } catch (err) {
      setError(err.message || "Failed to fetch stock data. Please try again later.");
      console.error("Error fetching stock data:", err);
      setStockData(null);
      setSelectedStock(null);
    } finally {
      setLoading(false);
    }
  };
  
  const handlerEnter = async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSend();
    }
  };

  const extractStockSymbol = (query) => {
    // Common stock symbols to check for
    const commonStocks = {
      'apple': 'AAPL',
      'google': 'GOOGL',
      'microsoft': 'MSFT',
      'amazon': 'AMZN',
      'meta': 'META',
      'tesla': 'TSLA',
      'netflix': 'NFLX',
      'nvidia': 'NVDA',
      'intel': 'INTC',
      'amd': 'AMD'
    };

    // First check for exact stock symbol (1-5 capital letters)
    const symbolMatch = query.match(/\b[A-Z]{1,5}\b/);
    if (symbolMatch) {
      return symbolMatch[0];
    }

    // Then check for company names
    const queryLower = query.toLowerCase();
    for (const [company, symbol] of Object.entries(commonStocks)) {
      if (queryLower.includes(company)) {
        return symbol;
      }
    }

    return null;
  };

  const handlequery = async (query) => {
    if (!query.trim()) return;
    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);

    try {
      setLoading(true);
      setError(null);
      const res = await sendMsgToTogetherAI(query, currentLanguage);
      const botMessage = { sender: "bot", text: res };
      setMessages((prev) => [...prev, botMessage]);

      const stockSymbol = extractStockSymbol(query);
      if (stockSymbol) {
        await fetchStockInfo(stockSymbol);
      }
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Error getting response:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageSelect = (languageCode) => {
    setCurrentLanguage(languageCode);
    // You can add logic here to translate existing messages if needed
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
  
    try {
      setLoading(true);
      setError(null);
      const res = await sendMsgToTogetherAI(input, currentLanguage);
      const botMessage = { sender: "bot", text: res };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error("Error getting response:", err);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleTranslate = async (message, targetLanguage) => {
    if (!message) return;
    
    setTranslatingMessage(message);
    try {
      const translatedResponse = await sendMsgToTogetherAI(
        `Translate the following text to ${targetLanguage}: ${message}`,
        targetLanguage
      );
      setCurrentTranslation(translatedResponse);
    } catch (err) {
      console.error("Translation error:", err);
      setError("Failed to translate. Please try again.");
    }
  };

  const toggleTranslator = () => {
    setIsTranslatorOpen(!isTranslatorOpen);
  };

  const openTeamPage = () => {
    navigate('/team');
  };

  return (
    <div className="App">
      <div className="sidebar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={financialLogo} alt="Financial Assistant Logo" className="logo" />
            <span className="brand">Financial Assistant</span>
          </div>
          <button className="midBtn" onClick={() => window.location.reload()}>
            <img src={addbtn} alt="Add Icon" className="addBtn" /> New Chat
          </button>
          <div className="upperSideBottom">
            {[
              "What is SIP in mutual funds?",
              "How to start investing in stocks?",
              "What is PPF and its benefits?",
              "Show me RELIANCE stock history",
              "What is tax saving investment?",
              "How to create emergency fund?",
              "What is risk profile assessment?",
              "Show me HDFCBANK stock history"
            ].map((query, index) => (
              <button key={index} className="query" onClick={() => handlequery(query)}>
                <img src={msg} alt="Message Icon" className="queryIcon" /> {query}
              </button>
            ))}
          </div>
          <button className="team-button" onClick={openTeamPage}>
            <i className="fas fa-users team-icon"></i>
            Our Team
          </button>
        </div>
      </div>

      <div className="main">
        <div className="chats">
          {messages.map((msg, index) => (
            <div key={index} className={`chat ${msg.sender === "bot" ? "bot" : "user"}`}>
              <div className="chat-header">
                <img className="chatimg" src={msg.sender === "bot" ? financialLogo : userIcon} alt="" />
                <span className="chat-role">{msg.sender === "bot" ? "Financial Assistant" : "You"}</span>
              </div>
              <div className="chat-content" data-language={currentLanguage}>
                <p className="txt">{msg.text}</p>
                {msg.sender === "bot" && (
                  <Translator
                    currentMessage={msg.text}
                    onTranslate={handleTranslate}
                    activeLanguage={currentLanguage}
                  />
                )}
                {translatingMessage === msg.text && currentTranslation && (
                  <div className="translation-result">
                    <p className="translated-text">{currentTranslation}</p>
                  </div>
                )}
                {msg.sender === "bot" && index === messages.length - 1 && selectedStock && stockData && (
                  <div className="stock-info">
                    {loading ? (
                      <div className="loading">Loading stock data...</div>
                    ) : error ? (
                      <div className="error">{error}</div>
                    ) : (
                      <>
                        {realTimePrice && (
                          <div className="real-time-price">
                            <h4>Real-Time Price</h4>
                            <div className="price-details">
                              <span className="current-price">₹{realTimePrice.price.toFixed(2)}</span>
                              <span className={`price-change ${realTimePrice.change >= 0 ? 'positive' : 'negative'}`}>
                                {realTimePrice.change >= 0 ? '+' : ''}{realTimePrice.change.toFixed(2)} ({realTimePrice.changePercent.toFixed(2)}%)
                              </span>
                            </div>
                            <div className="price-meta">
                              <span>High: ₹{realTimePrice.high.toFixed(2)}</span>
                              <span>Low: ₹{realTimePrice.low.toFixed(2)}</span>
                              <span>Volume: {realTimePrice.volume.toLocaleString()}</span>
                            </div>
                            <div className="last-updated">
                              Last updated: {new Date(realTimePrice.lastUpdated).toLocaleTimeString()}
                            </div>
                          </div>
                        )}
                        <StockChart 
                          data={stockData.chartData}
                          symbol={selectedStock}
                          currentPrice={stockData.currentPrice}
                          dailyChange={stockData.dailyChange}
                          dailyChangePercent={stockData.dailyChangePercent}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat bot">
              <div className="chat-header">
                <img src={financialLogo} alt="Avatar" className="chatimg" />
                <span className="chat-role">Financial Assistant</span>
              </div>
              <div className="chat-content loading">
                Thinking...
              </div>
            </div>
          )}
          {error && (
            <div className="chat bot">
              <div className="chat-content error">
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
                <button className="retry-button" onClick={() => selectedStock && fetchStockInfo(selectedStock)}>
                  Try Again
                </button>
              </div>
            </div>
          )}
          <div ref={msgEnd} />
        </div>

        <div className="chatFooter">
          <div className="inp">
            <textarea
              className="inp"
              placeholder="Ask about investments, financial planning, or market trends..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handlerEnter}
              rows="1"
            />
            <button className="sent" onClick={handleSend}>
              <img src={sent} alt="Send" />
            </button>
          </div>
          <p>This is an AI assistant for educational purposes only. Always do your own research and consult a financial advisor before making investment decisions.</p>
        </div>
      </div>
      <LanguageSelector 
        onLanguageSelect={handleLanguageSelect}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainContent />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  );
}

export default App;
