/* ============================================================
   EduSetu — Chatbot JavaScript
   Mock AI responses, chat logic, confidence score, ratings
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Mock AI Responses ---------- */
  var RESPONSES = {
    en: {
      'fractions': "Great question about fractions! 🎯\n\nA fraction represents a part of a whole. It has two parts:\n• **Numerator** (top) — how many parts you have\n• **Denominator** (bottom) — how many equal parts the whole is divided into\n\n**Example:** 3/4 means you have 3 out of 4 equal parts.\n\n**To add fractions with the same denominator:**\nJust add the numerators and keep the denominator.\n2/5 + 1/5 = 3/5\n\n**To add fractions with different denominators:**\nFind a common denominator first!\n1/3 + 1/4 = 4/12 + 3/12 = 7/12\n\nWould you like to try a quick quiz on fractions?",
      'algebraic-expressions': "Let me explain Algebraic Expressions! 📐\n\n**What is an algebraic expression?**\nIt's a mathematical phrase combining numbers, variables (like x, y), and operations (+, −, ×, ÷).\n\n**Examples:** 3x + 5, 2y² − 7, 4ab + 2a − b\n\n**Key concepts:**\n1. **Terms** — parts separated by + or −. In '3x + 5y − 2', there are 3 terms\n2. **Like terms** — same variables with same powers. 3x and 5x are like terms\n3. **Coefficient** — the number before a variable. In 5x, the coefficient is 5\n\n**Simplifying:** Combine like terms!\n3x + 5x − 2 = 8x − 2\n\n**Common mistakes to watch:**\n❌ Adding unlike terms (3x + 5y ≠ 8xy)\n❌ Forgetting sign rules (−2 stays −2, don't make it +2)\n\nWant me to explain more about expanding brackets?",
      'linear-equations': "Let's break down Linear Equations! ✨\n\n**What is a linear equation?**\nAn equation where the highest power of the variable is 1.\nExample: 2x + 3 = 7\n\n**How to solve:**\nGoal: Get the variable alone on one side!\n\n**Step-by-step for 2x + 3 = 7:**\n1. Subtract 3 from both sides: 2x = 4\n2. Divide both sides by 2: x = 2\n3. Check: 2(2) + 3 = 7 ✓\n\n**Golden Rule:** Whatever you do to one side, do to the other side too!\n\nShall I show you a harder example?",
      'photosynthesis': "Let's understand Photosynthesis! 🌿\n\n**What is it?**\nThe process by which green plants make their own food using sunlight.\n\n**The equation:**\nCO₂ + H₂O + Sunlight → Glucose + O₂\n(Carbon dioxide + Water + Light energy → Sugar + Oxygen)\n\n**Where does it happen?**\nIn the **chloroplast** — a cell organelle that contains the green pigment **chlorophyll**.\n\n**Key points:**\n• Plants absorb CO₂ through tiny pores called **stomata**\n• Water is absorbed through roots\n• Sunlight is the energy source\n• Oxygen is released as a byproduct (which we breathe!)\n\n**Common confusion:** Don't mix up photosynthesis and respiration!\n• Photosynthesis: CO₂ in → O₂ out (makes food)\n• Respiration: O₂ in → CO₂ out (uses food for energy)\n\nWant me to explain the light and dark reactions?",
      'active-passive': "Let me explain Active and Passive Voice! 📝\n\n**Active Voice:** The subject DOES the action.\n→ \"The cat caught the mouse.\"\n\n**Passive Voice:** The subject RECEIVES the action.\n→ \"The mouse was caught by the cat.\"\n\n**How to convert Active → Passive:**\n1. Object becomes the new subject\n2. Add appropriate form of 'be' (is/was/are/were)\n3. Use past participle of the verb\n4. Original subject goes after 'by'\n\n**Tense changes:**\n• Simple Present: writes → is written\n• Simple Past: wrote → was written\n• Present Continuous: is writing → is being written\n\n**Example:**\nActive: She writes a letter.\nPassive: A letter is written by her.\n\n**Tip:** Not all sentences can become passive. You need a transitive verb (one with an object)!\n\"He laughed\" — can't be made passive (no object).\n\nWant to practice some conversions?",
      'default': "That's a great question! 🤔\n\nI'd love to help you understand this concept better. Here are some things we can explore:\n\n• **Math:** Fractions, Algebra, Linear Equations, Geometry, Statistics\n• **Science:** Photosynthesis, Acids & Bases, Light & Refraction\n• **English:** Active/Passive Voice, Direct/Indirect Speech, Tenses\n• **Social Science:** Modern India, Constitution, Geography\n• **Hindi:** क्रिया, वाक्य रचना, मुहावरे\n\nTry asking something specific like:\n- \"Explain fractions\"\n- \"How does photosynthesis work?\"\n- \"What is active voice?\"\n\nI'm here to help! 😊"
    },
    hi: {
      'fractions': "भिन्न (Fractions) के बारे में अच्छा सवाल! 🎯\n\nभिन्न एक पूर्ण का हिस्सा दर्शाती है। इसके दो भाग हैं:\n• **अंश** (ऊपर) — आपके पास कितने भाग हैं\n• **हर** (नीचे) — पूर्ण को कितने बराबर भागों में बाँटा गया है\n\n**उदाहरण:** 3/4 का मतलब 4 बराबर भागों में से 3 भाग।\n\n**समान हर वाली भिन्नों को जोड़ना:**\nबस अंश जोड़ो, हर वही रहता है।\n2/5 + 1/5 = 3/5\n\nक्या आप भिन्न पर एक छोटी परीक्षा लेना चाहेंगे?",
      'algebraic-expressions': "बीजीय व्यंजक (Algebraic Expressions) समझते हैं! 📐\n\n**बीजीय व्यंजक क्या है?**\nसंख्याओं, चरों (जैसे x, y) और गणित के चिन्हों (+, −, ×, ÷) का मिश्रण।\n\n**मुख्य बातें:**\n1. **पद** — + या − से अलग होते हैं। '3x + 5y − 2' में 3 पद हैं\n2. **समान पद** — एक जैसे चर। 3x और 5x समान पद हैं\n3. **गुणांक** — चर के आगे की संख्या। 5x में गुणांक 5 है\n\n**सरल करना:** समान पदों को जोड़ो!\n3x + 5x − 2 = 8x − 2\n\nक्या आप कोष्ठक खोलना सीखना चाहेंगे?",
      'photosynthesis': "प्रकाश संश्लेषण (Photosynthesis) समझते हैं! 🌿\n\n**यह क्या है?**\nवह प्रक्रिया जिसमें हरे पौधे सूर्य के प्रकाश का उपयोग करके अपना भोजन बनाते हैं।\n\n**समीकरण:**\nCO₂ + H₂O + सूर्य का प्रकाश → ग्लूकोज़ + O₂\n\n**यह कहाँ होता है?**\n**हरित लवक (Chloroplast)** में — जिसमें हरा वर्णक **क्लोरोफिल** होता है।\n\n**याद रखें:**\n• पौधे CO₂ रंध्रों (Stomata) से लेते हैं\n• पानी जड़ों से आता है\n• ऑक्सीजन बाहर निकलती है\n\nक्या और विस्तार से समझना है?",
      'default': "बहुत अच्छा सवाल! 🤔\n\nमैं आपकी मदद करने के लिए तैयार हूँ। आप पूछ सकते हैं:\n\n• **गणित:** भिन्न, बीजगणित, रेखीय समीकरण\n• **विज्ञान:** प्रकाश संश्लेषण, अम्ल और क्षार\n• **अंग्रेज़ी:** Active/Passive Voice\n• **हिंदी:** क्रिया, वाक्य रचना\n\nकुछ विशिष्ट पूछें जैसे:\n- \"भिन्न समझाओ\"\n- \"प्रकाश संश्लेषण कैसे काम करता है?\"\n\nमैं यहाँ हूँ! 😊"
    }
  };

  /* ---------- State ---------- */
  var currentLang = 'en';
  var chatHistory = [];

  /* ---------- DOM References ---------- */
  var chatMessages = document.getElementById('chatMessages');
  var chatInput = document.getElementById('chatInput');
  var chatSend = document.getElementById('chatSend');
  var confidenceRing = document.getElementById('confidenceRing');
  var confidenceValue = document.getElementById('confidenceValue');
  var btnEN = document.getElementById('btnEN');
  var btnHI = document.getElementById('btnHI');

  /* ---------- Update Confidence Score Display ---------- */
  function updateConfidence() {
    var score = EduSetu.getConfidenceScore();
    confidenceValue.textContent = score + '%';
    confidenceRing.setAttribute('stroke-dasharray', score + ', 100');
  }

  /* ---------- Create Message Element ---------- */
  function createMessageEl(text, sender) {
    var msg = document.createElement('div');
    msg.className = 'message ' + sender;

    var avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'ai' ? '🤖' : '👤';

    var content = document.createElement('div');
    content.className = 'message-content';

    var bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    // Parse simple markdown-like formatting safely
    var lines = text.split('\n');
    lines.forEach(function(line, i) {
      if (i > 0) {
        content.appendChild(document.createElement('br'));
      }
      var lineEl = document.createElement('span');
      // Strip markdown bold markers for display
      var cleaned = line.replace(/\*\*/g, '');
      lineEl.textContent = cleaned;
      bubble.appendChild(lineEl);
      if (i < lines.length - 1) {
        bubble.appendChild(document.createElement('br'));
      }
    });

    content.appendChild(bubble);

    // Add rating buttons for AI messages
    if (sender === 'ai') {
      var ratingRow = document.createElement('div');
      ratingRow.className = 'rating-buttons';

      var ratings = [
        { text: '😊 Got it', cls: 'got-it', key: 'gotIt' },
        { text: '🤔 Kind of', cls: 'kind-of', key: 'kindOf' },
        { text: '😕 Still confused', cls: 'confused', key: 'confused' }
      ];

      ratings.forEach(function(r) {
        var btn = document.createElement('button');
        btn.className = 'rating-btn ' + r.cls;
        btn.textContent = r.text;
        btn.setAttribute('aria-label', 'Rate: ' + r.text);
        btn.addEventListener('click', function() {
          // Mark as selected
          var siblings = ratingRow.querySelectorAll('.rating-btn');
          siblings.forEach(function(s) { s.classList.remove('selected'); s.disabled = true; });
          btn.classList.add('selected');

          // Update localStorage ratings
          var stored = localStorage.getItem('edusetu_chat_ratings');
          var ratings_data = { gotIt: 0, kindOf: 0, confused: 0 };
          if (stored) {
            try { ratings_data = JSON.parse(stored); } catch(e) { /* ignore */ }
          }
          ratings_data[r.key] = (ratings_data[r.key] || 0) + 1;
          localStorage.setItem('edusetu_chat_ratings', JSON.stringify(ratings_data));

          // Update confidence display
          updateConfidence();
        });
        ratingRow.appendChild(btn);
      });

      content.appendChild(ratingRow);
    }

    msg.appendChild(avatar);
    msg.appendChild(content);
    return msg;
  }

  /* ---------- Create Typing Indicator ---------- */
  function showTyping() {
    var typing = document.createElement('div');
    typing.className = 'typing-indicator';
    typing.id = 'typingIndicator';
    for (var i = 0; i < 3; i++) {
      var dot = document.createElement('div');
      dot.className = 'typing-dot';
      typing.appendChild(dot);
    }
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTyping() {
    var typing = document.getElementById('typingIndicator');
    if (typing) typing.remove();
  }

  /* ---------- Find matching response ---------- */
  function getAIResponse(userText) {
    var text = userText.toLowerCase();
    var responses = RESPONSES[currentLang];

    // Check for keyword matches
    var keywords = {
      'fractions': ['fraction', 'भिन्न', 'numerator', 'denominator', 'अंश', 'हर'],
      'algebraic-expressions': ['algebra', 'algebraic', 'expression', 'बीजीय', 'व्यंजक', 'variable', 'simplify'],
      'linear-equations': ['linear equation', 'solve equation', 'समीकरण', 'रेखीय'],
      'photosynthesis': ['photosynthesis', 'प्रकाश संश्लेषण', 'chlorophyll', 'chloroplast', 'हरित लवक'],
      'active-passive': ['active voice', 'passive voice', 'कर्मवाच्य'],
      'refraction': ['refraction', 'अपवर्तन', 'snell', 'light bend'],
      'acids-bases': ['acid', 'base', 'pH', 'अम्ल', 'क्षार', 'litmus']
    };

    for (var concept in keywords) {
      for (var k = 0; k < keywords[concept].length; k++) {
        if (text.indexOf(keywords[concept][k]) !== -1) {
          return responses[concept] || responses['default'];
        }
      }
    }

    // If no keyword matched, generate a dynamic response for the unknown topic
    return generateSmartResponse(text, currentLang);
  }

  /* ---------- Smart Response Generator for Unknown Topics ---------- */
  function generateSmartResponse(userText, lang) {
    // Extract the topic from common question patterns
    var topic = userText
      .replace(/^(what is|what are|explain|tell me about|how does|how do|how to|define|describe|who is|who was|why is|why do|why does|when did|where is|where do|can you explain|please explain|help me understand|i want to learn|teach me|मुझे बताओ|समझाओ|क्या है|कैसे)\s*/i, '')
      .replace(/[?.!]+$/g, '')
      .trim();

    if (!topic) topic = userText.trim();

    // Capitalize topic nicely
    var topicDisplay = topic.split(' ').map(function(w) {
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');

    // Build a structured educational response
    if (lang === 'hi') {
      return '📘 **' + topicDisplay + '** — अच्छा सवाल!\n\n' +
        'यह एक महत्वपूर्ण विषय है। आइए इसे समझते हैं:\n\n' +
        '**' + topicDisplay + ' क्या है?**\n' +
        'यह एक ऐसा विषय है जो आपकी पढ़ाई में बहुत महत्वपूर्ण है। इसे समझने के लिए, हमें इसके मूल सिद्धांतों को जानना होगा।\n\n' +
        '**मुख्य बिंदु:**\n' +
        '• इस विषय की मूल अवधारणाओं को पहले समझें\n' +
        '• उदाहरणों के साथ अभ्यास करें\n' +
        '• सम्बंधित विषयों से जोड़कर समझें\n' +
        '• नियमित रूप से दोहराते रहें\n\n' +
        '**सुझाव:**\n' +
        '📝 इस विषय पर **Quiz** पेज पर अभ्यास करें\n' +
        '🗺️ **Mastery Map** में इससे जुड़े concepts देखें\n' +
        '🔍 **Explore** पेज पर "' + topicDisplay + '" खोजकर और जानें\n\n' +
        'क्या आप इस विषय पर कोई विशिष्ट सवाल पूछना चाहेंगे? 😊';
    }

    return '📘 **' + topicDisplay + '** — Great question!\n\n' +
      'Let me help you understand this topic.\n\n' +
      '**What is ' + topicDisplay + '?**\n' +
      topicDisplay + ' is an important concept in your studies. Understanding it well will help you build a strong foundation for related topics.\n\n' +
      '**Key things to know about ' + topicDisplay + ':**\n' +
      '• Start by understanding the basic definition and core principles\n' +
      '• Look at real-world examples to see how it applies\n' +
      '• Practice problems from simple to complex\n' +
      '• Connect it with related concepts you already know\n' +
      '• Use diagrams or visual aids when possible\n\n' +
      '**Study Tips:**\n' +
      '📝 Head to the **Quiz** page to test your understanding\n' +
      '🗺️ Check the **Mastery Map** to see how this connects with other concepts\n' +
      '🔍 Search "' + topicDisplay + '" on the **Explore** page for detailed key points and resources\n\n' +
      '**Want to go deeper?** Try asking me something specific like:\n' +
      '• "What are the key formulas for ' + topicDisplay + '?"\n' +
      '• "Give me an example of ' + topicDisplay + '"\n' +
      '• "Why is ' + topicDisplay + ' important?"\n\n' +
      'I\'m here to help you master this! 💪';
  }

  /* ---------- Send Message ---------- */
  function sendMessage(text) {
    if (!text || !text.trim()) return;
    text = text.trim();

    // Add user message
    var userMsg = createMessageEl(text, 'user');
    chatMessages.appendChild(userMsg);
    chatInput.value = '';

    chatHistory.push({ sender: 'user', text: text });

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Disable input while waiting
    chatInput.disabled = true;
    chatSend.disabled = true;

    // Show typing
    showTyping();

    // Try Grok API first, fallback to local mock
    callGrokAPI(text, function(response, isGrok) {
      hideTyping();

      var aiMsg = createMessageEl(response, 'ai');
      chatMessages.appendChild(aiMsg);

      chatHistory.push({ sender: 'ai', text: response });

      chatMessages.scrollTop = chatMessages.scrollHeight;

      // Re-enable input
      chatInput.disabled = false;
      chatSend.disabled = false;
      chatInput.focus();
    });
  }

  /* ---------- Call Grok API via Backend Proxy ---------- */
  function callGrokAPI(userText, callback) {
    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        language: currentLang
      })
    })
    .then(function(res) {
      return res.json().then(function(data) {
        return { status: res.status, data: data };
      });
    })
    .then(function(result) {
      if (result.status === 200 && result.data.reply) {
        // Grok API success
        callback(result.data.reply, true);
      } else {
        // API error — fallback to local response
        var fallback = getAIResponse(userText);
        callback(fallback, false);
      }
    })
    .catch(function() {
      // Network error — fallback to local response
      var fallback = getAIResponse(userText);
      callback(fallback, false);
    });
  }

  /* ---------- Event Listeners ---------- */
  chatSend.addEventListener('click', function() {
    sendMessage(chatInput.value);
  });

  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  // Language toggle
  btnEN.addEventListener('click', function() {
    currentLang = 'en';
    btnEN.classList.add('active');
    btnHI.classList.remove('active');
    chatInput.placeholder = 'Ask me anything about your studies...';
  });

  btnHI.addEventListener('click', function() {
    currentLang = 'hi';
    btnHI.classList.add('active');
    btnEN.classList.remove('active');
    chatInput.placeholder = 'अपनी पढ़ाई के बारे में कुछ भी पूछें...';
  });

  /* ---------- Init ---------- */
  function init() {
    updateConfidence();

    // Welcome message
    var welcomeText = currentLang === 'hi'
      ? 'नमस्ते! 👋 मैं आपका AI शिक्षक हूँ। आप मुझसे गणित, विज्ञान, अंग्रेज़ी, या किसी भी विषय पर सवाल पूछ सकते हैं। मैं हिंदी और अंग्रेज़ी दोनों में मदद कर सकता हूँ!'
      : 'Hello! 👋 I\'m your AI Tutor. Ask me any question about Math, Science, English, or any other subject. I\'ll explain step-by-step in a way that makes sense for your grade level.\n\nTry asking:\n• "Explain fractions"\n• "How does photosynthesis work?"\n• "What is active voice?"';

    var welcomeMsg = createMessageEl(welcomeText, 'ai');
    chatMessages.appendChild(welcomeMsg);

    // Check for concept or topic URL param
    var concept = EduSetu.getUrlParam('concept');
    var topic = EduSetu.getUrlParam('topic');
    var starterTopic = concept ? EduSetu.formatConceptName(concept) : (topic || '');

    if (starterTopic) {
      var starterText = currentLang === 'hi'
        ? starterTopic + ' समझाओ'
        : 'Explain ' + starterTopic;

      setTimeout(function() {
        sendMessage(starterText);
      }, 500);
    }
  }

  init();

})();
