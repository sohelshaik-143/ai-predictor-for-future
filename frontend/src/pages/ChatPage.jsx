import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ─── Pre-trained knowledge base ──────────────────────────────────────────────
const KB = [
  // PLATFORM HELP
  { keys:["what is this","what is aps","about this app","what can you do","platform","website"],
    en:"🧠 **APS AI Platform** has 4 sections:\n1. **📊 AI Dashboard** — predict income, track savings, investment plan\n2. **💼 Job Board (/jobs)** — find & post jobs across India\n3. **👷 Worker Hub (/worker)** — track daily wages, find better cities\n4. **🤖 AI Chat (/chat)** — that's me! Ask me anything.",
    hi:"🧠 **APS AI प्लेटफॉर्म** में 4 सेक्शन हैं:\n1. **📊 AI डैशबोर्ड** — आय भविष्यवाणी, बचत, निवेश\n2. **💼 जॉब बोर्ड** — नौकरी खोजें और पोस्ट करें\n3. **👷 वर्कर हब** — दैनिक वेतन ट्रैक करें\n4. **🤖 AI चैट** — मुझसे कुछ भी पूछें!" },

  { keys:["how to login","how to register","sign up","create account","register"],
    en:"🔐 **How to Register:**\n1. Click 'Get Started Free' on the home page\n2. Enter your name, email and password (min 6 chars)\n3. You'll be logged in automatically\n\n**How to Login:** Enter your email + password on the login page. Forgot password? Contact support.",
    hi:"🔐 **रजिस्ट्रेशन कैसे करें:**\n1. होम पेज पर 'Get Started Free' क्लिक करें\n2. नाम, ईमेल और पासवर्ड डालें (6+ अक्षर)\n3. स्वचालित रूप से लॉगिन हो जाएंगे" },

  { keys:["how to post job","post a job","upload job","add job","job posting"],
    en:"📢 **How to Post a Job:**\n1. Go to **/jobs** or click 'Job Board' from home\n2. Click '📢 Post a Job' tab (login required)\n3. Fill: title, company, city, pay, hours, description, contact\n4. Click '**Post Job — Go Live 🚀**'\n5. Your job goes **live immediately** and stays until YOU deactivate it!\n\n✅ Free · ⚡ Instant · 📱 WhatsApp apply",
    hi:"📢 **नौकरी पोस्ट करने के लिए:**\n1. **/jobs** पर जाएं\n2. '📢 नौकरी पोस्ट करें' टैब क्लिक करें (लॉगिन जरूरी)\n3. सारी जानकारी भरें\n4. 'पोस्ट करें 🚀' क्लिक करें\n✅ मुफ्त · ⚡ तुरंत लाइव" },

  { keys:["how to apply job","apply for job","apply","job application"],
    en:"📱 **Applying for a Job is Easy:**\n1. Go to **/jobs** — no login needed to browse!\n2. Find a job you like\n3. Click **'Apply on WhatsApp'** — opens WhatsApp with a pre-filled message\n4. OR click **'Call Now'** to call the employer directly\n\nTip: Filter by city and category to find relevant jobs faster!",
    hi:"📱 **नौकरी के लिए आवेदन:**\n1. **/jobs** पर जाएं — ब्राउज़ के लिए लॉगिन नहीं चाहिए\n2. पसंदीदा नौकरी ढूंढें\n3. **'WhatsApp पर आवेदन करें'** क्लिक करें\n4. या **'अभी कॉल करें'** पर क्लिक करें" },

  { keys:["deactivate job","turn off job","admin","toggle job","remove job"],
    en:"🔧 **Admin / Job Toggle:**\n- **Job posters** can activate/deactivate their own jobs from 'My Postings' tab\n- **Admin (shaikimambasha968@gmail.com)** can toggle ANY job\n- Jobs stay live until turned off — no auto-expiry by default\n- To delete: click 🗑 in My Postings tab",
    hi:"🔧 **नौकरी टॉगल:**\n- पोस्टर अपनी नौकरी 'My Postings' से चालू/बंद कर सकते हैं\n- एडमिन कोई भी नौकरी बंद कर सकते हैं\n- नौकरियां बंद होने तक लाइव रहती हैं" },

  { keys:["worker hub","daily wage","wage tracker","low income"],
    en:"👷 **Worker Hub (/worker)** helps daily wage workers:\n1. **💰 My Wages** — enter 7 days wages → see average/total/best\n   ⚠️ If avg < ₹500/day → shows **Low Income Alert** with better cities\n2. **🏙️ Find Work** — 8 cities with jobs + Google Maps\n3. **🎓 Part-time Jobs** — delivery, BPO, tutoring, data entry\n4. **📋 Apply Now** — quick application form\n\nNeeds login to access.",
    hi:"👷 **वर्कर हब** दैनिक मजदूरों के लिए:\n1. **💰 मेरी मजदूरी** — 7 दिन की कमाई → औसत देखें\n   ⚠️ ₹500/दिन से कम हो तो बेहतर शहर सुझाव\n2. **🏙️ काम खोजें** — 8 शहरों में नौकरी + Google Maps\n3. **🎓 पार्ट-टाइम** — डिलीवरी, BPO, ट्यूशन" },

  { keys:["which city best","best city work","migrate","better paying city","move to"],
    en:"🏙️ **Best Cities for Daily Wage Workers in India:**\n\n1. **Surat, Gujarat** — ₹750/day avg · Textile & Diamond industry\n2. **Bangalore** — ₹720/day avg · Tech city, delivery & construction booming\n3. **Mumbai** — ₹700/day avg · Largest job market in India\n4. **Delhi NCR** — ₹680/day avg · Transport, construction, warehousing\n5. **Pune** — ₹650/day avg · Auto factories & IT parks\n6. **Ahmedabad** — ₹660/day avg · Textile & pharma\n\nTip: Use Worker Hub → Find Work → select city to see live jobs + Google Maps!",
    hi:"🏙️ **दैनिक मजदूरी के लिए सर्वश्रेष्ठ शहर:**\n1. **सूरत** — ₹750/दिन · कपड़ा & हीरा उद्योग\n2. **बेंगलुरु** — ₹720/दिन\n3. **मुंबई** — ₹700/दिन\n4. **दिल्ली** — ₹680/दिन\n5. **पुणे** — ₹650/दिन" },

  { keys:["part time job","part-time","gig","freelance","student job","earn from home"],
    en:"🎓 **Best Part-time Jobs in India:**\n\n1. 🛵 **Zomato/Swiggy Delivery** — ₹600–₹1,200/day, flexible\n2. 📚 **Online Tutor** — ₹300–₹800/hr (Vedantu, Unacademy)\n3. ⌨️ **Data Entry** — ₹12,000–₹18,000/mo, remote\n4. 📞 **BPO/Call Centre** — ₹14,000–₹22,000/mo\n5. 📦 **Amazon Warehouse** — ₹500–₹700/day\n6. 🛒 **Blinkit/Zepto Delivery** — ₹700–₹1,000/day\n7. ✍️ **Content Writing** — ₹200–₹600/article, remote\n8. 📱 **Social Media Manager** — ₹8,000–₹20,000/mo\n\nGo to **/worker** → Part-time Jobs tab to apply!",
    hi:"🎓 **बेस्ट पार्ट-टाइम नौकरियां:**\n1. 🛵 Zomato/Swiggy डिलीवरी — ₹600–₹1,200/दिन\n2. 📚 ऑनलाइन ट्यूटर — ₹300–₹800/घंटा\n3. ⌨️ डेटा एंट्री — ₹12,000–₹18,000/माह\n4. 📞 BPO/कॉल सेंटर — ₹14,000–₹22,000/माह" },

  // FINANCE
  { keys:["income prediction","predict income","how prediction works","ai prediction"],
    en:"📈 **How AI Income Prediction Works:**\n1. Add your income entries in Dashboard\n2. AI analyzes your pattern (trends, volatility)\n3. Predicts next 7 days using ML model\n4. Shows **Risk Score** (Low/Medium/High) based on income stability\n5. Generates **Investment Plan** based on predicted income\n\nThe more data you add, the more accurate predictions become!",
    hi:"📈 **AI आय भविष्यवाणी कैसे काम करती है:**\n1. डैशबोर्ड में आय दर्ज करें\n2. AI आपका पैटर्न विश्लेषण करता है\n3. अगले 7 दिन की भविष्यवाणी करता है\n4. **जोखिम स्कोर** (कम/मध्यम/उच्च) दिखाता है" },

  { keys:["risk score","what is risk","financial risk"],
    en:"⚠️ **Risk Score** tells you how stable your income is:\n\n🟢 **0–30 = Low Risk** — Income is stable, good for long-term investment\n🟡 **31–70 = Medium Risk** — Some volatility, keep 6-month emergency fund\n🔴 **71–100 = High Risk** — Very variable income, focus on savings first\n\nYour risk score considers: income volatility, savings rate, and debt ratio.",
    hi:"⚠️ **रिस्क स्कोर** आय की स्थिरता बताता है:\n🟢 **0–30 = कम जोखिम** — स्थिर आय\n🟡 **31–70 = मध्यम जोखिम** — कुछ उतार-चढ़ाव\n🔴 **71–100 = उच्च जोखिम** — बहुत अस्थिर" },

  { keys:["save money","how to save","savings tips","saving"],
    en:"💰 **How to Save Money — Simple Rules:**\n\n1. **50-30-20 Rule:** 50% needs, 30% wants, 20% savings\n2. **Pay yourself first** — transfer savings on salary day\n3. **Emergency Fund** — 6 months expenses in FD/savings\n4. **Avoid EMI trap** — never spend more than 40% of income on EMIs\n5. **Track every rupee** — use APS Dashboard to add daily income\n6. **Automate SIP** — even ₹500/month grows to ₹11L in 10 years!\n\nSmall consistent savings beat large irregular ones every time.",
    hi:"💰 **पैसे बचाने के तरीके:**\n1. **50-30-20 नियम:** 50% जरूरत, 30% इच्छा, 20% बचत\n2. **पहले खुद को भुगतान करें** — वेतन आते ही बचत करें\n3. **आपातकालीन फंड** — 6 महीने का खर्च FD में" },

  { keys:["nifty","nifty 50","sensex","bank nifty","stock market","share market","bse","nse"],
    en:"📊 **Indian Stock Market Basics:**\n\n**NIFTY 50** — Top 50 companies on NSE (National Stock Exchange). When NIFTY rises, economy is generally doing well.\n\n**SENSEX** — Top 30 companies on BSE (Bombay Stock Exchange). Oldest & most tracked Indian index.\n\n**BANK NIFTY** — Top 12 banking stocks. More volatile than NIFTY 50.\n\n💡 **For beginners:** Start with **Nifty 50 Index Fund** SIP — it tracks all 50 companies automatically, low cost, diversified!",
    hi:"📊 **भारतीय शेयर बाजार:**\n**NIFTY 50** — NSE पर शीर्ष 50 कंपनियां\n**SENSEX** — BSE पर शीर्ष 30 कंपनियां\n**BANK NIFTY** — शीर्ष 12 बैंकिंग स्टॉक\n💡 शुरुआती के लिए Nifty 50 Index Fund SIP सबसे अच्छा!" },

  { keys:["sip","systematic investment","invest monthly"],
    en:"📊 **SIP (Systematic Investment Plan):**\n- Invest fixed amount every month in mutual fund\n- Even ₹500/month → ₹11.6L in 10 years at 12%\n- ₹1,000/month → ₹23L in 10 years\n- ₹5,000/month → ₹1.16 Cr in 15 years!\n\n**How to start:** Zerodha Coin, Groww, Paytm Money, ET Money — all free, no demat needed for direct mutual funds.",
    hi:"📊 **SIP:**\n₹500/माह → 10 साल में ₹11.6 लाख (12% पर)\n₹1,000/माह → ₹23 लाख\n₹5,000/माह → 15 साल में ₹1.16 करोड़!" },

  { keys:["ppf","public provident fund","provident"],
    en:"🔐 **PPF (Public Provident Fund):**\n- Government backed, 7.1% tax-free return\n- Max ₹1.5L/year, save tax under 80C\n- Lock-in: 15 years (partial withdrawal after 7)\n- Best for: safe, guaranteed, tax-free savings\n- Open at: any bank or post office\n\nPPF + SIP combo is a classic Indian wealth-building strategy.",
    hi:"🔐 **PPF:** सरकारी बचत, 7.1% टैक्स-फ्री · Max ₹1.5L/साल · 80C टैक्स बचत · 15 साल लॉक-इन" },

  { keys:["fd","fixed deposit","bank deposit","interest rate"],
    en:"🏦 **Fixed Deposit (FD) Tips:**\n- Current rates: SBI 6.5–7%, HDFC 7–7.5%, Small Finance Banks 8–9%\n- For emergency fund: use FD with auto-renewal\n- Use **FD ladder strategy:** split into 3/6/12 month FDs\n- Interest is taxable (add to income)\n- Senior citizens get 0.5% extra\n\n💡 Tip: Use Small Finance Banks (AU, ESAF, Suryoday) for higher rates with DICGC insurance up to ₹5L.",
    hi:"🏦 **FD टिप्स:**\nSBI: 6.5–7% · HDFC: 7–7.5% · Small Finance Banks: 8–9%\nFD लैडर स्ट्रैटेजी: 3/6/12 महीने में बांटें" },

  { keys:["crypto","bitcoin","cryptocurrency","ethereum","web3"],
    en:"₿ **Crypto in India:**\n- **30% flat tax** on all crypto profits (no deductions)\n- **1% TDS** deducted on every sale\n- Losses CANNOT be set off against other income\n- Exchanges: WazirX, CoinDCX, Coinswitch (India-based)\n\n⚠️ High risk: crypto is very volatile. Only invest money you can afford to lose completely. Max 5% of portfolio recommended.",
    hi:"₿ **क्रिप्टो भारत में:**\n30% फ्लैट टैक्स · 1% TDS · नुकसान सेट-ऑफ नहीं होता\n⚠️ उच्च जोखिम: सिर्फ वही पैसा लगाएं जो खो सकते हों" },

  { keys:["gold","digital gold","gold etf","sovereign gold bond","sgb"],
    en:"🪙 **Gold Investment Options:**\n1. **Digital Gold** (Paytm/PhonePe/Groww) — buy from ₹1, no demat needed\n2. **Gold ETF** — demat needed, tracks gold price, no storage hassle\n3. **Sovereign Gold Bond (SGB)** — govt. backed, +2.5% annual interest, tax-free on maturity!\n4. **Physical Gold** — storage risk, making charges\n\n💡 Best: SGB for long-term (>8 years), Gold ETF for flexibility. Aim 10–15% of portfolio.",
    hi:"🪙 **सोने में निवेश:**\n1. डिजिटल गोल्ड (₹1 से शुरू)\n2. Gold ETF\n3. Sovereign Gold Bond — 2.5% ब्याज + टैक्स-फ्री मेच्योरिटी\n💡 लंबे समय के लिए SGB सबसे अच्छा" },

  { keys:["insurance","life insurance","health insurance","term plan","lic"],
    en:"🛡️ **Insurance Basics:**\n\n**Term Insurance** (Must have!):\n- Cover = 10–15× annual income\n- ₹1 Cr cover at age 25 costs ~₹8,000–₹10,000/year\n- Best: LIC Tech Term, HDFC Click 2 Protect\n\n**Health Insurance** (Must have!):\n- Min ₹5L family floater\n- Best: HDFC Ergo Optima, Niva Bupa\n\n❌ Avoid: LIC endowment/money-back (very low returns). Buy term + invest separately.",
    hi:"🛡️ **बीमा:**\nटर्म इंश्योरेंस: कवर = 10–15× वार्षिक आय\n₹1 करोड़ कवर 25 साल में ~₹8,000–₹10,000/साल\nस्वास्थ्य बीमा: कम से कम ₹5 लाख फैमिली फ्लोटर" },

  { keys:["ipo","initial public offering","ipo application","apply ipo"],
    en:"📋 **IPO (Initial Public Offering):**\n- Company offers shares to public for first time\n- Apply via **UPI on Zerodha/Groww/BHIM** — fast & free\n- Min investment usually ₹14,000–₹15,000 (1 lot)\n- Listed price often higher → profit on listing day\n- Not guaranteed — some IPOs list at loss\n\n💡 Check: subscription rates, GMP (grey market premium), company financials before applying.",
    hi:"📋 **IPO:**\nकंपनी पहली बार शेयर बेचती है\nZerodha/Groww/BHIM पर UPI से अप्लाई\nमिनिमम ₹14,000–₹15,000 (1 लॉट)\nलिस्टिंग पर प्रॉफिट संभव — गारंटी नहीं" },

  { keys:["dividend","dividend stock","passive income stock"],
    en:"💵 **Dividends — Passive Income from Stocks:**\n- Companies share profits with shareholders as dividend\n- Best dividend stocks: Coal India (6%+), ONGC, ITC, HDFC Bank\n- **DRIP** — reinvest dividends to buy more shares automatically\n- Dividends are taxable (added to your income)\n\n💡 Build a dividend portfolio of ₹10L → can earn ~₹40,000–₹80,000/year passively!",
    hi:"💵 **डिविडेंड:**\nCOAL India (6%+), ONGC, ITC अच्छे डिविडेंड देते हैं\n₹10L पोर्टफोलियो → ₹40,000–₹80,000/साल डिविडेंड संभव" },

  { keys:["real estate","property","rent","reits","house buy"],
    en:"🏠 **Real Estate in India:**\n- **REITs** (Real Estate Investment Trusts) — invest in commercial properties from ₹300–₹500. Listed on NSE: Embassy REIT, Mindspace REIT. Pays 7–8% annual yield.\n- **Buy vs Rent rule:** Buy if EMI < rent × 1.5. Else rent + invest the difference.\n- Home loan interest up to ₹2L deductible under Section 24b\n- Rental income taxable (30% standard deduction allowed)\n\n💡 For small investors: REITs > physical property (liquid, no maintenance)",
    hi:"🏠 **रियल एस्टेट:**\nREITs — ₹300 से कमर्शियल प्रॉपर्टी में निवेश\nEmbassy REIT, Mindspace REIT — 7–8% सालाना यील्ड" },

  { keys:["top stocks","best stocks","which stock buy","stock recommendation"],
    en:"📈 **Top Indian Stocks (Long-term):**\n\n1. **Reliance Industries** — Jio + Retail + Oil, diversified giant\n2. **TCS / Infosys / Wipro** — IT exports, dollar earnings\n3. **HDFC Bank / ICICI Bank** — Largest private banks\n4. **Bajaj Finance** — NBFC, strong growth\n5. **Asian Paints** — Consumer brand, consistent compounder\n6. **Titan Company** — Jewellery + watches\n7. **Adani Ports** — Infrastructure play\n\n⚠️ Not financial advice. Always research before investing. Diversify!",
    hi:"📈 **टॉप भारतीय स्टॉक्स:**\n1. Reliance, 2. TCS/Infosys, 3. HDFC Bank\n4. Bajaj Finance, 5. Asian Paints\n⚠️ यह फाइनेंशियल सलाह नहीं है। निवेश से पहले शोध करें।" },

  { keys:["tax","income tax","itr","80c","tax saving"],
    en:"🧾 **Income Tax Tips:**\n- **Section 80C** (₹1.5L limit): PPF, ELSS, EPF, LIC premium, home loan principal\n- **Section 80D**: Health insurance premium (₹25,000 + ₹25,000 parents)\n- **NPS (80CCD)**: Extra ₹50,000 deduction\n- New tax regime: lower rates but no deductions\n- Old regime: higher rates but many deductions\n\n💡 If you have HRA + 80C + 80D → Old regime usually better. File ITR every year even if income is below taxable limit!",
    hi:"🧾 **आयकर टिप्स:**\n80C: ₹1.5L (PPF, ELSS, EPF, LIC, होम लोन)\n80D: स्वास्थ्य बीमा ₹25,000\nNPS: अतिरिक्त ₹50,000\n💡 HRA + 80C है तो पुरानी व्यवस्था बेहतर" },

  { keys:["budget","monthly budget","expense","spending"],
    en:"📋 **Monthly Budget Template:**\n\n**50% Needs:** Rent, food, transport, utilities\n**30% Wants:** Entertainment, dining, shopping\n**20% Savings:** SIP, FD, PPF, emergency fund\n\nExample for ₹25,000 salary:\n- Rent: ₹6,000 | Food: ₹3,000 | Transport: ₹2,000\n- Mobile/Internet: ₹500 | Misc: ₹1,000\n- Savings: ₹5,000 (SIP ₹2K + FD ₹2K + Emergency ₹1K)\n\nUse APS Dashboard to track income → it auto-calculates savings rate!",
    hi:"📋 **मासिक बजट:**\n50% जरूरत: किराया, खाना, यातायात\n30% इच्छाएं: मनोरंजन, शॉपिंग\n20% बचत: SIP, FD, PPF\n₹25,000 वेतन उदाहरण: किराया ₹6,000 | खाना ₹3,000 | बचत ₹5,000" },

  { keys:["hello","hi","hey","namaste","नमस्ते","வணக்கம்","నమస్కారం"],
    en:"👋 **Hello! I'm APS AI Assistant.**\n\nI can help you with:\n- 📊 Financial questions (SIP, stocks, tax, savings)\n- 💼 Job search & posting\n- 👷 Daily wage guidance & city suggestions\n- 🏠 Platform help (how to use APS AI)\n\nWhat would you like to know?",
    hi:"👋 **नमस्ते! मैं APS AI सहायक हूं।**\nमैं इनमें मदद कर सकता हूं:\n📊 वित्त (SIP, शेयर, टैक्स, बचत)\n💼 नौकरी खोजना और पोस्ट करना\n👷 दैनिक मजदूरी मार्गदर्शन\nआप क्या जानना चाहते हैं?" },

  { keys:["thank","thanks","thank you","धन्यवाद","நன்றி","ధన్యవాదాలు"],
    en:"😊 You're welcome! Feel free to ask anything else.\n\nRemember:\n- 📊 **Dashboard** for AI predictions\n- 💼 **/jobs** for job board\n- 👷 **/worker** for wage tracker\n- 🤖 I'm always here to help!",
    hi:"😊 आपका स्वागत है! कुछ और पूछना हो तो बताएं।" },

  { keys:["language","change language","tamil","telugu","hindi","kannada","marathi","bengali"],
    en:"🌍 **APS AI supports 7 Indian languages:**\n1. English\n2. हिंदी (Hindi)\n3. தமிழ் (Tamil)\n4. తెలుగు (Telugu)\n5. ಕನ್ನಡ (Kannada)\n6. मराठी (Marathi)\n7. বাংলা (Bengali)\n\nThe **Job Board (/jobs)** lets you switch language from the navbar. The Dashboard language can be changed from your profile settings.",
    hi:"🌍 **7 भाषाओं में उपलब्ध:**\nहिंदी, तमिल, तेलुगु, कन्नड़, मराठी, बांग्ला, अंग्रेजी\nजॉब बोर्ड में ऊपर से भाषा बदलें" },
];

const SUGGESTIONS = [
  "What is this platform?","How to post a job?","Best city for work?",
  "How does income prediction work?","Part-time jobs for students",
  "How to save money?","What is SIP?","Top stocks in India",
  "What is NIFTY 50?","How to apply for IPO?","Tax saving tips",
  "How to use Worker Hub?",
];

const LANG_LABELS = { en:"EN",hi:"HI",te:"TE",ta:"TA",kn:"KN",mr:"MR" };
const LANGS = Object.keys(LANG_LABELS);

function findAnswer(query, lang) {
  const q = query.toLowerCase();
  for (const item of KB) {
    if (item.keys.some(k => q.includes(k.toLowerCase()))) {
      return item[lang] || item.en;
    }
  }
  return null;
}

function RichMsg({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div style={{ lineHeight: 1.65, fontSize: "0.92rem" }}>
      {text.split("\n").map((line, li) => (
        <div key={li} style={{ marginBottom: line ? "0.2rem" : "0.4rem" }}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={pi} style={{ color: "#fbbf24", fontWeight: 800 }}>{part.slice(2, -2)}</strong>
              : <span key={pi}>{part}</span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [lang, setLang] = useState(() => localStorage.getItem("aps_lang") || "en");
  const [messages, setMessages] = useState([
    { role: "bot", text: KB.find(k => k.keys.includes("hello"))?.[localStorage.getItem("aps_lang") || "en"] || KB.find(k => k.keys.includes("hello"))?.en }
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text = input.trim()) => {
    if (!text || thinking) return;
    const userMsg = { role: "user", text };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const answer = findAnswer(text, lang);
      const botText = answer ||
        `🔍 I don't have specific info on **"${text}"** yet.\n\nTry asking about:\n- SIP, PPF, mutual funds, stocks\n- How to post/find jobs\n- Daily wage & city suggestions\n- Tax saving, budgeting\n- Platform features\n\nOr visit our sections: [Job Board](/jobs) · [Worker Hub](/worker) · [Dashboard](/dashboard)`;
      setMessages(m => [...m, { role: "bot", text: botText }]);
      setThinking(false);
    }, 700 + Math.random() * 600);
  };

  return (
    <div style={{ background: "linear-gradient(135deg,#050210 0%,#0d0b1e 50%,#060e1c 100%)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Ambient */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, background: "radial-gradient(circle,rgba(6,182,212,0.1) 0%,transparent 70%)", borderRadius: "50%", top: "5%", right: "-5%", animation: "blobMorph 12s ease-in-out infinite" }} />
        <div style={{ position: "absolute", width: 400, height: 400, background: "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)", borderRadius: "50%", bottom: "10%", left: "-5%", animation: "blobMorph 18s ease-in-out infinite reverse" }} />
      </div>

      {/* Navbar */}
      <nav style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1.5rem", position: "sticky", top: 0, zIndex: 100, flexShrink: 0 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", height: 60, display: "flex", alignItems: "center", gap: "1rem" }}>
          <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "0.85rem" }}>← Home</button>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "1.5rem" }}>🤖</span>
            <div>
              <div style={{ fontWeight: 900, color: "#fff", fontSize: "1rem" }}>APS AI Assistant</div>
              <div style={{ color: "#10b981", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.3rem" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", animation: "liveBlink 1.2s ease-in-out infinite" }} />
                Pre-trained · 50+ topics · 7 languages
              </div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "0.3rem" }}>
            {LANGS.map(l => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem("aps_lang", l); }} style={{ padding: "0.3rem 0.6rem", borderRadius: "0.5rem", border: "none", background: lang === l ? "linear-gradient(90deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.06)", color: lang === l ? "#fff" : "rgba(255,255,255,0.4)", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}>
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <div style={{ flex: 1, maxWidth: 900, width: "100%", margin: "0 auto", padding: "1.5rem", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>

        {/* Topic shortcuts */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          {SUGGESTIONS.slice(0, 8).map(s => (
            <button key={s} onClick={() => send(s)} style={{ background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: "999px", padding: "0.3rem 0.875rem", color: "rgba(6,182,212,0.8)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{s}</button>
          ))}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.25rem", paddingBottom: "1rem" }}>
          {messages.map((m, i) => (
            <div key={i} className="animate-slideUp" style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "0.75rem", alignItems: "flex-start" }}>
              {m.role === "bot" && (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🤖</div>
              )}
              <div style={{
                maxWidth: "80%", padding: "1rem 1.25rem", borderRadius: m.role === "user" ? "1.25rem 1.25rem 0.25rem 1.25rem" : "1.25rem 1.25rem 1.25rem 0.25rem",
                background: m.role === "user" ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(255,255,255,0.06)",
                border: m.role === "user" ? "none" : "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
              }}>
                {m.role === "bot" ? <RichMsg text={m.text} /> : <div style={{ fontSize: "0.92rem" }}>{m.text}</div>}
              </div>
              {m.role === "user" && (
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>👤</div>
              )}
            </div>
          ))}

          {thinking && (
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#06b6d4,#0891b2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem" }}>🤖</div>
              <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.25rem", padding: "1rem 1.25rem", display: "flex", gap: "0.4rem", alignItems: "center" }}>
                {[0,1,2].map(d => <span key={d} style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4", animation: `pulse 1.2s ease-in-out ${d * 0.2}s infinite` }} />)}
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginLeft: "0.3rem" }}>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* More suggestions */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          {SUGGESTIONS.slice(8).map(s => (
            <button key={s} onClick={() => send(s)} style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", padding: "0.25rem 0.75rem", color: "rgba(165,180,252,0.7)", fontSize: "0.75rem", cursor: "pointer" }}>{s}</button>
          ))}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: "0.75rem", background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1.25rem", padding: "0.75rem 1rem", position: "sticky", bottom: 0 }}>
          <input
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about jobs, finance, wages, platform features..."
            style={{ flex: 1, background: "none", border: "none", color: "#fff", fontSize: "0.95rem", outline: "none" }}
          />
          <button onClick={() => send()} disabled={!input.trim() || thinking} style={{
            background: input.trim() && !thinking ? "linear-gradient(90deg,#06b6d4,#0891b2)" : "rgba(255,255,255,0.08)",
            border: "none", borderRadius: "0.875rem", padding: "0.6rem 1.25rem",
            color: input.trim() && !thinking ? "#fff" : "rgba(255,255,255,0.3)",
            fontWeight: 700, fontSize: "0.88rem", cursor: input.trim() && !thinking ? "pointer" : "not-allowed",
            transition: "all 0.2s",
          }}>
            Send ↑
          </button>
        </div>
      </div>
    </div>
  );
}
