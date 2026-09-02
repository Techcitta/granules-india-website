/**
 * Granules India AI Chatbot Widget
 * Standalone vanilla JS — no framework dependencies.
 * Drop this script into any page to enable the chatbot.
 */
(function () {
  'use strict';

  const API_URL = '/api/chat';
  const GREETINGS = [
    'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
    'how are you', "what's up", 'sup', 'yo', 'hii', 'helo', 'hiiii',
    'good day', 'greetings', 'howdy', 'hi there', 'hello there',
  ];

  // Map section names to page URLs with anchors
  const SECTION_URLS = {
    // HomePage sections (use hash anchors)
    'business': '/#business',
    'sustainability': '/#sustainability',
    'investor': '/#investor',
    'media': '/#media',
    'careers': '/#careers',
    'about': '/#about',
    'presence': '/#presence',
    // Page routes
    'homepage': '/',
    'overview': '/company',
    'purpose': '/company',
    'values': '/company',
    'subsidiaries': '/company',
    'milestones': '/company/milestone',
    'leadership': '/company/leadership',
    'awards': '/company/awards',
    'facilities': '/company/facilities',
    'facilities-detail': '/company/facilities',
    'ops': '/company/operational-excellence',
    'czro': '/company/granules-czro',
    'gls': '/company/granules-life-sciences',
    'ascelis': '/company/ascelis-peptides',
    'api': '/business/api',
    'pfi': '/business/pfi',
    'fd': '/business/fd',
    'rd': '/business/rd',
    'quality': '/business/quality-compliance',
    'peptides': '/business/peptides',
    'strategy': '/sustainability/strategy',
    'esg': '/sustainability/esg-in-action',
    'community': '/sustainability/esg-in-action/community',
    'annual-reports': '/investor/annual-reports',
    'opportunities': '/careers/opportunities',
    'life': '/careers/life-at-granules',
    'contact': '/contact',
  };

  function getSourceUrl(src) {
    if (src.route && src.section) {
      const sectionUrl = SECTION_URLS[src.section];
      if (sectionUrl) return sectionUrl;
    }
    if (src.route) return src.route;
    return null;
  }

  /* ── helpers ────────────────────────────────────────────────────────── */

  function isGreeting(text) {
    return GREETINGS.includes(text.trim().toLowerCase().replace(/[!.]+$/, ''));
  }

  function renderMarkdown(text) {
    let html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[Source: (.*?)\]/g, '<span class="gw-chat-citation">[$1]</span>')
      .replace(/^- (.*)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/gs, (m) => '<ul>' + m + '</ul>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br/>');
    return '<p>' + html + '</p>';
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function uid(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
  }

  /* ── source card ────────────────────────────────────────────────────── */

  function sourceCardHTML(src) {
    const isPdf = src.source_type === 'pdf';
    const icon = isPdf
      ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>'
      : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

    let meta = '';
    if (isPdf && src.file_path) {
      const display = src.file_path.replace('public/', '/').replace('pdfs/', '');
      const page = src.page_number ? ' — Page ' + src.page_number : '';
      meta = '<a href="/' + display + '" target="_blank" rel="noopener noreferrer" class="gw-chat-source-file-link">' + escapeHtml(display) + page + '</a>';
    } else if (isPdf && src.filename) {
      const page = src.page_number ? ' — Page ' + src.page_number : '';
      meta = '<span class="gw-chat-source-file-link">' + escapeHtml(src.filename) + page + '</span>';
    } else if (!isPdf) {
      const url = getSourceUrl(src);
      if (url) {
        const highlightParam = src.section ? '?highlight=' + encodeURIComponent(src.section) : '';
        meta = '<a href="' + escapeHtml(url) + highlightParam + '" class="gw-chat-source-file-link">View on website</a>';
      } else {
        meta = '<span class="gw-chat-source-file-link">Website Content</span>';
      }
    }

    let proof = '';
    if (src.proof) {
      proof = '<div class="gw-chat-source-proof"><span class="gw-chat-source-proof-label">Proof:</span> "' + escapeHtml(src.proof) + '"</div>';
    } else if (src.snippet) {
      proof = '<span class="gw-chat-source-snippet">"' + escapeHtml(src.snippet) + '"</span>';
    }

    return (
      '<div class="gw-chat-source-card">' +
        '<div class="gw-chat-source-icon">' + icon + '</div>' +
        '<div class="gw-chat-source-info">' +
          '<span class="gw-chat-source-title">' + escapeHtml(src.title) + '</span>' +
          meta +
          proof +
        '</div>' +
      '</div>'
    );
  }

  /* ── message row ────────────────────────────────────────────────────── */

  function messageHTML(msg) {
    const isUser = msg.role === 'user';
    const cls = isUser ? 'gw-chat-msg-user' : 'gw-chat-msg-bot';

    const avatar = isUser
      ? ''
      : '<div class="gw-chat-msg-avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a1 1 0 0 1-.73.27H16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1H2.73a1 1 0 0 1-.73-.27H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>';

    let bubble;
    if (isUser) {
      bubble = '<div class="gw-chat-msg-bubble gw-chat-msg-bubble-user">' + escapeHtml(msg.content) + '</div>';
    } else {
      bubble = '<div class="gw-chat-msg-bubble gw-chat-msg-bubble-bot">' + renderMarkdown(msg.content) + '</div>';
    }

    let sources = '';
    if (!isUser && msg.sources && msg.sources.length) {
      sources = '<div class="gw-chat-sources"><span class="gw-chat-sources-label">Sources:</span>';
      for (const s of msg.sources) sources += sourceCardHTML(s);
      sources += '</div>';
    }

    return '<div class="gw-chat-msg ' + cls + '">' + avatar + '<div class="gw-chat-msg-content">' + bubble + sources + '</div></div>';
  }

  /* ── typing indicator ───────────────────────────────────────────────── */

  const TYPING_HTML = '<div class="gw-chat-typing" id="gw-chat-typing"><span></span><span></span><span></span></div>';

  /* ── build DOM ──────────────────────────────────────────────────────── */

  function buildWidget() {
    // CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/chatbot.css';
    document.head.appendChild(link);

    // Bubble
    const bubble = document.createElement('button');
    bubble.className = 'gw-chat-bubble';
    bubble.id = 'gw-chat-bubble';
    bubble.setAttribute('aria-label', 'Open AI assistant');
    bubble.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>' +
      '</svg>';
    document.body.appendChild(bubble);

    // Panel
    const panel = document.createElement('div');
    panel.className = 'gw-chat-panel';
    panel.id = 'gw-chat-panel';
    panel.style.display = 'none';
    panel.innerHTML =
      '<div class="gw-chat-header">' +
        '<div class="gw-chat-header-info">' +
          '<div class="gw-chat-avatar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.27a1 1 0 0 1-.73.27H16v1a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-1H2.73a1 1 0 0 1-.73-.27H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"/></svg></div>' +
          '<div><h3 class="gw-chat-title">Granules AI</h3><span class="gw-chat-subtitle">Ask anything about Granules India</span></div>' +
        '</div>' +
        '<button class="gw-chat-close" id="gw-chat-close" aria-label="Close chat">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="gw-chat-messages" id="gw-chat-messages"></div>' +
      '<div class="gw-chat-input-area">' +
        '<input type="text" class="gw-chat-input" id="gw-chat-input" placeholder="Ask about Granules India..." />' +
        '<button class="gw-chat-send" id="gw-chat-send" aria-label="Send message">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>';
    document.body.appendChild(panel);

    return { bubble, panel };
  }

  /* ── state ──────────────────────────────────────────────────────────── */

  const messages = [];
  let isOpen = false;
  let isLoading = false;

  function addMessage(role, content, sources) {
    const msg = { id: uid(role === 'user' ? 'user' : 'bot'), role, content, sources: sources || [] };
    messages.push(msg);
    return msg;
  }

  function renderMessages() {
    const container = document.getElementById('gw-chat-messages');
    if (!container) return;
    container.innerHTML = messages.map(messageHTML).join('');
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('gw-chat-messages');
    if (!container) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = TYPING_HTML;
    container.appendChild(tmp.firstElementChild);
    container.scrollTop = container.scrollHeight;
  }

  function hideTyping() {
    const el = document.getElementById('gw-chat-typing');
    if (el) el.remove();
  }

  /* ── send ───────────────────────────────────────────────────────────── */

  async function sendMessage() {
    const input = document.getElementById('gw-chat-input');
    const text = input.value.trim();
    if (!text || isLoading) return;

    input.value = '';
    isLoading = true;
    updateSendButton();

    addMessage('user', text);
    renderMessages();

    if (isGreeting(text)) {
      addMessage('assistant', 'Hello! How can I assist you with information about Granules India Limited today?');
      renderMessages();
      isLoading = false;
      updateSendButton();
      return;
    }

    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();

      hideTyping();
      addMessage('assistant', data.answer || data.error || 'Sorry, I could not process your request.', data.sources || []);
      renderMessages();
    } catch {
      hideTyping();
      addMessage('assistant', 'Something went wrong. Please make sure the backend server is running and try again.');
      renderMessages();
    } finally {
      isLoading = false;
      updateSendButton();
    }
  }

  function updateSendButton() {
    const btn = document.getElementById('gw-chat-send');
    const input = document.getElementById('gw-chat-input');
    if (btn) btn.disabled = !input.value.trim() || isLoading;
  }

  /* ── wire events ────────────────────────────────────────────────────── */

  function init() {
    const { bubble, panel } = buildWidget();
    const messagesEl = document.getElementById('gw-chat-messages');
    const input = document.getElementById('gw-chat-input');
    const sendBtn = document.getElementById('gw-chat-send');
    const closeBtn = document.getElementById('gw-chat-close');

    // Welcome message
    addMessage(
      'assistant',
      "Hello! I'm Granules India's AI assistant. I can answer questions about our company, products, sustainability, investor information, and more. How can I help you today?"
    );
    renderMessages();

    // Toggle
    bubble.addEventListener('click', () => {
      isOpen = !isOpen;
      panel.style.display = isOpen ? 'flex' : 'none';
      bubble.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open AI assistant');
      bubble.innerHTML = isOpen
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      if (isOpen) input.focus();
    });

    closeBtn.addEventListener('click', () => {
      isOpen = false;
      panel.style.display = 'none';
      bubble.setAttribute('aria-label', 'Open AI assistant');
      bubble.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    });

    // Send
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    input.addEventListener('input', updateSendButton);
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
