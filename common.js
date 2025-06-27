window.addEventListener('DOMContentLoaded',()=>{
  // Loader fade out
  const loader = document.getElementById('loader');
  if(loader) {
    setTimeout(()=>{
      loader.style.opacity = 0;
      setTimeout(()=>{loader.style.display='none';},500);
    },1200);
  }

  // Navbar active link
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link=>{
    if(window.location.pathname.endsWith(link.getAttribute('href'))) link.classList.add('active');
    link.addEventListener('click',()=>{
      links.forEach(l=>l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Feature card scroll animation
  const cards = document.querySelectorAll('.feature-card');
  const reveal = ()=>{
    cards.forEach(card=>{
      const rect = card.getBoundingClientRect();
      if(rect.top < window.innerHeight-60) card.classList.add('visible');
    });
  };
  window.addEventListener('scroll', reveal);
  reveal();

  // Dark mode toggle
  const darkBtn = document.getElementById('darkModeToggle');
  const setDark = (on)=>{
    if(on) document.body.classList.add('dark');
    else document.body.classList.remove('dark');
    localStorage.setItem('fundflow_dark',on?'1':'0');
  };
  if(darkBtn) {
    darkBtn.addEventListener('click',()=>{
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('fundflow_dark',isDark?'1':'0');
    });
  }
  // On load, apply saved theme
  if(localStorage.getItem('fundflow_dark')==='1') document.body.classList.add('dark');
});

// FlowiseAI Chatbot Integration
window.injectChatbot = function(opts = {}) {
  if (document.getElementById('ff-chatbot-btn')) return; // Prevent duplicates
  // Floating button
  const btn = document.createElement('button');
  btn.id = 'ff-chatbot-btn';
  let positionClass = opts.position === 'bottom-left' ? 'left-8' : 'right-8';
  btn.className = `fixed bottom-8 ${positionClass} z-50 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-full p-4 shadow-lg hover:scale-110 transition flex items-center justify-center w-16 h-16`;
  btn.innerHTML = '<span class="text-2xl">🤖</span>';
  document.body.appendChild(btn);

  // Modal
  const modal = document.createElement('div');
  modal.id = 'ff-chatbot-modal';
  modal.className = 'fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm hidden';
  modal.innerHTML = `
    <div class="glass-card w-full max-w-md mx-auto rounded-2xl shadow-2xl p-4 border-2 border-cyan-400/40 flex flex-col bg-gradient-to-br from-cyan-900/80 to-fuchsia-900/80">
      <div class="flex justify-between items-center mb-2">
        <span class="font-bold text-cyan-200">MoneyMate AI</span>
        <button id="ff-chatbot-close" class="text-cyan-400 hover:text-fuchsia-400 text-xl">&times;</button>
      </div>
      <div id="ff-chatbot-messages" class="flex-1 overflow-y-auto max-h-64 mb-2 space-y-2"></div>
      <form id="ff-chatbot-form" class="flex gap-2 mt-2">
        <input id="ff-chatbot-input" type="text" required placeholder="Ask me anything..." class="flex-1 rounded-lg px-3 py-2 bg-black/40 text-cyan-100 border border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-fuchsia-400" />
        <button class="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white rounded-lg px-4 py-2 font-bold hover:from-cyan-400 hover:to-fuchsia-400 transition">Send</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  btn.onclick = () => { modal.classList.remove('hidden'); };
  modal.querySelector('#ff-chatbot-close').onclick = () => { modal.classList.add('hidden'); };

  // Chat logic
  const messages = modal.querySelector('#ff-chatbot-messages');
  const form = modal.querySelector('#ff-chatbot-form');
  const input = modal.querySelector('#ff-chatbot-input');

  async function query(data) {
    const response = await fetch(
      "https://cloud.flowiseai.com/api/v1/prediction/daf0b9e7-15c9-4133-bee0-68eafc4939a8",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const result = await response.json();
    return result;
  }

  form.onsubmit = async (e) => {
    e.preventDefault();
    const userMsg = input.value.trim();
    if (!userMsg) return;
    // Show user message
    const userDiv = document.createElement('div');
    userDiv.className = 'text-right';
    userDiv.innerHTML = `<span class='inline-block bg-cyan-700/80 text-white rounded-lg px-3 py-1 mb-1'>${userMsg}</span>`;
    messages.appendChild(userDiv);
    messages.scrollTop = messages.scrollHeight;
    input.value = '';
    // Show loading
    const botDiv = document.createElement('div');
    botDiv.className = 'text-left';
    botDiv.innerHTML = `<span class='inline-block bg-fuchsia-700/80 text-white rounded-lg px-3 py-1 mb-1 animate-pulse'>...</span>`;
    messages.appendChild(botDiv);
    messages.scrollTop = messages.scrollHeight;
    // Query API
    try {
      const res = await query({ question: userMsg });
      botDiv.innerHTML = `<span class='inline-block bg-fuchsia-700/80 text-white rounded-lg px-3 py-1 mb-1'>${res.text || 'Sorry, I could not understand.'}</span>`;
    } catch (err) {
      botDiv.innerHTML = `<span class='inline-block bg-fuchsia-700/80 text-white rounded-lg px-3 py-1 mb-1'>Error: Could not reach AI.</span>`;
    }
    messages.scrollTop = messages.scrollHeight;
  };
};
// Placeholder for future shared logic 