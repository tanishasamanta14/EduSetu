/* ============================================================
   EduSetu — AI Tutor Client Engine (Production Socratic AI)
   Zero-mock architecture connecting to Grok API & Supabase
   ============================================================ */

(function() {
  'use strict';

  /* ---------- Application State ---------- */
  let currentConversationId = null;
  let currentLang = 'en';
  let currentUser = null;
  let isSending = false;
  let lastFailedMessage = null;

  /* ---------- DOM References ---------- */
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const headerNewChatBtn = document.getElementById('headerNewChatBtn');
  const sidebarNewChatBtn = document.getElementById('sidebarNewChatBtn');
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const chatSidebar = document.getElementById('chatSidebar');
  const historyList = document.getElementById('historyList');
  const studentContextText = document.getElementById('studentContextText');
  const chatErrorBanner = document.getElementById('chatErrorBanner');
  const chatErrorMessage = document.getElementById('chatErrorMessage');
  const chatErrorRetryBtn = document.getElementById('chatErrorRetryBtn');
  const charCount = document.getElementById('charCount');

  /* ---------- 1. Safe HTML & Markdown Parser ---------- */
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderFormattedContent(rawText) {
    if (!rawText) return '';

    // First escape raw HTML
    let text = escapeHTML(rawText);

    // Code blocks ```code```
    text = text.replace(/```([\s\S]*?)```/g, function(match, p1) {
      return '<pre style="background:rgba(0,0,0,0.4); padding:10px 14px; border-radius:8px; overflow-x:auto; margin:8px 0; border:1px solid rgba(255,255,255,0.06); font-family:monospace; font-size:0.85em;"><code>' + p1 + '</code></pre>';
    });

    // Inline code `code`
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold **text**
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Italic *text*
    text = text.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');

    // Bullet points (lines starting with • or - or *)
    const lines = text.split('\n');
    let formattedLines = [];
    let inList = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('• ') || line.startsWith('- ') || line.startsWith('* ')) {
        if (!inList) {
          formattedLines.push('<ul>');
          inList = true;
        }
        formattedLines.push('<li>' + line.substring(2) + '</li>');
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        if (line) {
          formattedLines.push('<p>' + line + '</p>');
        }
      }
    }
    if (inList) {
      formattedLines.push('</ul>');
    }

    return formattedLines.join('');
  }

  /* ---------- 2. Message Bubble Factory ---------- */
  function createMessageEl(text, sender, timestamp) {
    const msg = document.createElement('div');
    msg.className = 'message ' + sender;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'assistant' || sender === 'ai' ? '🤖' : '👤';

    const content = document.createElement('div');
    content.className = 'message-content';

    const meta = document.createElement('div');
    meta.className = 'message-meta';
    const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    meta.textContent = (sender === 'assistant' || sender === 'ai' ? 'EduSetu AI Tutor · ' : 'You · ') + timeStr;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = renderFormattedContent(text);

    content.appendChild(meta);
    content.appendChild(bubble);

    // Follow-up pedagogical reflection buttons on AI responses
    if (sender === 'assistant' || sender === 'ai') {
      const reflectionRow = document.createElement('div');
      reflectionRow.className = 'rating-buttons';

      const options = [
        { label: '😊 Got it clearly', prompt: 'I understand this now! Can we try a practice question?' },
        { label: '💡 Give an example', prompt: 'Can you give me another simple real-world example of this?' },
        { label: '🤔 Explain step-by-step', prompt: 'Could you break down the first step in more detail?' }
      ];

      options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'rating-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', function() {
          btn.classList.add('selected');
          reflectionRow.querySelectorAll('.rating-btn').forEach(b => {
            if (b !== btn) b.disabled = true;
          });
          sendMessage(opt.prompt);
        });
        reflectionRow.appendChild(btn);
      });

      content.appendChild(reflectionRow);
    }

    msg.appendChild(avatar);
    msg.appendChild(content);
    return msg;
  }

  /* ---------- 3. Typing Indicator ---------- */
  function showTypingIndicator() {
    hideTypingIndicator();

    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'activeTypingIndicator';

    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'typing-dots-wrap';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'typing-dot';
      dotsWrap.appendChild(dot);
    }

    const label = document.createElement('span');
    label.className = 'typing-label';
    label.textContent = 'AI Tutor is thinking...';

    indicator.appendChild(dotsWrap);
    indicator.appendChild(label);

    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function hideTypingIndicator() {
    const existing = document.getElementById('activeTypingIndicator');
    if (existing) existing.remove();
  }

  /* ---------- 4. Starter Welcome Card ---------- */
  function renderStarterCard() {
    chatMessages.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'chat-welcome-card';

    const studentName = currentUser ? currentUser.name : 'Student';
    const gradeVal = currentUser ? currentUser.grade : 8;

    const title = `Hello ${studentName}! 👋 I'm your Socratic AI Tutor`;

    const desc = `Ask any doubt or question from your Class ${gradeVal} syllabus. Rather than just giving answers, I'll guide you step-by-step so you truly master the concept.`;

    const chips = [
      { text: '🌱 What is Photosynthesis?', val: 'What is photosynthesis and how do plants make glucose?' },
      { text: '📐 Explain Adding Fractions', val: 'Why do we need a common denominator to add fractions like 1/2 and 1/3?' },
      { text: '⚡ How to Solve Linear Equations?', val: 'Explain step-by-step how to solve a linear equation like 2x + 5 = 15.' },
      { text: '💡 Newton\'s 3rd Law of Motion', val: 'Explain Newton\'s Third Law of Motion with everyday examples.' }
    ];

    let chipsHTML = chips.map((c, idx) => 
      `<button type="button" class="starter-chip" data-idx="${idx}">${c.text}</button>`
    ).join('');

    card.innerHTML = `
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="starter-chips-grid">
        ${chipsHTML}
      </div>
    `;

    chatMessages.appendChild(card);

    // Bind chips
    card.querySelectorAll('.starter-chip').forEach(chipBtn => {
      chipBtn.addEventListener('click', function() {
        const idx = Number(this.getAttribute('data-idx'));
        if (chips[idx]) {
          sendMessage(chips[idx].val);
        }
      });
    });
  }

  /* ---------- 5. Send Message (Real Grok API via Backend) ---------- */
  async function sendMessage(text) {
    if (isSending) return;
    const cleanText = (text || '').trim();
    if (!cleanText) return;

    // Clear welcome card if present
    const welcomeCard = chatMessages.querySelector('.chat-welcome-card');
    if (welcomeCard) welcomeCard.remove();

    // Hide previous error banner
    hideErrorBanner();

    // Render user message immediately
    const userMsgEl = createMessageEl(cleanText, 'user');
    chatMessages.appendChild(userMsgEl);
    chatInput.value = '';
    adjustTextareaHeight();
    updateCharCount();

    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Lock controls
    isSending = true;
    chatSend.disabled = true;
    chatInput.disabled = true;
    showTypingIndicator();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          message: cleanText,
          conversationId: currentConversationId,
          language: currentLang
        })
      });

      const result = await response.json();
      hideTypingIndicator();

      if (response.ok && result.success && result.data && result.data.reply) {
        // Successful real AI response
        const aiMsgEl = createMessageEl(result.data.reply, 'assistant');
        chatMessages.appendChild(aiMsgEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Track active conversation ID
        if (result.data.conversationId) {
          currentConversationId = result.data.conversationId;
        }

        // Refresh conversation history in sidebar
        loadConversationHistory();
      } else {
        // Server or API error
        const errorMsg = result.message || 'AI Tutor service is temporarily unavailable. Please try again.';
        showErrorBanner(errorMsg, cleanText);
      }
    } catch (netErr) {
      console.error('[AI Tutor] Network request failure:', netErr);
      hideTypingIndicator();
      showErrorBanner('Could not connect to EduSetu server. Check your connection.', cleanText);
    } finally {
      isSending = false;
      chatSend.disabled = false;
      chatInput.disabled = false;
      chatInput.focus();
    }
  }

  /* ---------- 6. Error Banner Handling ---------- */
  function showErrorBanner(msg, failedText) {
    lastFailedMessage = failedText;
    chatErrorMessage.textContent = msg;
    chatErrorBanner.style.display = 'flex';
  }

  function hideErrorBanner() {
    chatErrorBanner.style.display = 'none';
    lastFailedMessage = null;
  }

  chatErrorRetryBtn.addEventListener('click', function() {
    if (lastFailedMessage) {
      const textToRetry = lastFailedMessage;
      hideErrorBanner();
      sendMessage(textToRetry);
    }
  });

  /* ---------- 7. Conversation History Management (Supabase) ---------- */
  async function loadConversationHistory() {
    try {
      const res = await fetch('/api/chat/conversations', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      if (!res.ok) {
        historyList.innerHTML = '<div class="history-empty-state">Sign in to save and review past sessions.</div>';
        return;
      }

      const result = await res.json();
      if (!result.success || !Array.isArray(result.data.conversations) || result.data.conversations.length === 0) {
        historyList.innerHTML = '<div class="history-empty-state">No previous sessions yet. Ask your first doubt!</div>';
        return;
      }

      historyList.innerHTML = '';
      result.data.conversations.forEach(conv => {
        const item = document.createElement('div');
        item.className = 'history-item' + (conv.id === currentConversationId ? ' active' : '');
        item.setAttribute('data-id', conv.id);

        const textSpan = document.createElement('span');
        textSpan.className = 'history-item-text';
        textSpan.textContent = conv.title || 'Learning Session';

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.className = 'history-item-delete';
        delBtn.textContent = '✕';
        delBtn.title = 'Delete session';

        delBtn.addEventListener('click', async function(e) {
          e.stopPropagation();
          if (confirm('Delete this conversation session?')) {
            await deleteSession(conv.id);
          }
        });

        item.appendChild(textSpan);
        item.appendChild(delBtn);

        item.addEventListener('click', function() {
          loadSession(conv.id);
        });

        historyList.appendChild(item);
      });

    } catch (e) {
      console.warn('Failed to load conversation history:', e);
      historyList.innerHTML = '<div class="history-empty-state">Could not load session history.</div>';
    }
  }

  async function loadSession(conversationId) {
    if (isSending) return;

    try {
      showTypingIndicator();
      const res = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      hideTypingIndicator();
      if (!res.ok) return;

      const result = await res.json();
      if (result.success && result.data && result.data.conversation) {
        currentConversationId = result.data.conversation.id;
        const messages = result.data.conversation.messages || [];

        chatMessages.innerHTML = '';
        messages.forEach(m => {
          const sender = (m.role === 'user') ? 'user' : 'assistant';
          const msgEl = createMessageEl(m.content, sender, m.timestamp);
          chatMessages.appendChild(msgEl);
        });

        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Highlight active session in sidebar
        historyList.querySelectorAll('.history-item').forEach(el => {
          if (el.getAttribute('data-id') === currentConversationId) {
            el.classList.add('active');
          } else {
            el.classList.remove('active');
          }
        });

        // Close sidebar on mobile after selection
        chatSidebar.classList.remove('open');
      }
    } catch (e) {
      hideTypingIndicator();
      console.error('Failed to load session:', e);
    }
  }

  async function deleteSession(conversationId) {
    try {
      const res = await fetch(`/api/chat/conversations/${conversationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (res.ok) {
        if (currentConversationId === conversationId) {
          startNewChat();
        } else {
          loadConversationHistory();
        }
      }
    } catch (e) {
      console.error('Delete session error:', e);
    }
  }

  function startNewChat() {
    currentConversationId = null;
    historyList.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
    renderStarterCard();
    hideErrorBanner();
    chatSidebar.classList.remove('open');
    chatInput.focus();
  }

  /* ---------- 8. Textarea Autoresize & Input Helpers ---------- */
  function adjustTextareaHeight() {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
  }

  function updateCharCount() {
    const len = chatInput.value.length;
    charCount.textContent = `${len}/2000`;
  }

  chatInput.addEventListener('input', function() {
    adjustTextareaHeight();
    updateCharCount();
  });

  chatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput.value);
    }
  });

  chatSend.addEventListener('click', function() {
    sendMessage(chatInput.value);
  });

  /* ---------- 9. Sidebar and Button Listeners ---------- */
  headerNewChatBtn.addEventListener('click', startNewChat);
  sidebarNewChatBtn.addEventListener('click', startNewChat);

  sidebarToggleBtn.addEventListener('click', function() {
    chatSidebar.classList.toggle('open');
  });



  /* ---------- 10. Initialization ---------- */
  async function init() {
    // 10.1 Check active Supabase authentication session
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Accept': 'application/json' },
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data && data.data.user) {
          currentUser = data.data.user;
          const gradeStr = currentUser.grade ? `Class ${currentUser.grade}` : 'Class 8';
          studentContextText.textContent = `${currentUser.name} · ${gradeStr} · Socratic Calibrated`;
        }
      }
    } catch (e) {
      console.warn('Auth check silent info:', e);
    }

    // 10.2 Render initial starter view
    renderStarterCard();

    // 10.3 Load past session history from Supabase
    loadConversationHistory();

    // 10.4 Support deep-link params (?topic=... or ?concept=...)
    const params = new URLSearchParams(window.location.search);
    const concept = params.get('concept');
    const topic = params.get('topic');
    const starterPrompt = concept ? `Explain the concept of ${concept} step-by-step.` : (topic ? `Can you explain ${topic}?` : '');

    if (starterPrompt) {
      setTimeout(() => {
        sendMessage(starterPrompt);
      }, 400);
    }
  }

  init();

})();
