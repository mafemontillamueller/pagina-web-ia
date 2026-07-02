(function () {
  // ── CONFIG ────────────────────────────────────────────────────────────────
  var WA_NUMBER = "34617927277";
  var CALENDLY  = "https://calendly.com/mariamontillamuelle/30min";
  var DELAY_MIN = 600;   // ms typing delay min
  var DELAY_MAX = 1400;  // ms typing delay max
  var OPEN_AFTER = 12000; // ms before auto-greeting

  // ── KNOWLEDGE BASE ────────────────────────────────────────────────────────
  var KB = [
    {
      keys: ["hola","buenos","buenas","hey","hi","saludos","qué tal","ola"],
      answer: "¡Hola! Soy el asistente de GlowLabs 👋 Estoy aquí para resolver tus dudas sobre cómo podemos automatizar tu negocio con IA. ¿En qué te puedo ayudar?"
    },
    {
      keys: ["qué hacéis","qué hacen","qué es glowlabs","a qué se dedican","qué ofrecen","de qué trata","qué son"],
      answer: "GlowLabs instala el **sistema operativo completo** de tu empresa. Automatizamos toda la operación comercial con Inteligencia Artificial: desde el primer contacto con un cliente hasta que vuelve a comprar. Captación, atención, ventas, seguimiento y fidelización — todo conectado y funcionando solo. ¿Quieres saber más sobre algún servicio en concreto?"
    },
    {
      keys: ["servicios","servicio","qué incluye","qué hacéis exactamente","qué ofrecéis"],
      answer: "Tenemos 4 bloques principales:\n\n**1. Sistema Comercial Inteligente** — Asistentes IA para WhatsApp, Instagram y voz, CRM, agendamiento automático, calificación de leads.\n\n**2. Automatización de Ventas** — Seguimientos, propuestas, pagos y documentos automáticos.\n\n**3. Crecimiento y Marketing** — Embudos, email/WhatsApp marketing, fidelización, membresías.\n\n**4. Soluciones a Medida** — Apps, portales, dashboards y agentes IA propios.\n\n¿Cuál encaja mejor con lo que necesitas?"
    },
    {
      keys: ["precio","cuesta","coste","cuánto vale","cuánto cobran","tarifa","presupuesto","inversión"],
      answer: "El precio varía según el proyecto — no tiene sentido darte un número sin entender antes tu negocio. Lo que hacemos primero es un **diagnóstico gratuito** para ver dónde hay más oportunidad y qué sistema tiene más sentido para ti. ¿Te agendamos una llamada de 30 minutos?"
    },
    {
      keys: ["cómo funciona","proceso","cómo trabajáis","metodología","pasos","etapas"],
      answer: "El proceso es muy directo:\n\n**1. Diagnóstico** — Analizamos tu operación actual y detectamos los cuellos de botella.\n\n**2. Diseño** — Creamos la arquitectura exacta de automatización para tu negocio.\n\n**3. Implementación** — Instalamos todo conectado y probado.\n\n**4. Seguimiento** — Medimos resultados y optimizamos.\n\nLos primeros resultados suelen verse en las primeras 2-4 semanas. ¿Empezamos con el diagnóstico?"
    },
    {
      keys: ["tiempo","cuánto tarda","plazo","cuándo","rapidez","semanas","meses"],
      answer: "Depende del alcance, pero los primeros sistemas suelen estar operativos en **2 a 4 semanas**. Un proyecto completo de automatización normalmente tarda entre 4 y 8 semanas desde el diagnóstico hasta la entrega. ¿Tienes alguna urgencia en particular?"
    },
    {
      keys: ["whatsapp","instagram","redes","canal","chatbot","bot","asistente"],
      answer: "Sí, trabajamos con todos los canales donde están tus clientes: **WhatsApp, Instagram, chat web, email y voz**. Instalamos asistentes con IA que responden al instante, califican leads y agendan reuniones — 24/7, sin que tu equipo tenga que hacer nada. ¿Tienes WhatsApp Business activo?"
    },
    {
      keys: ["crm","clientes","leads","contactos","gestión","pipeline","seguimiento"],
      answer: "Exacto — parte de lo que instalamos es un **CRM centralizado** donde llegan todos tus leads, organizados por canal y estado. El sistema los califica automáticamente, asigna al comercial correcto y lanza los seguimientos sin intervención humana. ¿Cuántos leads recibes aproximadamente al mes?"
    },
    {
      keys: ["resultados","métricas","roi","retorno","cuánto mejora","ejemplos","casos"],
      answer: "Los resultados más comunes que vemos:\n\n— **−70%** de carga operativa manual\n— **×3** más consistencia en generación de leads\n— **+85%** de eficiencia en ventas\n— Tiempo de respuesta a leads: de horas a **segundos**\n\n¿Quieres que calculemos el potencial específico para tu negocio?"
    },
    {
      keys: ["calculadora","calcular","cuánto pierdo","potencial","roi"],
      answer: "Tenemos una calculadora de ROI gratuita donde puedes ver exactamente cuántos leads pierdes y cuánto dinero deja tu empresa sobre la mesa cada mes. ¿La probamos? → <a href='/calculadora' style='color:#a78bfa;text-decoration:underline'>Ver calculadora</a>"
    },
    {
      keys: ["contacto","llamada","reunión","hablar","agendar","cita","agenda","calendly"],
      answer: "¡Perfecto! Puedes agendar una llamada de diagnóstico gratuita de 30 minutos directamente aquí 👇\n\n<a href='" + CALENDLY + "' target='_blank' style='color:#a78bfa;text-decoration:underline'>Agendar diagnóstico gratuito →</a>\n\nO si prefieres, escríbenos por WhatsApp y te respondemos enseguida."
    },
    {
      keys: ["gracias","perfecto","genial","bien","ok","vale","entendido","claro"],
      answer: "¡Con gusto! 😊 Si tienes más preguntas, aquí estaré. Y recuerda que puedes agendar un diagnóstico gratuito cuando quieras — sin compromiso."
    }
  ];

  var FALLBACK = "Esa es una buena pregunta. Para darte la respuesta más precisa, lo mejor es que hablemos directamente. ¿Te conecto con nuestro equipo por WhatsApp o prefieres agendar una llamada?\n\n<a href='https://wa.me/" + WA_NUMBER + "?text=Hola%2C+tengo+una+pregunta+sobre+GlowLabs' target='_blank' style='color:#34d399;text-decoration:underline'>WhatsApp →</a>  ·  <a href='" + CALENDLY + "' target='_blank' style='color:#a78bfa;text-decoration:underline'>Agendar llamada →</a>";

  // ── BUILD UI ──────────────────────────────────────────────────────────────
  var css = `
#gl-chat-bubble {
  position: fixed; bottom: 2rem; left: 2rem; z-index: 9998;
  display: flex; flex-direction: column; align-items: flex-start; gap: 0.5rem;
}
#gl-chat-toggle {
  width: 54px; height: 54px; border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 20px rgba(124,58,237,0.45);
  transition: transform 0.2s, box-shadow 0.2s;
  animation: glChatPulse 3s ease-in-out infinite;
}
#gl-chat-toggle:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(124,58,237,0.6); animation: none; }
#gl-chat-toggle svg { width: 26px; height: 26px; color: #fff; }
#gl-chat-toggle .close-icon { display: none; }
#gl-chat-toggle.open .chat-icon { display: none; }
#gl-chat-toggle.open .close-icon { display: block; }
@keyframes glChatPulse {
  0%,100%{box-shadow:0 4px 20px rgba(124,58,237,0.45)}
  50%{box-shadow:0 4px 28px rgba(124,58,237,0.7),0 0 0 8px rgba(124,58,237,0.08)}
}
#gl-chat-notif {
  position: absolute; top: -4px; right: -4px;
  width: 14px; height: 14px; border-radius: 50%;
  background: #ef4444; border: 2px solid #0a0a0c;
  animation: notifPop 0.4s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes notifPop { from{transform:scale(0)} to{transform:scale(1)} }
#gl-chat-label {
  background: rgba(10,10,12,0.92); backdrop-filter: blur(10px);
  border: 1px solid rgba(124,58,237,0.4); border-radius: 12px 12px 12px 4px;
  padding: 0.55rem 0.9rem;
  font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 600; color: #fff;
  white-space: nowrap; pointer-events: none;
  animation: labelIn 0.4s 0.3s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes labelIn { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }

/* WINDOW */
#gl-chat-window {
  position: fixed; bottom: 7rem; left: 2rem; z-index: 9997;
  width: 340px; max-width: calc(100vw - 2rem);
  background: #0f0f12; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.15);
  display: none; flex-direction: column;
  animation: chatWindowIn 0.4s cubic-bezier(0.16,1,0.3,1) both;
  font-family: 'Sora', sans-serif;
}
#gl-chat-window.open { display: flex; }
@keyframes chatWindowIn { from{opacity:0;transform:translateY(16px) scale(0.96)} to{opacity:1;transform:none} }

/* HEADER */
.gl-chat-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(99,102,241,0.08));
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.gl-chat-avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  display: flex; align-items: center; justify-content: center;
  font-size: 1rem; flex-shrink: 0; position: relative;
}
.gl-chat-status {
  position: absolute; bottom: 1px; right: 1px;
  width: 10px; height: 10px; border-radius: 50%;
  background: #10b981; border: 2px solid #0f0f12;
}
.gl-chat-info .gl-chat-name { font-size: 0.9rem; font-weight: 700; color: #fff; }
.gl-chat-info .gl-chat-role { font-size: 0.72rem; color: rgba(255,255,255,0.45); margin-top: 1px; }
.gl-chat-powered {
  margin-left: auto; font-size: 0.62rem; font-weight: 600;
  letter-spacing: 0.08em; color: rgba(167,139,250,0.6); text-transform: uppercase;
}

/* MESSAGES */
#gl-chat-messages {
  flex: 1; overflow-y: auto; padding: 1rem;
  display: flex; flex-direction: column; gap: 0.75rem;
  min-height: 260px; max-height: 340px;
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent;
}
.gl-msg {
  display: flex; gap: 0.5rem; align-items: flex-end;
  animation: msgIn 0.35s cubic-bezier(0.16,1,0.3,1) both;
}
@keyframes msgIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
.gl-msg.user { flex-direction: row-reverse; }
.gl-msg-avatar {
  width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  display: flex; align-items: center; justify-content: center; font-size: 0.7rem;
}
.gl-msg-bubble {
  max-width: 78%; padding: 0.65rem 0.9rem;
  font-size: 0.82rem; line-height: 1.55; border-radius: 14px;
}
.gl-msg.bot .gl-msg-bubble {
  background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.88); border-bottom-left-radius: 4px;
}
.gl-msg.user .gl-msg-bubble {
  background: linear-gradient(135deg, #7c3aed, #6366f1);
  color: #fff; border-bottom-right-radius: 4px;
}
.gl-msg-bubble strong { color: #fff; font-weight: 700; }
.gl-msg-bubble a { color: #a78bfa; }

/* TYPING */
.gl-typing-dots { display: flex; gap: 4px; padding: 0.5rem 0.2rem; }
.gl-typing-dots span {
  width: 7px; height: 7px; border-radius: 50%;
  background: rgba(167,139,250,0.6);
  animation: typingDot 1.2s ease-in-out infinite;
}
.gl-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.gl-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingDot { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }

/* QUICK REPLIES */
#gl-chat-quick {
  display: flex; flex-wrap: wrap; gap: 0.4rem;
  padding: 0.75rem 1rem 0;
}
.gl-quick-btn {
  padding: 0.35rem 0.75rem; border: 1px solid rgba(167,139,250,0.3);
  border-radius: 9999px; background: rgba(124,58,237,0.07);
  color: #c4b5fd; font-family: 'Sora', sans-serif; font-size: 0.72rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s; white-space: nowrap;
}
.gl-quick-btn:hover { background: rgba(124,58,237,0.18); border-color: rgba(167,139,250,0.6); color: #fff; }

/* INPUT */
#gl-chat-input-row {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
}
#gl-chat-input {
  flex: 1; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 9999px; padding: 0.5rem 0.9rem;
  font-family: 'Sora', sans-serif; font-size: 0.82rem; color: #fff; outline: none;
  transition: border-color 0.2s;
}
#gl-chat-input:focus { border-color: rgba(167,139,250,0.5); }
#gl-chat-input::placeholder { color: rgba(255,255,255,0.3); }
#gl-chat-send {
  width: 34px; height: 34px; border-radius: 50%; border: none; flex-shrink: 0;
  background: linear-gradient(135deg, #7c3aed, #6366f1); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: opacity 0.2s, transform 0.2s;
}
#gl-chat-send:hover { opacity: 0.85; transform: scale(1.05); }
#gl-chat-send svg { width: 15px; height: 15px; color: #fff; }

@media (max-width: 480px) {
  #gl-chat-window { left: 1rem; right: 1rem; width: auto; bottom: 6rem; }
  #gl-chat-bubble { left: 1rem; bottom: 1.5rem; }
}
`;

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var html = `
<div id="gl-chat-bubble">
  <div id="gl-chat-label" style="display:none">¿Tienes alguna pregunta? 👋</div>
  <button id="gl-chat-toggle" aria-label="Abrir asistente GlowLabs">
    <span id="gl-chat-notif" style="display:none"></span>
    <svg class="chat-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    <svg class="close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  </button>
</div>

<div id="gl-chat-window">
  <div class="gl-chat-header">
    <div class="gl-chat-avatar">
      🤖
      <div class="gl-chat-status"></div>
    </div>
    <div class="gl-chat-info">
      <div class="gl-chat-name">Asistente GlowLabs</div>
      <div class="gl-chat-role">IA · Responde al instante</div>
    </div>
    <div class="gl-chat-powered">IA</div>
  </div>

  <div id="gl-chat-messages"></div>

  <div id="gl-chat-quick">
    <button class="gl-quick-btn" onclick="glChat.quick('¿Qué hacéis?')">¿Qué hacéis?</button>
    <button class="gl-quick-btn" onclick="glChat.quick('¿Cuánto cuesta?')">¿Cuánto cuesta?</button>
    <button class="gl-quick-btn" onclick="glChat.quick('¿Cómo funciona?')">¿Cómo funciona?</button>
    <button class="gl-quick-btn" onclick="glChat.quick('Ver resultados')">Ver resultados</button>
  </div>

  <div id="gl-chat-input-row">
    <input id="gl-chat-input" type="text" placeholder="Escribe tu pregunta…" autocomplete="off"/>
    <button id="gl-chat-send" aria-label="Enviar">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
    </button>
  </div>
</div>
`;

  var wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  // ── LOGIC ─────────────────────────────────────────────────────────────────
  var toggle   = document.getElementById('gl-chat-toggle');
  var window_  = document.getElementById('gl-chat-window');
  var messages = document.getElementById('gl-chat-messages');
  var input    = document.getElementById('gl-chat-input');
  var send     = document.getElementById('gl-chat-send');
  var notif    = document.getElementById('gl-chat-notif');
  var label    = document.getElementById('gl-chat-label');
  var opened   = false;
  var greeted  = false;

  window.glChat = {
    quick: function(text) { addUserMsg(text); processInput(text); }
  };

  toggle.addEventListener('click', function () {
    opened = !opened;
    toggle.classList.toggle('open', opened);
    window_.classList.toggle('open', opened);
    label.style.display = 'none';
    notif.style.display = 'none';
    if (opened && !greeted) {
      greeted = true;
      setTimeout(function () {
        addBotMsg("¡Hola! 👋 Soy el asistente de GlowLabs. Estoy aquí para resolver tus dudas sobre automatización e IA para tu negocio. ¿En qué te puedo ayudar?");
      }, 400);
    }
    if (opened) { setTimeout(function(){ input.focus(); }, 300); }
  });

  send.addEventListener('click', function () { submitInput(); });
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitInput(); });

  function submitInput() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addUserMsg(text);
    processInput(text);
  }

  function addUserMsg(text) {
    var el = document.createElement('div');
    el.className = 'gl-msg user';
    el.innerHTML = '<div class="gl-msg-bubble">' + escHtml(text) + '</div>';
    messages.appendChild(el);
    scrollBottom();
  }

  function addBotMsg(text) {
    // Show typing indicator
    var typing = document.createElement('div');
    typing.className = 'gl-msg bot';
    typing.innerHTML = '<div class="gl-msg-avatar">🤖</div><div class="gl-msg-bubble"><div class="gl-typing-dots"><span></span><span></span><span></span></div></div>';
    messages.appendChild(typing);
    scrollBottom();

    var delay = DELAY_MIN + Math.random() * (DELAY_MAX - DELAY_MIN);
    setTimeout(function () {
      messages.removeChild(typing);
      var el = document.createElement('div');
      el.className = 'gl-msg bot';
      var formatted = formatMsg(text);
      el.innerHTML = '<div class="gl-msg-avatar">🤖</div><div class="gl-msg-bubble">' + formatted + '</div>';
      messages.appendChild(el);
      scrollBottom();
    }, delay);
  }

  function processInput(text) {
    var t = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
    var matched = null;
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].keys.length; j++) {
        var key = KB[i].keys[j].normalize("NFD").replace(/[̀-ͯ]/g, "");
        if (t.indexOf(key) !== -1) { matched = KB[i].answer; break; }
      }
      if (matched) break;
    }
    addBotMsg(matched || FALLBACK);
  }

  function formatMsg(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function escHtml(t) {
    return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function scrollBottom() {
    setTimeout(function(){ messages.scrollTop = messages.scrollHeight; }, 50);
  }

  // Auto-open after delay
  setTimeout(function () {
    if (!opened) {
      label.style.display = 'block';
      notif.style.display = 'block';
    }
  }, OPEN_AFTER);

  setTimeout(function () {
    if (!opened) {
      setTimeout(function(){ label.style.display = 'none'; }, 5000);
    }
  }, OPEN_AFTER + 5000);

})();
