import { Together } from "together-ai"; // Correct import

const together = new Together({
  apiKey: process.env.REACT_APP_TOGETHER_API_KEY, // Ensure this is set in .env
});

let lastRequestTime = 0;

const languagePrompts = {
  en: "You are an expert financial advisor. Provide clear, concise, and well-structured responses in English.",
  hi: "आप एक विशेषज्ञ वित्तीय सलाहकार हैं। हिंदी में स्पष्ट, संक्षिप्त और सुसंरचित प्रतिक्रियाएं दें।",
  ta: "நீங்கள் ஒரு நிபுணர் நிதி ஆலோசகர். தமிழில் தெளிவான, சுருக்கமான மற்றும் நன்கு கட்டமைக்கப்பட்ட பதில்களை வழங்குங்கள்.",
  te: "మీరు నిపుణులైన ఆర్థిక సలహాదారు. తెలుగులో స్పష్టమైన, సంక్షిప్తమైన మరియు బాగా నిర్మించిన ప్రతిస్పందనలను అందించండి.",
  kn: "ನೀವು ಪರಿಣತ ಆರ್ಥಿಕ ಸಲಹೆಗಾರ. ಕನ್ನಡದಲ್ಲಿ ಸ್ಪಷ್ಟ, ಸಂಕ್ಷಿಪ್ತ ಮತ್ತು ಚೆನ್ನಾಗಿ ರಚಿಸಿದ ಪ್ರತಿಕ್ರಿಯೆಗಳನ್ನು ನೀಡಿ.",
  ml: "നിങ്ങൾ വിദഗ്ധ ധനകാര്യ ഉപദേഷ്ടാവാണ്. മലയാളത്തിൽ വ്യക്തമായ, ചുരുക്കമായ, നന്നായി ഘടനാപരമായ പ്രതികരണങ്ങൾ നൽകുക.",
  gu: "તમે નિષ્ણાત નાણાકીય સલાહકાર છો. ગુજરાતીમાં સ્પષ્ટ, સંક્ષિપ્ત અને સારી રીતે રચાયેલા જવાબો આપો.",
  bn: "আপনি একজন বিশেষজ্ঞ আর্থিক উপদেষ্টা। বাংলায় স্পষ্ট, সংক্ষিপ্ত এবং সুগঠিত প্রতিক্রিয়া দিন।"
};

export async function sendMsgToTogetherAI(message, language = 'en') {
  try {
    const now = Date.now();
    if (now - lastRequestTime < 3000) { // 3-second delay
      console.warn("Too many requests. Please wait.");
      return "🚫 Too many requests! Try again in a few seconds.";
    }

    lastRequestTime = now;

    const systemPrompt = `${languagePrompts[language] || languagePrompts.en}

Your role is to:
1. Provide Educational Information:
   - Basic investment concepts
   - Understanding of Indian stock market (NSE/BSE)
   - Mutual funds and SIP basics
   - Tax implications of investments
   - Risk management strategies

2. Personal Finance Guidance:
   - Budgeting and saving strategies
   - Emergency fund planning
   - Debt management
   - Insurance basics
   - Retirement planning

3. Investment Products:
   - Stocks and equity
   - Mutual funds and ETFs
   - Fixed deposits and bonds
   - PPF and other government schemes
   - Gold and other commodities

4. Risk Assessment:
   - Help users understand their risk profile
   - Suggest suitable investment options
   - Explain market volatility
   - Discuss diversification strategies

Always include these important disclaimers:
1. This is for educational purposes only
2. Past performance doesn't guarantee future results
3. Always do your own research before investing
4. Consider consulting with a financial advisor
5. Investments are subject to market risks
6. Tax benefits are subject to change based on government policies`;

    const res = await together.completions.create({
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      messages: [
        { "role": "system", "content": systemPrompt },
        { "role": "user", "content": message }
      ],
      temperature: 0.7,
      max_tokens: 512,
    });

    return res.choices[0].text.trim();
  } catch (error) {
    console.error("Error calling Together AI:", error);
    if (error.status === 429) {
      return "🚫 Rate limit exceeded! Please wait and try again later.";
    }
    return "⚠️ An error occurred. Please try again.";
  }
}
