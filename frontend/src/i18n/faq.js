/* ═══════════════════════════════════════════════════════
   AI Financial Chatbot — FAQ knowledge base
   Keyword-matched responses in 7 Indian languages
═══════════════════════════════════════════════════════ */

const FAQ = [
  {
    keys: ["sip", "systematic", "investment plan"],
    answer: {
      en: "📊 **SIP (Systematic Investment Plan)** lets you invest a fixed amount every month in a mutual fund. Even ₹500/month can grow to ₹11.6L in 10 years at 12% return. Start small, be consistent!",
      hi: "📊 **SIP** में हर महीने एक तय राशि म्यूचुअल फंड में निवेश होती है। सिर्फ ₹500/माह से 10 साल में 12% रिटर्न पर ₹11.6 लाख बन सकते हैं। छोटे शुरू करें, नियमित रहें!",
      ta: "📊 **SIP** மூலம் ஒவ்வொரு மாதமும் ஒரு நிலையான தொகையை மியூச்சுவல் ஃபண்டில் முதலிடலாம். ₹500/மாதம் 10 ஆண்டுகளில் ₹11.6 லட்சமாக வளரும்!",
      te: "📊 **SIP** లో ప్రతి నెల నిర్ణీత మొత్తం మ్యూచువల్ ఫండ్‌లో పెట్టుబడి పెడతారు. ₹500/నెల 10 సంవత్సరాల్లో 12% రాబడితో ₹11.6 లక్షలు అవుతుంది!",
      kn: "📊 **SIP** ನಲ್ಲಿ ಪ್ರತಿ ತಿಂಗಳು ನಿಗದಿತ ಮೊತ್ತ ಮ್ಯೂಚುಯಲ್ ಫಂಡ್‌ಗೆ ಹೂಡಿಕೆ ಮಾಡಲಾಗುತ್ತದೆ. ₹500/ತಿಂಗಳು 10 ವರ್ಷದಲ್ಲಿ ₹11.6 ಲಕ್ಷ ಆಗಬಹುದು!",
      bn: "📊 **SIP** হলো প্রতি মাসে নির্দিষ্ট পরিমাণ মিউচুয়াল ফান্ডে বিনিয়োগ। ₹500/মাস 10 বছরে 12% রিটার্নে ₹11.6 লাখ হতে পারে!",
      mr: "📊 **SIP** मध्ये दर महिन्याला ठराविक रक्कम म्युच्युअल फंडमध्ये गुंतवली जाते. ₹500/महिना 10 वर्षांत 12% परताव्यावर ₹11.6 लाख होऊ शकतात!",
    },
  },
  {
    keys: ["ppf", "public provident", "provident fund"],
    answer: {
      en: "🔐 **PPF (Public Provident Fund)** is a government-backed savings scheme with 7.1% tax-free returns. You can invest up to ₹1.5L/year and save taxes under Section 80C. Lock-in period: 15 years.",
      hi: "🔐 **PPF** सरकारी बचत योजना है जिसमें 7.1% टैक्स-फ्री रिटर्न मिलता है। सालाना ₹1.5 लाख तक जमा कर 80C के तहत टैक्स बचा सकते हैं। लॉक-इन: 15 साल।",
      ta: "🔐 **PPF** அரசு ஆதரவு சேமிப்பு திட்டம், 7.1% வரி இல்லாத வருமானம். ஆண்டுக்கு ₹1.5 லட்சம் வரை முதலிட்டு 80C இல் வரி சேமிக்கலாம்.",
      te: "🔐 **PPF** ప్రభుత్వ పొదుపు పథకం, 7.1% పన్ను రహిత రాబడి. సంవత్సరానికి ₹1.5 లక్షల వరకు పెట్టుబడి పెట్టి 80C కింద పన్ను ఆదా చేయవచ్చు.",
      kn: "🔐 **PPF** ಸರ್ಕಾರ ಬೆಂಬಲಿತ ಉಳಿತಾಯ ಯೋಜನೆ, 7.1% ತೆರಿಗೆ ಮುಕ್ತ ರಿಟರ್ನ್. ವರ್ಷಕ್ಕೆ ₹1.5 ಲಕ್ಷ ಹೂಡಿ 80C ಅಡಿ ತೆರಿಗೆ ಉಳಿಸಬಹುದು.",
      bn: "🔐 **PPF** সরকার সমর্থিত সঞ্চয় প্রকল্প, 7.1% করমুক্ত রিটার্ন। বার্ষিক ₹1.5 লাখ বিনিয়োগ করে 80C-এ কর বাঁচানো যায়।",
      mr: "🔐 **PPF** हे सरकारी बचत योजना आहे, 7.1% करमुक्त परतावा. वार्षिक ₹1.5 लाख गुंतवून 80C अंतर्गत कर वाचवता येतो.",
    },
  },
  {
    keys: ["mutual fund", "mutual funds", "म्यूचुअल", "மியூச்சுவல்"],
    answer: {
      en: "📈 **Mutual Funds** pool money from many investors to buy stocks/bonds. Types: Equity (high return, high risk), Debt (stable, low risk), Hybrid (balanced). Start with Nifty 50 Index Fund for beginners!",
      hi: "📈 **म्यूचुअल फंड** में कई निवेशकों का पैसा मिलाकर शेयर/बॉन्ड खरीदे जाते हैं। शुरुआती लोगों के लिए Nifty 50 इंडेक्स फंड बेस्ट है!",
      ta: "📈 **மியூச்சுவல் ஃபண்டில்** பலரின் பணம் திரட்டி பங்குகள் வாங்கப்படும். புதியவர்களுக்கு Nifty 50 Index Fund சிறந்தது!",
      te: "📈 **మ్యూచువల్ ఫండ్**లో చాలా మంది పెట్టుబడిదారుల డబ్బు కలిసి స్టాక్స్/బాండ్లు కొనుగోలు చేస్తారు. ప్రారంభకులకు Nifty 50 Index Fund ఉత్తమం!",
      kn: "📈 **ಮ್ಯೂಚುಯಲ್ ಫಂಡ್**ನಲ್ಲಿ ಅನೇಕ ಹೂಡಿಕೆದಾರರ ಹಣ ಸೇರಿಸಿ ಷೇರು/ಬಾಂಡ್ ಕೊಳ್ಳಲಾಗುತ್ತದೆ. ಹೊಸಬರಿಗೆ Nifty 50 Index Fund ಉತ್ತಮ!",
      bn: "📈 **মিউচুয়াল ফান্ডে** অনেক বিনিয়োগকারীর অর্থ একত্রিত করে স্টক/বন্ড কেনা হয়। নতুনদের জন্য Nifty 50 Index Fund সেরা!",
      mr: "📈 **म्युच्युअल फंडात** अनेक गुंतवणूकदारांचे पैसे एकत्र करून शेअर्स/बॉन्ड्स खरेदी केले जातात. नवशिक्यांसाठी Nifty 50 Index Fund सर्वोत्तम!",
    },
  },
  {
    keys: ["gold", "सोना", "தங்கம்", "బంగారం", "ಚಿನ್ನ", "সোনা"],
    answer: {
      en: "🪙 **Gold** is a great inflation hedge. Options: Digital Gold (Paytm/PhonePe, min ₹1), Gold ETF (Demat account), Sovereign Gold Bond (govt. backed, 2.5% extra interest). Aim for 10–20% of portfolio.",
      hi: "🪙 **सोना** महंगाई से बचाता है। विकल्प: डिजिटल गोल्ड (Paytm/PhonePe, न्यूनतम ₹1), गोल्ड ETF, सॉवरेन गोल्ड बॉन्ड (2.5% ब्याज)। पोर्टफोलियो का 10-20% रखें।",
      ta: "🪙 **தங்கம்** பணவீக்கத்திலிருந்து பாதுகாக்கும். டிஜிட்டல் தங்கம் (Paytm/PhonePe), Gold ETF, Sovereign Gold Bond ஆகியவை சிறந்த வழிகள்.",
      te: "🪙 **బంగారం** ద్రవ్యోల్బణానికి మంచి రక్షణ. డిజిటల్ గోల్డ్ (Paytm/PhonePe), Gold ETF, Sovereign Gold Bond మంచి ఎంపికలు.",
      kn: "🪙 **ಚಿನ್ನ** ಹಣದುಬ್ಬರದಿಂದ ರಕ್ಷಿಸುತ್ತದೆ. ಡಿಜಿಟಲ್ ಗೋಲ್ಡ್, Gold ETF, Sovereign Gold Bond ಉತ್ತಮ ಆಯ್ಕೆಗಳು.",
      bn: "🪙 **সোনা** মুদ্রাস্ফীতির বিরুদ্ধে ভালো সুরক্ষা। ডিজিটাল গোল্ড, Gold ETF, Sovereign Gold Bond ভালো বিকল্প।",
      mr: "🪙 **सोने** महागाईपासून संरक्षण देते. डिजिटल गोल्ड, Gold ETF, Sovereign Gold Bond चांगले पर्याय आहेत.",
    },
  },
  {
    keys: ["emergency fund", "emergency", "आपातकाल", "அவசர", "అత్యవసర"],
    answer: {
      en: "🏦 **Emergency Fund** = 6 months of your expenses kept in a savings account or FD. If you spend ₹15,000/month, target ₹90,000. Build it before investing anywhere else. This is your safety net!",
      hi: "🏦 **इमरजेंसी फंड** = 6 महीने के खर्च बचत खाते में। अगर खर्च ₹15,000/माह है, लक्ष्य ₹90,000। कहीं भी निवेश से पहले यह बनाएं। यह आपकी सुरक्षा है!",
      ta: "🏦 **அவசர நிதி** = 6 மாத செலவுகளை சேமிப்பு கணக்கில் வைக்கவும். இது முதலீட்டிற்கு முன் கட்டாயம் செய்ய வேண்டும்!",
      te: "🏦 **అత్యవసర నిధి** = 6 నెలల ఖర్చులు సేవింగ్స్ అకౌంట్‌లో ఉంచండి. పెట్టుబడి పెట్టే ముందు ఇది తప్పనిసరి!",
      kn: "🏦 **ಅత್ಯವಸರ ನಿಧಿ** = 6 ತಿಂಗಳ ಖರ್ಚು ಉಳಿತಾಯ ಖಾತೆಯಲ್ಲಿ ಇಡಿ. ಹೂಡಿಕೆಗಿಂತ ಮೊದಲು ಇದನ್ನು ಮಾಡಿ!",
      bn: "🏦 **ইমার্জেন্সি ফান্ড** = 6 মাসের খরচ সঞ্চয় অ্যাকাউন্টে রাখুন। যেকোনো বিনিয়োগের আগে এটি তৈরি করুন!",
      mr: "🏦 **आपत्कालीन निधी** = 6 महिन्यांचा खर्च बचत खात्यात ठेवा. गुंतवणूकीपूर्वी हे तयार करणे आवश्यक!",
    },
  },
  {
    keys: ["save", "saving", "savings", "बचत", "சேமிப்பு", "పొదుపు", "ಉಳಿತಾಯ", "সঞ্চয়", "बचत"],
    answer: {
      en: "💰 **Golden Rule of Savings:** Save 30% of every income the moment you earn it. Formula: Income - Savings = Expenses (not Income - Expenses = Savings). Automate your savings on salary day!",
      hi: "💰 **बचत का सुनहरा नियम:** आमदनी आते ही 30% बचा लें। फॉर्मूला: आमदनी - बचत = खर्च (न कि आमदनी - खर्च = बचत)। सैलरी के दिन ऑटो-ट्रांसफर करें!",
      ta: "💰 **சேமிப்பின் தங்க விதி:** வருமானம் வந்தவுடன் 30% சேமிக்கவும். சூத்திரம்: வருமானம் - சேமிப்பு = செலவு. சம்பள நாளில் தானாக பரிமாற்றம் செய்யுங்கள்!",
      te: "💰 **పొదుపు సువర్ణ నియమం:** ఆదాయం వచ్చిన వెంటనే 30% పొదుపు చేయండి. సూత్రం: ఆదాయం - పొదుపు = ఖర్చు. జీతం రోజే ఆటో-ట్రాన్స్‌ఫర్ చేయండి!",
      kn: "💰 **ಉಳಿತಾಯದ ಚಿನ್ನದ ನಿಯಮ:** ಆದಾಯ ಬಂದ ತಕ್ಷಣ 30% ಉಳಿಸಿ. ಸೂತ್ರ: ಆದಾಯ - ಉಳಿತಾಯ = ಖರ್ಚು. ಸಂಬಳ ದಿನವೇ ಆಟೋ-ಟ್ರಾನ್ಸ್‌ಫರ್ ಮಾಡಿ!",
      bn: "💰 **সঞ্চয়ের স্বর্ণ নিয়ম:** আয় পাওয়ার সাথে সাথে 30% সঞ্চয় করুন। সূত্র: আয় - সঞ্চয় = খরচ। বেতনের দিনই অটো-ট্রান্সফার করুন!",
      mr: "💰 **बचतीचा सोनेरी नियम:** उत्पन्न मिळताच 30% बचत करा. सूत्र: उत्पन्न - बचत = खर्च. पगाराच्या दिवशीच ऑटो-ट्रान्सफर करा!",
    },
  },
  {
    keys: ["stock", "share", "equity", "शेयर", "பங்கு", "స్టాక్", "ಷೇರು", "শেয়ার"],
    answer: {
      en: "📈 **Stocks** = owning a small part of a company. High risk, high reward. For beginners: 1) Open Demat account (Zerodha/Groww). 2) Start with Nifty 50 ETF — don't pick individual stocks first. 3) Invest only money you won't need for 5+ years.",
      hi: "📈 **शेयर** = किसी कंपनी में हिस्सेदारी। उच्च जोखिम, उच्च मुनाफा। शुरुआती: 1) Zerodha/Groww में डीमैट खोलें। 2) Nifty 50 ETF से शुरू करें। 3) सिर्फ वो पैसा लगाएं जो 5+ साल चाहिए न हो।",
      ta: "📈 **பங்குகள்** = நிறுவனத்தின் சிறு பகுதியை வாங்குவது. ஆரம்பிக்க: Zerodha/Groww இல் Demat திறந்து, Nifty 50 ETF வாங்குங்கள்.",
      te: "📈 **స్టాక్స్** = కంపెనీలో చిన్న వాటా. ప్రారంభకులు: Zerodha/Groww లో డీమ్యాట్ తెరవండి, Nifty 50 ETF తో మొదలు పెట్టండి.",
      kn: "📈 **ಷೇರುಗಳು** = ಕಂಪನಿಯ ಸಣ್ಣ ಭಾಗ. ಹೊಸಬರು: Zerodha/Groww ನಲ್ಲಿ Demat ತೆರೆಯಿರಿ, Nifty 50 ETF ನಿಂದ ಆರಂಭಿಸಿ.",
      bn: "📈 **শেয়ার** = কোম্পানির ছোট অংশের মালিকানা। শুরু করুন: Zerodha/Groww-এ Demat খুলুন, Nifty 50 ETF দিয়ে শুরু করুন।",
      mr: "📈 **शेअर्स** = कंपनीतील छोटी मालकी. सुरुवात: Zerodha/Groww मध्ये Demat उघडा, Nifty 50 ETF ने सुरुवात करा.",
    },
  },
  {
    keys: ["insurance", "term", "health", "बीमा", "காப்பீடு", "బీమా", "ವಿಮೆ", "বীমা"],
    answer: {
      en: "🛡️ **Insurance First!** Before investing, get: 1) **Term Insurance** — ₹1 Crore cover for ~₹500/month (age 25). 2) **Health Insurance** — ₹5L cover for ~₹700/month. These protect your family if something happens to you.",
      hi: "🛡️ **पहले बीमा!** निवेश से पहले: 1) **टर्म बीमा** — ₹1 करोड़ कवर ~₹500/माह (25 साल पर)। 2) **स्वास्थ्य बीमा** — ₹5 लाख कवर ~₹700/माह। यह आपके परिवार की सुरक्षा है।",
      ta: "🛡️ **முதலில் காப்பீடு!** 1) **டெர்ம் இன்சூரன்ஸ்** — ₹1 கோடி கவரேஜ் ~₹500/மாதம். 2) **ஹெல்த் இன்சூரன்ஸ்** — ₹5 லட்சம் கவரேஜ் ~₹700/மாதம்.",
      te: "🛡️ **ముందు బీమా!** 1) **టర్మ్ ఇన్సూరెన్స్** — ₹1 కోటి కవరేజ్ ~₹500/నెల. 2) **హెల్త్ ఇన్సూరెన్స్** — ₹5 లక్షలు ~₹700/నెల.",
      kn: "🛡️ **ಮೊದಲು ವಿಮೆ!** 1) **ಟರ್ಮ್ ಇನ್ಶೂರೆನ್ಸ್** — ₹1 ಕೋಟಿ ಕವರೇಜ್ ~₹500/ತಿಂಗಳು. 2) **ಹೆಲ್ತ್ ಇನ್ಶೂರೆನ್ಸ್** — ₹5 ಲಕ್ಷ ~₹700/ತಿಂಗಳು.",
      bn: "🛡️ **প্রথমে বীমা!** 1) **টার্ম ইন্স্যুরেন্স** — ₹1 কোটি কভারেজ ~₹500/মাস। 2) **হেলথ ইন্স্যুরেন্স** — ₹5 লাখ ~₹700/মাস।",
      mr: "🛡️ **प्रथम विमा!** 1) **टर्म इन्शुरन्स** — ₹1 कोटी कव्हरेज ~₹500/महिना. 2) **हेल्थ इन्शुरन्स** — ₹5 लाख ~₹700/महिना.",
    },
  },
  {
    keys: ["fd", "fixed deposit", "fixed", "फिक्स्ड", "நிலையான வைப்பு"],
    answer: {
      en: "🏦 **Fixed Deposit (FD)** is the safest investment. Returns: 6–7.5% per year. Interest is taxable. Best for: Emergency fund, short-term goals (1–3 years). Use FDs for money you might need soon.",
      hi: "🏦 **FD (फिक्स्ड डिपॉजिट)** सबसे सुरक्षित निवेश है। रिटर्न: 6–7.5%/साल। ब्याज पर टैक्स लगता है। बेस्ट: इमरजेंसी फंड, 1–3 साल के लक्ष्य।",
      ta: "🏦 **FD** மிகவும் பாதுகாப்பான முதலீடு. வருமானம்: 6–7.5%/ஆண்டு. அவசர நிதிக்கும் குறுகிய கால இலக்குகளுக்கும் ஏற்றது.",
      te: "🏦 **FD** అత్యంత సురక్షితమైన పెట్టుబడి. రాబడి: 6–7.5%/సంవత్సరం. అత్యవసర నిధికి మరియు 1–3 సంవత్సరాల లక్ష్యాలకు ఉత్తమం.",
      kn: "🏦 **FD** ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಹೂಡಿಕೆ. ರಿಟರ್ನ್: 6–7.5%/ವರ್ಷ. ತುರ್ತು ನಿಧಿಗೆ ಮತ್ತು 1–3 ವರ್ಷದ ಗುರಿಗೆ ಉತ್ತಮ.",
      bn: "🏦 **FD** সবচেয়ে নিরাপদ বিনিয়োগ। রিটার্ন: 6–7.5%/বছর। ইমার্জেন্সি ফান্ড ও 1–3 বছরের লক্ষ্যের জন্য সেরা।",
      mr: "🏦 **FD** सर्वात सुरक्षित गुंतवणूक. परतावा: 6–7.5%/वर्ष. आपत्कालीन निधी आणि 1–3 वर्षांच्या ध्येयांसाठी उत्तम.",
    },
  },
  {
    keys: ["daily wage", "daily worker", "labour", "मजदूर", "கூலி", "కూలీ", "ಕಾರ್ಮಿಕ"],
    answer: {
      en: "👷 **For Daily Wage Workers:** 1) Save ₹50–100 daily in a jar/Paytm wallet. 2) Open Jan Dhan account (zero balance). 3) Start ₹100/month SIP in Post Office RD. 4) Get PM Jeevan Jyoti Bima (₹436/year for ₹2L cover). 5) PMJDY accident insurance is free!",
      hi: "👷 **दैनिक मजदूरों के लिए:** 1) रोज ₹50–100 बचाएं। 2) जन धन खाता खोलें (जीरो बैलेंस)। 3) पोस्ट ऑफिस RD में ₹100/माह। 4) PM जीवन ज्योति बीमा (₹436/साल में ₹2 लाख)।",
      ta: "👷 **தினசரி கூலி தொழிலாளர்களுக்கு:** 1) தினமும் ₹50–100 சேமிக்கவும். 2) Jan Dhan கணக்கு திறக்கவும். 3) தபால் அலுவலக RD ₹100/மாதம். 4) PM Jeevan Jyoti Bima - ₹436/வருடம்.",
      te: "👷 **రోజువారీ కూలీ కార్మికులకు:** 1) రోజూ ₹50–100 ఆదా చేయండి. 2) Jan Dhan ఖాతా తెరవండి. 3) Post Office RD ₹100/నెల. 4) PM Jeevan Jyoti Bima - ₹436/సంవత్సరం.",
      kn: "👷 **ದಿನಗೂಲಿ ಕಾರ್ಮಿಕರಿಗೆ:** 1) ದಿನ ₹50–100 ಉಳಿಸಿ. 2) Jan Dhan ಖಾತೆ ತೆರೆಯಿರಿ. 3) ಅಂಚೆ ಕಚೇರಿ RD ₹100/ತಿಂಗಳು. 4) PM Jeevan Jyoti Bima - ₹436/ವರ್ಷ.",
      bn: "👷 **দৈনিক মজুরদের জন্য:** 1) প্রতিদিন ₹50–100 সঞ্চয় করুন। 2) Jan Dhan অ্যাকাউন্ট খুলুন। 3) পোস্ট অফিস RD ₹100/মাস। 4) PM Jeevan Jyoti Bima - ₹436/বছর।",
      mr: "👷 **दैनिक मजुरांसाठी:** 1) रोज ₹50–100 बचत करा. 2) Jan Dhan खाते उघडा. 3) पोस्ट ऑफिस RD ₹100/महिना. 4) PM Jeevan Jyoti Bima - ₹436/वर्ष.",
    },
  },
  {
    keys: ["invest", "investment", "where invest", "कहाँ निवेश", "எங்கே முதலிட"],
    answer: {
      en: "🎯 **Where to Invest? (Priority Order)**\n1. 🏦 Emergency Fund (6 months expenses)\n2. 🛡️ Term + Health Insurance\n3. 🔐 PPF (tax saving, ₹500/month)\n4. 📊 SIP in Index Fund (₹500+/month)\n5. 🪙 Digital Gold (₹100+/month)\n6. 📈 Stocks/ETF (only after above)",
      hi: "🎯 **कहाँ निवेश करें? (प्राथमिकता)**\n1. 🏦 इमरजेंसी फंड\n2. 🛡️ टर्म + स्वास्थ्य बीमा\n3. 🔐 PPF\n4. 📊 इंडेक्स फंड SIP\n5. 🪙 डिजिटल गोल्ड\n6. 📈 शेयर (ऊपर के बाद)",
      ta: "🎯 **எங்கே முதலிட? (முன்னுரிமை)**\n1. 🏦 அவசர நிதி\n2. 🛡️ காப்பீடு\n3. 🔐 PPF\n4. 📊 Index Fund SIP\n5. 🪙 Digital Gold\n6. 📈 பங்குகள்",
      te: "🎯 **ఎక్కడ పెట్టుబడి? (ప్రాధాన్యత)**\n1. 🏦 అత్యవసర నిధి\n2. 🛡️ బీమా\n3. 🔐 PPF\n4. 📊 Index Fund SIP\n5. 🪙 డిజిటల్ గోల్డ్\n6. 📈 స్టాక్స్",
      kn: "🎯 **ಎಲ್ಲಿ ಹೂಡಿಕೆ? (ಆದ್ಯತೆ)**\n1. 🏦 ತುರ್ತು ನಿಧಿ\n2. 🛡️ ವಿಮೆ\n3. 🔐 PPF\n4. 📊 Index Fund SIP\n5. 🪙 ಡಿಜಿಟಲ್ ಗೋಲ್ಡ್\n6. 📈 ಷೇರುಗಳು",
      bn: "🎯 **কোথায় বিনিয়োগ? (অগ্রাধিকার)**\n1. 🏦 ইমার্জেন্সি ফান্ড\n2. 🛡️ বীমা\n3. 🔐 PPF\n4. 📊 Index Fund SIP\n5. 🪙 Digital Gold\n6. 📈 শেয়ার",
      mr: "🎯 **कुठे गुंतवणूक? (प्राधान्य)**\n1. 🏦 आपत्कालीन निधी\n2. 🛡️ विमा\n3. 🔐 PPF\n4. 📊 Index Fund SIP\n5. 🪙 Digital Gold\n6. 📈 शेअर्स",
    },
  },
  {
    keys: ["fire", "retire", "retirement", "रिटायर", "ஓய்வு"],
    answer: {
      en: "🔥 **FIRE (Financial Independence, Retire Early):** Save 25× your annual expenses. If you spend ₹20,000/month (₹2.4L/year), target = ₹60L corpus. Invest in index funds for 15–20 years. The 4% withdrawal rule keeps it forever!",
      hi: "🔥 **FIRE:** सालाना खर्च का 25 गुना बचाएं। ₹20,000/माह खर्च = ₹2.4L/साल → टार्गेट ₹60 लाख। इंडेक्स फंड में 15–20 साल निवेश करें।",
      ta: "🔥 **FIRE:** வருடாந்திர செலவின் 25 மடங்கு சேமிக்கவும். ₹20,000/மாதம் செலவு = ₹60 லட்சம் இலக்கு.",
      te: "🔥 **FIRE:** వార్షిక ఖర్చుల 25 రెట్లు పొదుపు చేయండి. ₹20,000/నెల ఖర్చు = ₹60 లక్షలు లక్ష్యం.",
      kn: "🔥 **FIRE:** ವಾರ್ಷಿಕ ಖರ್ಚಿನ 25 ಪಟ್ಟು ಉಳಿಸಿ. ₹20,000/ತಿಂಗಳು ಖರ್ಚು = ₹60 ಲಕ್ಷ ಗುರಿ.",
      bn: "🔥 **FIRE:** বার্ষিক খরচের 25 গুণ সঞ্চয় করুন। ₹20,000/মাস খরচ = ₹60 লাখ লক্ষ্য।",
      mr: "🔥 **FIRE:** वार्षिक खर्चाच्या 25 पट बचत करा. ₹20,000/महिना खर्च = ₹60 लाख लक्ष्य.",
    },
  },
  {
    keys: ["tax", "80c", "income tax", "टैक्स", "வரி", "పన్ను", "ತೆರಿಗೆ", "কর"],
    answer: {
      en: "📋 **Tax Saving (80C):** You can save up to ₹1.5L/year by investing in: PPF, ELSS Mutual Funds, NSC, EPF, LIC, Home Loan Principal. ELSS gives best returns (12–15%) + tax saving. Invest by March 31st every year!",
      hi: "📋 **80C टैक्स बचत:** PPF, ELSS, NSC, EPF, LIC में ₹1.5 लाख/साल तक निवेश कर टैक्स बचाएं। ELSS सबसे अच्छा रिटर्न (12–15%) + टैक्स बचत। हर साल 31 मार्च तक करें!",
      ta: "📋 **வரி சேமிப்பு (80C):** PPF, ELSS, NSC இல் ₹1.5 லட்சம்/வருடம் முதலிட்டு வரி சேமிக்கலாம். ஒவ்வொரு ஆண்டும் மார்ச் 31க்குள் முதலிடவும்!",
      te: "📋 **పన్ను ఆదా (80C):** PPF, ELSS, NSC లో ₹1.5 లక్షలు/సంవత్సరం పెట్టుబడి పెట్టి పన్ను ఆదా చేయండి. ప్రతి సంవత్సరం మార్చ్ 31 లోగా చేయండి!",
      kn: "📋 **ತೆರಿಗೆ ಉಳಿತಾಯ (80C):** PPF, ELSS, NSC ನಲ್ಲಿ ₹1.5 ಲಕ್ಷ/ವರ್ಷ ಹೂಡಿ ತೆರಿಗೆ ಉಳಿಸಿ. ಪ್ರತಿ ವರ್ಷ ಮಾರ್ಚ್ 31 ರೊಳಗೆ ಮಾಡಿ!",
      bn: "📋 **কর সঞ্চয় (80C):** PPF, ELSS, NSC তে ₹1.5 লাখ/বছর বিনিয়োগ করে কর বাঁচান। প্রতি বছর মার্চ 31-এর মধ্যে করুন!",
      mr: "📋 **कर बचत (80C):** PPF, ELSS, NSC मध्ये ₹1.5 लाख/वर्ष गुंतवणूक करून कर वाचवा. दरवर्षी 31 मार्चपूर्वी करा!",
    },
  },
  {
    keys: ["how", "start", "begin", "beginner", "शुरुआत", "ஆரம்பிக்க", "ప్రారంభం", "ಶುರು"],
    answer: {
      en: "🚀 **How to Start (Step by Step):**\n1. Open savings account (any bank)\n2. Build 3-month emergency fund first\n3. Get term + health insurance\n4. Open free Demat (Groww/Zerodha)\n5. Start ₹500/month SIP in Nifty 50 Index\n6. Increase SIP by 10% every year\n7. Patience is your superpower! 💪",
      hi: "🚀 **कैसे शुरू करें:**\n1. बचत खाता खोलें\n2. 3 महीने का इमरजेंसी फंड\n3. टर्म + हेल्थ इंश्योरेंस\n4. Groww/Zerodha में डीमैट\n5. ₹500/माह Nifty 50 SIP\n6. हर साल 10% SIP बढ़ाएं\n7. धैर्य रखें! 💪",
      ta: "🚀 **எப்படி ஆரம்பிக்கலாம்:**\n1. சேமிப்பு கணக்கு திறக்கவும்\n2. 3 மாத அவசர நிதி\n3. காப்பீடு\n4. Groww/Zerodha Demat\n5. ₹500/மாதம் Nifty 50 SIP\n6. ஆண்டுதோறும் 10% அதிகரிக்கவும் 💪",
      te: "🚀 **ఎలా ప్రారంభించాలి:**\n1. సేవింగ్స్ ఖాతా తెరవండి\n2. 3 నెలల అత్యవసర నిధి\n3. బీమా\n4. Groww/Zerodha డీమ్యాట్\n5. ₹500/నెల Nifty 50 SIP\n6. ప్రతి సంవత్సరం 10% పెంచండి 💪",
      kn: "🚀 **ಹೇಗೆ ಆರಂಭಿಸಬೇಕು:**\n1. ಉಳಿತಾಯ ಖಾತೆ ತೆರೆಯಿರಿ\n2. 3 ತಿಂಗಳ ತುರ್ತು ನಿಧಿ\n3. ವಿಮೆ\n4. Groww/Zerodha Demat\n5. ₹500/ತಿಂಗಳು Nifty 50 SIP\n6. ಪ್ರತಿ ವರ್ಷ 10% ಹೆಚ್ಚಿಸಿ 💪",
      bn: "🚀 **কিভাবে শুরু করবেন:**\n1. সঞ্চয় অ্যাকাউন্ট খুলুন\n2. 3 মাসের ইমার্জেন্সি ফান্ড\n3. বীমা\n4. Groww/Zerodha Demat\n5. ₹500/মাস Nifty 50 SIP\n6. প্রতি বছর 10% বাড়ান 💪",
      mr: "🚀 **कसे सुरू करावे:**\n1. बचत खाते उघडा\n2. 3 महिन्यांचा आपत्कालीन निधी\n3. विमा\n4. Groww/Zerodha Demat\n5. ₹500/महिना Nifty 50 SIP\n6. दरवर्षी 10% वाढवा 💪",
    },
  },
  {
    keys: ["nifty", "nifty 50", "nse", "national stock exchange"],
    answer: {
      en: "📊 **NIFTY 50** is India's most important stock index!\n\n1. 🏛️ It tracks the **top 50 companies** on NSE (National Stock Exchange)\n2. 📈 These 50 companies = **66% of India's total stock market value**\n3. 💰 It started in **1996 at base value 1000** — today it's 22,000+!\n4. 🎯 How to invest: Buy **Nifty 50 Index Fund** via SIP (₹500/month minimum)\n5. 📊 Average annual return: **12–15% over 20 years**\n\n**Top 5 NIFTY stocks:** Reliance, TCS, HDFC Bank, ICICI Bank, Infosys",
      hi: "📊 **NIFTY 50** भारत का सबसे महत्वपूर्ण शेयर बाजार सूचकांक है!\n\n1. 🏛️ NSE के **शीर्ष 50 कंपनियों** को ट्रैक करता है\n2. 📈 ये 50 कंपनियां = भारत के **कुल शेयर बाजार का 66%**\n3. 💰 1996 में **1000 से शुरू** — आज 22,000+!\n4. 🎯 कैसे निवेश करें: **Nifty 50 Index Fund SIP** (₹500/माह)\n5. 📊 औसत वार्षिक रिटर्न: **20 साल में 12–15%**",
      ta: "📊 **NIFTY 50** இந்தியாவின் மிக முக்கியமான பங்கு குறியீடு!\n1. NSE இல் **50 சிறந்த நிறுவனங்களை** கண்காணிக்கிறது\n2. 1996 இல் 1000 ல் தொடங்கி இன்று 22,000+\n3. **Nifty 50 Index Fund SIP** மூலம் முதலிடுங்கள் (₹500/மாதம்)",
      te: "📊 **NIFTY 50** భారతదేశంలో అత్యంత ముఖ్యమైన స్టాక్ ఇండెక్స్!\n1. NSE లో **50 అగ్రగామి కంపెనీలను** ట్రాక్ చేస్తుంది\n2. 1996 లో 1000 తో మొదలై ఇప్పుడు 22,000+\n3. **Nifty 50 Index Fund SIP** లో పెట్టుబడి పెట్టండి",
      kn: "📊 **NIFTY 50** ಭಾರತದ ಅತ್ಯಂತ ಮುಖ್ಯ ಷೇರು ಸೂಚ್ಯಂಕ!\n1. NSE ನ **ಅಗ್ರ 50 ಕಂಪನಿಗಳನ್ನು** ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ\n2. 1996 ರಲ್ಲಿ 1000 ರಿಂದ ಶುರುವಾಗಿ ಈಗ 22,000+\n3. **Nifty 50 Index Fund SIP** ನಲ್ಲಿ ಹೂಡಿ",
      bn: "📊 **NIFTY 50** ভারতের সবচেয়ে গুরুত্বপূর্ণ শেয়ার সূচক!\n1. NSE-তে **শীর্ষ 50 কোম্পানি** ট্র্যাক করে\n2. 1996-এ 1000 থেকে শুরু, এখন 22,000+\n3. **Nifty 50 Index Fund SIP**-এ বিনিয়োগ করুন",
      mr: "📊 **NIFTY 50** भारताचा सर्वात महत्त्वाचा शेअर बाजार निर्देशांक!\n1. NSE च्या **शीर्ष 50 कंपन्यांना** ट्रॅक करतो\n2. 1996 मध्ये 1000 पासून सुरू, आता 22,000+\n3. **Nifty 50 Index Fund SIP** मध्ये गुंतवणूक करा",
    },
  },
  {
    keys: ["sensex", "bse", "bombay stock exchange", "bombay"],
    answer: {
      en: "📈 **SENSEX** = BSE Sensitive Index — India's oldest stock market benchmark!\n\n1. 🏛️ Tracks **30 largest companies** on BSE (Bombay Stock Exchange)\n2. 📊 Started in **1979 at base value 100** — now 73,000+!\n3. 🆚 **SENSEX vs NIFTY:** Both track India's health. NIFTY = 50 stocks, SENSEX = 30 stocks\n4. 📈 Long-term SENSEX return: **~15% CAGR** (last 20 years)\n5. 🎯 Invest via: **BSE Sensex Index Fund** or ETF\n\n**SENSEX rising = India's economy is growing!**",
      hi: "📈 **SENSEX** = BSE सेंसिटिव इंडेक्स — भारत का सबसे पुराना बाजार मानक!\n1. BSE की **30 सबसे बड़ी कंपनियों** को ट्रैक करता है\n2. 1979 में **100 से शुरू** — अब 73,000+!\n3. **SENSEX बढ़ना = भारत की अर्थव्यवस्था बढ़ना!**",
      ta: "📈 **SENSEX** = BSE Sensitive Index — இந்தியாவின் பழமையான பங்கு குறியீடு!\n1. BSE இல் **30 பெரிய நிறுவனங்களை** கண்காணிக்கிறது\n2. 1979 இல் 100 ல் தொடங்கி இன்று 73,000+!",
      te: "📈 **SENSEX** = BSE Sensitive Index — భారతదేశంలో పురాతన స్టాక్ ఇండెక్స్!\n1. BSE లో **30 అతిపెద్ద కంపెనీలను** ట్రాక్ చేస్తుంది\n2. 1979 లో 100 తో మొదలై ఇప్పుడు 73,000+!",
      kn: "📈 **SENSEX** = BSE Sensitive Index — ಭಾರತದ ಅತ್ಯಂತ ಹಳೆಯ ಷೇರು ಸೂಚ್ಯಂಕ!\n1. BSE ಯ **30 ದೊಡ್ಡ ಕಂಪನಿಗಳನ್ನು** ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ\n2. 1979 ರಲ್ಲಿ 100 ರಿಂದ ಶುರು, ಈಗ 73,000+!",
      bn: "📈 **SENSEX** = BSE Sensitive Index — ভারতের প্রাচীনতম শেয়ার সূচক!\n1. BSE-তে **30টি বৃহত্তম কোম্পানি** ট্র্যাক করে\n2. 1979-এ 100 থেকে শুরু, এখন 73,000+!",
      mr: "📈 **SENSEX** = BSE Sensitive Index — भारताचा सर्वात जुना शेअर बाजार निर्देशांक!\n1. BSE च्या **30 मोठ्या कंपन्यांना** ट्रॅक करतो\n2. 1979 मध्ये 100 पासून सुरू, आता 73,000+!",
    },
  },
  {
    keys: ["bank nifty", "banking sector", "bank stocks"],
    answer: {
      en: "🏦 **BANK NIFTY** tracks India's top 12 banking stocks on NSE!\n\n1. 💳 Includes: HDFC Bank, ICICI Bank, SBI, Axis Bank, Kotak Bank\n2. 📊 More volatile than NIFTY 50 — bigger swings up AND down\n3. 🎯 Good for: **Active traders** who understand banking sector\n4. ⚠️ Risk: **Higher than regular NIFTY** — not for beginners\n5. 💡 Beginners should start with **Nifty 50**, not Bank Nifty\n\n**Current level: ~48,000+ (as of 2025)**",
      hi: "🏦 **BANK NIFTY** NSE के शीर्ष 12 बैंकिंग शेयरों को ट्रैक करता है!\n1. HDFC Bank, ICICI Bank, SBI, Axis Bank शामिल\n2. NIFTY 50 से **अधिक अस्थिर** — बड़े उतार-चढ़ाव\n3. ⚠️ शुरुआती लोगों के लिए नहीं — पहले Nifty 50 से शुरू करें",
      ta: "🏦 **BANK NIFTY** NSE யில் 12 வங்கி பங்குகளை கண்காணிக்கிறது!\n1. HDFC Bank, ICICI Bank, SBI அடங்கும்\n2. ⚠️ மிகவும் ஏற்றத்தாழ்வு உள்ளது — புதியவர்களுக்கு ஏற்றதல்ல",
      te: "🏦 **BANK NIFTY** NSE లో 12 బ్యాంకింగ్ స్టాక్స్ ట్రాక్ చేస్తుంది!\n1. HDFC Bank, ICICI Bank, SBI చేర్చబడ్డాయి\n2. ⚠️ చాలా అస్థిరంగా ఉంటుంది — ప్రారంభకులకు తగినది కాదు",
      kn: "🏦 **BANK NIFTY** NSE ನಲ್ಲಿ 12 ಬ್ಯಾಂಕಿಂಗ್ ಷೇರುಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡುತ್ತದೆ!\n1. HDFC Bank, ICICI Bank, SBI ಸೇರಿವೆ\n2. ⚠️ ತುಂಬಾ ಚಂಚಲ — ಹೊಸಬರಿಗೆ ಸೂಕ್ತವಲ್ಲ",
      bn: "🏦 **BANK NIFTY** NSE-তে শীর্ষ 12 ব্যাংকিং স্টক ট্র্যাক করে!\n1. HDFC Bank, ICICI Bank, SBI অন্তর্ভুক্ত\n2. ⚠️ অনেক বেশি অস্থির — নতুনদের জন্য নয়",
      mr: "🏦 **BANK NIFTY** NSE च्या 12 बँकिंग शेअर्सना ट्रॅक करतो!\n1. HDFC Bank, ICICI Bank, SBI समाविष्ट\n2. ⚠️ खूप अस्थिर — नवशिक्यांसाठी नाही",
    },
  },
  {
    keys: ["crypto", "bitcoin", "ethereum", "cryptocurrency", "web3", "btc", "eth"],
    answer: {
      en: "₿ **Crypto Investing in India — What You Need to Know:**\n\n1. ⚖️ **Legal status:** Crypto is legal in India but not a legal tender\n2. 💸 **Tax:** 30% flat tax on ALL crypto gains + 1% TDS\n3. ⚠️ **Risk:** Extremely volatile — Bitcoin dropped 80% in 2022!\n4. 🏛️ **RBI warning:** India's central bank has cautioned against crypto\n5. 💡 **Expert advice:** Keep crypto to MAX 5% of your portfolio\n6. 📊 **Safer alternative:** Start with NIFTY 50 before touching crypto\n\n**If you still want crypto:** Use WazirX, CoinDCX, Binance. Start with ₹1000 max!",
      hi: "₿ **भारत में क्रिप्टो निवेश:**\n1. ⚖️ कानूनी है लेकिन legal tender नहीं\n2. 💸 सभी लाभ पर **30% टैक्स + 1% TDS**\n3. ⚠️ अत्यधिक जोखिम — Bitcoin 2022 में 80% गिरा!\n4. 💡 पोर्टफोलियो का **अधिकतम 5%** ही लगाएं\n5. 📊 पहले **NIFTY 50** में निवेश करें",
      ta: "₿ **இந்தியாவில் கிரிப்டோ முதலீடு:**\n1. ⚖️ சட்டப்பூர்வமாக அனுமதிக்கப்பட்டுள்ளது ஆனால் legal tender அல்ல\n2. 💸 **30% வரி + 1% TDS** அனைத்து லாபங்களுக்கும்\n3. ⚠️ மிகவும் ஆபத்தானது — முதலில் NIFTY 50 முதலிடுங்கள்",
      te: "₿ **భారతదేశంలో క్రిప్టో పెట్టుబడి:**\n1. ⚖️ చట్టబద్ధం కానీ legal tender కాదు\n2. 💸 **30% పన్ను + 1% TDS** అన్ని లాభాలపై\n3. ⚠️ చాలా ప్రమాదకరం — ముందు NIFTY 50 ప్రయత్నించండి",
      kn: "₿ **ಭಾರತದಲ್ಲಿ ಕ್ರಿಪ್ಟೋ ಹೂಡಿಕೆ:**\n1. ⚖️ ಕಾನೂನುಬದ್ಧ ಆದರೆ legal tender ಅಲ್ಲ\n2. 💸 **30% ತೆರಿಗೆ + 1% TDS** ಎಲ್ಲಾ ಲಾಭಗಳಿಗೆ\n3. ⚠️ ತುಂಬಾ ಅಪಾಯಕಾರಿ — ಮೊದಲು NIFTY 50 ಪ್ರಯತ್ನಿಸಿ",
      bn: "₿ **ভারতে ক্রিপ্টো বিনিয়োগ:**\n1. ⚖️ বৈধ কিন্তু legal tender নয়\n2. 💸 সমস্ত লাভে **30% কর + 1% TDS**\n3. ⚠️ অত্যন্ত ঝুঁকিপূর্ণ — আগে NIFTY 50 চেষ্টা করুন",
      mr: "₿ **भारतात क्रिप्टो गुंतवणूक:**\n1. ⚖️ कायदेशीर पण legal tender नाही\n2. 💸 सर्व नफ्यावर **30% कर + 1% TDS**\n3. ⚠️ अत्यंत धोकादायक — आधी NIFTY 50 वापरा",
    },
  },
  {
    keys: ["bull", "bear", "market crash", "market rally", "bull market", "bear market"],
    answer: {
      en: "🐂🐻 **Bull vs Bear Market — Simple Explanation:**\n\n1. 🐂 **Bull Market** = Prices going UP for 20%+ — investors are happy, economy is growing\n2. 🐻 **Bear Market** = Prices falling 20%+ — investors are scared, economy slowing\n3. 📊 **India history:** Bull markets last ~3–5 years, bear markets ~1–2 years\n4. 💡 **What to do in Bear Market:** **BUY MORE!** Stocks are on sale!\n5. 💡 **What to do in Bull Market:** Stay invested, don't exit early\n6. 🎯 **Key rule:** Time in market > Timing the market\n\n**Average Bear Market recovery time: 14 months**",
      hi: "🐂🐻 **Bull vs Bear मार्केट:**\n1. 🐂 **Bull Market** = कीमतें 20%+ ऊपर — अर्थव्यवस्था बढ़ रही है\n2. 🐻 **Bear Market** = कीमतें 20%+ नीचे — गिरावट का दौर\n3. 💡 **Bear में:** और खरीदें! शेयर सेल पर हैं!\n4. 💡 **Bull में:** निवेशित रहें, जल्दी मत निकलें",
      ta: "🐂🐻 **Bull vs Bear சந்தை:**\n1. 🐂 **Bull Market** = விலைகள் 20%+ உயர்வு\n2. 🐻 **Bear Market** = விலைகள் 20%+ வீழ்ச்சி\n3. 💡 **Bear சந்தையில்:** மேலும் வாங்குங்கள்! பங்குகள் தள்ளுபடியில் உள்ளன!",
      te: "🐂🐻 **Bull vs Bear మార్కెట్:**\n1. 🐂 **Bull Market** = ధరలు 20%+ పెరుగుతున్నాయి\n2. 🐻 **Bear Market** = ధరలు 20%+ పడిపోతున్నాయి\n3. 💡 **Bear లో:** మరిన్ని కొనండి! స్టాక్స్ సేల్‌లో ఉన్నాయి!",
      kn: "🐂🐻 **Bull vs Bear ಮಾರ್ಕೆಟ್:**\n1. 🐂 **Bull Market** = ಬೆಲೆಗಳು 20%+ ಮೇಲೆ\n2. 🐻 **Bear Market** = ಬೆಲೆಗಳು 20%+ ಕೆಳಗೆ\n3. 💡 **Bear ನಲ್ಲಿ:** ಹೆಚ್ಚು ಕೊಳ್ಳಿ! ಷೇರುಗಳು ಸೇಲ್‌ನಲ್ಲಿ!",
      bn: "🐂🐻 **Bull vs Bear বাজার:**\n1. 🐂 **Bull Market** = দাম 20%+ উপরে\n2. 🐻 **Bear Market** = দাম 20%+ নিচে\n3. 💡 **Bear-এ:** আরও কিনুন! শেয়ার ছাড়ে আছে!",
      mr: "🐂🐻 **Bull vs Bear बाजार:**\n1. 🐂 **Bull Market** = किमती 20%+ वर\n2. 🐻 **Bear Market** = किमती 20%+ खाली\n3. 💡 **Bear मध्ये:** आणखी खरेदी करा! शेअर्स सवलतीत आहेत!",
    },
  },
  {
    keys: ["ipo", "initial public offering", "new listing", "share listing"],
    answer: {
      en: "🚀 **IPO (Initial Public Offering) — Explained Simply:**\n\n1. 🏭 **What is IPO?** When a private company sells its shares to the public for the FIRST time\n2. 💰 **Why companies do IPO?** To raise money for growth\n3. 📋 **How to apply:** Open Demat (Groww/Zerodha) → Apply via UPI → Wait for allotment\n4. 💡 **IPO Tips:**\n   - Apply in retail category (max ₹2 lakh)\n   - Check company profit/loss before applying\n   - Don't apply just because everyone is talking about it\n5. ⚠️ **Risk:** Not all IPOs give listing gains. Some fall below issue price!\n\n**Best strategy:** Apply for fundamentally strong IPOs only!",
      hi: "🚀 **IPO क्या है:**\n1. जब कोई **प्राइवेट कंपनी पहली बार** अपने शेयर जनता को बेचती है\n2. Groww/Zerodha पर Demat खोलें → UPI से अप्लाई करें\n3. 💡 टिप: कंपनी का **profit/loss जरूर देखें** अप्लाई से पहले\n4. ⚠️ सब IPO में profit नहीं होता!",
      ta: "🚀 **IPO என்றால் என்ன:**\n1. ஒரு தனியார் நிறுவனம் **முதல் முறையாக** பொதுமக்களுக்கு பங்குகளை விற்கும்போது\n2. Groww/Zerodha இல் Demat திறந்து UPI மூலம் விண்ணப்பிக்கவும்\n3. ⚠️ அனைத்து IPO களும் லாபம் தராது!",
      te: "🚀 **IPO అంటే ఏమిటి:**\n1. ఒక ప్రైవేట్ కంపెనీ **మొదటిసారి** పబ్లిక్‌కు షేర్లు అమ్మినప్పుడు\n2. Groww/Zerodha లో డీమ్యాట్ తెరవండి → UPI ద్వారా అప్లై చేయండి\n3. ⚠️ అన్ని IPO లూ లాభం ఇవ్వవు!",
      kn: "🚀 **IPO ಎಂದರೇನು:**\n1. ಒಂದು ಖಾಸಗಿ ಕಂಪನಿ **ಮೊದಲ ಬಾರಿ** ಸಾರ್ವಜನಿಕರಿಗೆ ಷೇರು ಮಾರಾಟ ಮಾಡಿದಾಗ\n2. Groww/Zerodha ನಲ್ಲಿ Demat ತೆರೆಯಿರಿ → UPI ಮೂಲಕ ಅರ್ಜಿ ಹಾಕಿ\n3. ⚠️ ಎಲ್ಲಾ IPO ಲಾಭ ಕೊಡುವುದಿಲ್ಲ!",
      bn: "🚀 **IPO কী:**\n1. যখন একটি বেসরকারি কোম্পানি **প্রথমবার** জনগণকে শেয়ার বিক্রি করে\n2. Groww/Zerodha-তে Demat খুলুন → UPI দিয়ে আবেদন করুন\n3. ⚠️ সব IPO-তে লাভ হয় না!",
      mr: "🚀 **IPO म्हणजे काय:**\n1. जेव्हा एखादी खाजगी कंपनी **पहिल्यांदा** जनतेला शेअर्स विकते\n2. Groww/Zerodha वर Demat उघडा → UPI ने अर्ज करा\n3. ⚠️ सर्व IPO मध्ये नफा होत नाही!",
    },
  },
  {
    keys: ["dividend", "dividend stock", "passive income stock"],
    answer: {
      en: "💵 **Dividends — Earning While You Sleep!**\n\n1. 🏭 **What is dividend?** Companies share their profits with shareholders as cash\n2. 📊 **Example:** If you own 100 shares of Coal India (₹250 each = ₹25,000), and they pay ₹25/share dividend → you get **₹2,500 FREE cash**!\n3. 🎯 **Best dividend stocks in India:** Coal India, NTPC, Power Grid, ITC, ONGC\n4. 💡 **Dividend yield:** Annual dividend ÷ Stock price × 100 (aim for 3–6%)\n5. 📅 Check **ex-dividend date** — you must own shares BEFORE this date\n\n**Dividend + Capital Appreciation = Double income! 🚀**",
      hi: "💵 **डिविडेंड — सोते हुए भी कमाई!**\n1. कंपनियां अपना **मुनाफा शेयरधारकों को** नकद में बांटती हैं\n2. **Coal India, NTPC, ITC** — अच्छे डिविडेंड स्टॉक\n3. 💡 **Dividend Yield:** सालाना डिविडेंड ÷ शेयर की कीमत × 100 (3–6% अच्छा)",
      ta: "💵 **டிவிடெண்ட் — தூங்கும்போதும் வருமானம்!**\n1. நிறுவனங்கள் தங்கள் **லாபத்தை பங்குதாரர்களுக்கு** பணமாக பகிர்ந்தளிக்கின்றன\n2. **Coal India, NTPC, ITC** — சிறந்த டிவிடெண்ட் பங்குகள்",
      te: "💵 **డివిడెండ్ — నిద్రిస్తున్నప్పుడు కూడా ఆదాయం!**\n1. కంపెనీలు తమ **లాభాన్ని షేర్‌హోల్డర్లకు** నగదుగా పంచుతాయి\n2. **Coal India, NTPC, ITC** — మంచి డివిడెండ్ స్టాక్స్",
      kn: "💵 **ಡಿವಿಡೆಂಡ್ — ನಿದ್ರೆ ಮಾಡುತ್ತಲೇ ಆದಾಯ!**\n1. ಕಂಪನಿಗಳು ತಮ್ಮ **ಲಾಭವನ್ನು ಷೇರುದಾರರಿಗೆ** ನಗದಾಗಿ ಹಂಚುತ್ತವೆ\n2. **Coal India, NTPC, ITC** — ಉತ್ತಮ ಡಿವಿಡೆಂಡ್ ಷೇರುಗಳು",
      bn: "💵 **ডিভিডেন্ড — ঘুমিয়েও আয়!**\n1. কোম্পানিগুলি তাদের **মুনাফা শেয়ারহোল্ডারদের** নগদ হিসেবে বিতরণ করে\n2. **Coal India, NTPC, ITC** — ভালো ডিভিডেন্ড স্টক",
      mr: "💵 **डिव्हिडंड — झोपेतही कमाई!**\n1. कंपन्या त्यांचा **नफा भागधारकांना** रोखीने वाटतात\n2. **Coal India, NTPC, ITC** — चांगले डिव्हिडंड स्टॉक",
    },
  },
  {
    keys: ["real estate", "property", "land", "house", "home loan", "plot"],
    answer: {
      en: "🏠 **Real Estate Investment in India — Full Guide:**\n\n1. 💰 **Minimum investment:** ₹10–50 lakhs (direct property)\n2. 📊 **Average returns:** 8–12% per year (rent + appreciation)\n3. 🏦 **Home Loan Tips:**\n   - EMI should be MAX 30–40% of monthly income\n   - Pre-pay loan whenever you have extra money (saves lakhs in interest)\n   - Compare rates: SBI, HDFC, ICICI (aim for <8.5%)\n4. 💡 **Alternative:** REITs (Real Estate Investment Trusts) — invest from ₹300!\n   - Embassy REIT, Mindspace REIT — 7–8% annual yield\n5. ⚠️ **Warning:** Don't put all savings in one property. Diversify!\n\n**REITs = Real estate returns WITHOUT buying property!**",
      hi: "🏠 **रियल एस्टेट निवेश:**\n1. न्यूनतम ₹10–50 लाख (सीधी संपत्ति)\n2. औसत रिटर्न: **8–12% प्रति वर्ष**\n3. 💡 **REITs** से सिर्फ ₹300 में रियल एस्टेट में निवेश करें\n4. EMI = अधिकतम **मासिक आय का 30–40%**",
      ta: "🏠 **ரியல் எஸ்டேட் முதலீடு:**\n1. குறைந்தது ₹10–50 லட்சம் (நேரடி சொத்து)\n2. சராசரி வருமானம்: **8–12% ஆண்டுக்கு**\n3. 💡 **REITs** மூலம் ₹300 ல் ரியல் எஸ்டேட்டில் முதலிடலாம்!",
      te: "🏠 **రియల్ ఎస్టేట్ పెట్టుబడి:**\n1. కనీసం ₹10–50 లక్షలు (నేరుగా ఆస్తి)\n2. సగటు రాబడి: **8–12% సంవత్సరానికి**\n3. 💡 **REITs** ద్వారా ₹300 తో రియల్ ఎస్టేట్‌లో పెట్టుబడి పెట్టండి!",
      kn: "🏠 **ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಹೂಡಿಕೆ:**\n1. ಕನಿಷ್ಠ ₹10–50 ಲಕ್ಷ (ನೇರ ಆಸ್ತಿ)\n2. ಸರಾಸರಿ ರಿಟರ್ನ್: **8–12% ವರ್ಷಕ್ಕೆ**\n3. 💡 **REITs** ಮೂಲಕ ₹300 ರಲ್ಲಿ ರಿಯಲ್ ಎಸ್ಟೇಟ್‌ನಲ್ಲಿ ಹೂಡಿ!",
      bn: "🏠 **রিয়েল এস্টেট বিনিয়োগ:**\n1. সর্বনিম্ন ₹10–50 লাখ (সরাসরি সম্পত্তি)\n2. গড় রিটার্ন: **8–12% প্রতি বছর**\n3. 💡 **REITs** মাধ্যমে ₹300 থেকে রিয়েল এস্টেটে বিনিয়োগ!",
      mr: "🏠 **रिअल इस्टेट गुंतवणूक:**\n1. किमान ₹10–50 लाख (थेट मालमत्ता)\n2. सरासरी परतावा: **8–12% दरवर्षी**\n3. 💡 **REITs** द्वारे ₹300 मध्ये रिअल इस्टेटमध्ये गुंतवणूक!",
    },
  },
  {
    keys: ["reliance", "tcs", "infosys", "hdfc", "icici", "wipro", "sbi", "best stock", "top stock", "which stock"],
    answer: {
      en: "📊 **Top Indian Stocks for 2025 — Analysis:**\n\n1. 🔵 **RELIANCE** (₹2,840) — Energy + Jio + Retail. India's most valuable company!\n2. 💻 **TCS** (₹3,885) — India's biggest IT company. Consistent dividends + growth\n3. 🖥️ **INFOSYS** (₹1,650) — Top IT stock. Good for long-term growth\n4. 🏦 **HDFC BANK** (₹1,594) — India's best private bank. Bluechip stock!\n5. 💳 **ICICI BANK** (₹1,085) — Strong growth. Good for 5+ year holding\n6. 🏛️ **SBI** (₹810) — Largest public bank. Good dividends!\n\n⚠️ **This is not financial advice. Do your own research (DYOR) before investing!**",
      hi: "📊 **2025 के शीर्ष भारतीय स्टॉक:**\n1. **RELIANCE** — ऊर्जा + Jio + रिटेल. भारत की सबसे मूल्यवान कंपनी!\n2. **TCS** — सबसे बड़ी IT कंपनी. लगातार डिविडेंड\n3. **HDFC BANK** — भारत का सबसे अच्छा प्राइवेट बैंक\n⚠️ यह वित्तीय सलाह नहीं है। निवेश से पहले खुद रिसर्च करें!",
      ta: "📊 **2025 இல் சிறந்த இந்திய பங்குகள்:**\n1. **RELIANCE** — ஆற்றல் + Jio + சில்லறை. இந்தியாவின் மிக மதிப்புமிக்க நிறுவனம்!\n2. **TCS** — மிகப்பெரிய IT நிறுவனம்\n3. **HDFC BANK** — இந்தியாவின் சிறந்த தனியார் வங்கி\n⚠️ இது நிதி ஆலோசனை அல்ல. முதலிடும் முன் ஆராயுங்கள்!",
      te: "📊 **2025 లో అగ్ర భారతీయ స్టాక్స్:**\n1. **RELIANCE** — ఎనర్జీ + Jio + రిటెయిల్. భారతదేశంలో అత్యంత విలువైన కంపెనీ!\n2. **TCS** — అతిపెద్ద IT కంపెనీ\n3. **HDFC BANK** — భారతదేశంలో అత్యుత్తమ ప్రైవేట్ బ్యాంక్\n⚠️ ఇది ఆర్థిక సలహా కాదు. పెట్టుబడి ముందు మీరే పరిశోధించండి!",
      kn: "📊 **2025 ರ ಅಗ್ರ ಭಾರತೀಯ ಷೇರುಗಳು:**\n1. **RELIANCE** — ಶಕ್ತಿ + Jio + ಚಿಲ್ಲರೆ. ಭಾರತದ ಅತ್ಯಂತ ಮೌಲ್ಯಯುತ ಕಂಪನಿ!\n2. **TCS** — ಅತ್ಯಂತ ದೊಡ್ಡ IT ಕಂಪನಿ\n3. **HDFC BANK** — ಭಾರತದ ಅತ್ಯುತ್ತಮ ಖಾಸಗಿ ಬ್ಯಾಂಕ್\n⚠️ ಇದು ಹಣಕಾಸಿನ ಸಲಹೆ ಅಲ್ಲ!",
      bn: "📊 **2025 সালের শীর্ষ ভারতীয় স্টক:**\n1. **RELIANCE** — শক্তি + Jio + খুচরা। ভারতের সবচেয়ে মূল্যবান কোম্পানি!\n2. **TCS** — বৃহত্তম IT কোম্পানি\n3. **HDFC BANK** — ভারতের সেরা বেসরকারি ব্যাংক\n⚠️ এটি আর্থিক পরামর্শ নয়!",
      mr: "📊 **2025 मधील शीर्ष भारतीय स्टॉक:**\n1. **RELIANCE** — ऊर्जा + Jio + रिटेल. भारतातील सर्वात मौल्यवान कंपनी!\n2. **TCS** — सर्वात मोठी IT कंपनी\n3. **HDFC BANK** — भारतातील सर्वोत्तम खाजगी बँक\n⚠️ हे वित्तीय सल्ले नाही!",
    },
  },
];

export function getAnswer(question, lang = "en") {
  const q = question.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keys.some((k) => q.includes(k))) {
      return faq.answer[lang] || faq.answer["en"];
    }
  }
  return null;
}

export default FAQ;
