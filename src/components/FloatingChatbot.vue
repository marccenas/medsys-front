<template>
  <!-- Teleport so it's truly floating and not affected by page layout -->
  <teleport to="body">
    <!-- Overlay when open (click to close) -->
    <button
      v-if="open"
      class="cb-overlay"
      type="button"
      aria-label="Close chatbot"
      @click="close()"
    ></button>

    <div class="cb-root" :class="{ open }">
      <!-- FAB (closed state) -->
      <button
        v-if="!open"
        class="cb-fab"
        type="button"
        aria-label="Open AI Chatbot"
        @click="openChat()"
      >
        <!-- You can replace this with any icon -->
        <span class="cb-fab-ring" aria-hidden="true"></span>
        <span class="cb-fab-inner" aria-hidden="true">
          <!-- robot icon (inline svg so no extra FA icons required) -->
          <svg viewBox="0 0 64 64" class="cb-bot" aria-hidden="true">
            <path
              d="M32 6c1.7 0 3 1.3 3 3v4.1c8.8 1.5 15.5 9.1 15.5 18.3V40c0 9.4-7.6 17-17 17H30.5c-9.4 0-17-7.6-17-17v-8.3c0-9.2 6.7-16.8 15.5-18.3V9c0-1.7 1.3-3 3-3Zm-9.5 26.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm19 0a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4ZM24.8 45.5c2 1.9 4.7 3 7.7 3s5.7-1.1 7.7-3"
              fill="currentColor"
              opacity="0.95"
            />
          </svg>
        </span>
      </button>

      <!-- PANEL (open state) -->
      <section v-if="open" class="cb-panel" role="dialog" aria-label="AI Chatbot">
        <!-- Header -->
        <header class="cb-head">
          <div class="cb-head-left">
            <div class="cb-head-ico" aria-hidden="true">
              <svg viewBox="0 0 64 64" class="cb-bot" aria-hidden="true">
                <path
                  d="M32 6c1.7 0 3 1.3 3 3v4.1c8.8 1.5 15.5 9.1 15.5 18.3V40c0 9.4-7.6 17-17 17H30.5c-9.4 0-17-7.6-17-17v-8.3c0-9.2 6.7-16.8 15.5-18.3V9c0-1.7 1.3-3 3-3Zm-9.5 26.8a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4Zm19 0a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4ZM24.8 45.5c2 1.9 4.7 3 7.7 3s5.7-1.1 7.7-3"
                  fill="currentColor"
                  opacity="0.95"
                />
              </svg>
            </div>
            <div class="cb-head-title">
              <div class="cb-title">AI Chatbot</div>
              <div class="cb-sub">Quick access assistant</div>
            </div>
          </div>

          <button class="cb-close" type="button" aria-label="Close" @click="close()">
            ✕
          </button>
        </header>

        <!-- Body -->
        <div ref="bodyRef" class="cb-body">
          <div v-for="m in messages" :key="m.id" class="cb-row" :class="m.role">
            <div v-if="m.role === 'bot'" class="cb-avatar" aria-hidden="true">
              <svg viewBox="0 0 64 64" class="cb-bot small" aria-hidden="true">
                <path
                  d="M32 6c1.7 0 3 1.3 3 3v4.1c8.8 1.5 15.5 9.1 15.5 18.3V40c0 9.4-7.6 17-17 17H30.5c-9.4 0-17-7.6-17-17v-8.3c0-9.2 6.7-16.8 15.5-18.3V9c0-1.7 1.3-3 3-3Z"
                  fill="currentColor"
                  opacity="0.95"
                />
              </svg>
            </div>

            <div class="cb-bubble">
              <div class="cb-text">{{ m.text }}</div>
              <div class="cb-time">{{ m.time }}</div>
            </div>
          </div>
        </div>

        <!-- Footer input -->
        <footer class="cb-foot">
          <div class="cb-input-wrap">
            <input
              v-model="draft"
              class="cb-input"
              type="text"
              placeholder="Type your message..."
              @keydown.enter.prevent="send()"
            />
            <button class="cb-send" type="button" aria-label="Send" @click="send()">
              <!-- paper-plane-ish triangle (no extra icons) -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 11.2 21 3l-8.2 18-2.4-7.2L3 11.2Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </footer>
      </section>
    </div>
  </teleport>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

const open = ref(false);
const draft = ref("");

const bodyRef = ref(null);

const messages = ref([
  {
    id: 1,
    role: "bot",
    text: "Hello! How can I assist you today?",
    time: timeNow(),
  },
]);

function timeNow() {
  const d = new Date();
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function openChat() {
  open.value = true;
  nextTick(() => {
    scrollToBottom();
    focusInput();
  });
}

function close() {
  open.value = false;
}

function focusInput() {
  // small delay to ensure DOM is ready
  nextTick(() => {
    const el = document.querySelector(".cb-input");
    if (el) el.focus();
  });
}

function scrollToBottom() {
  const el = bodyRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

function send() {
  const text = draft.value.trim();
  if (!text) return;

  messages.value.push({
    id: Date.now(),
    role: "user",
    text,
    time: timeNow(),
  });

  draft.value = "";

  nextTick(() => {
    scrollToBottom();

    // mock bot reply (replace later with your real AI call)
    setTimeout(() => {
      messages.value.push({
        id: Date.now() + 1,
        role: "bot",
        text: "Got it — I can help with that. What details should I use?",
        time: timeNow(),
      });
      nextTick(scrollToBottom);
    }, 450);
  });
}

function onEsc(e) {
  if (e.key === "Escape") close();
}

onMounted(() => document.addEventListener("keydown", onEsc));
onBeforeUnmount(() => document.removeEventListener("keydown", onEsc));
</script>

<style scoped>
/* ===== Overlay ===== */
.cb-overlay{
  position: fixed;
  inset: 0;
  background: rgba(13, 24, 48, .22);
  border: 0;
  padding: 0;
  margin: 0;
  z-index: 9990;
}

/* ===== Root anchor ===== */
.cb-root{
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 9999;
  pointer-events: none; /* allow only children to capture */
}
.cb-root *{ pointer-events: auto; }

/* ===== FAB ===== */
.cb-fab{
  position: relative;
  width: 78px;
  height: 78px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  background: transparent;
  padding: 0;
}

.cb-fab-ring{
  position:absolute;
  inset: 0;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.42), rgba(255,255,255,0) 55%),
              linear-gradient(180deg, rgba(100,170,255,.95), rgba(45,118,214,.95));
  box-shadow: 0 18px 40px rgba(17,36,80,.22);
}
.cb-fab-inner{
  position:absolute;
  inset: 10px;
  border-radius: 999px;
  background: rgba(255,255,255,.88);
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
}

.cb-bot{
  width: 38px;
  height: 38px;
  color: #2D76D6;
}
.cb-bot.small{
  width: 22px;
  height: 22px;
}

/* ===== Panel ===== */
.cb-panel{
  width: 420px;
  max-width: calc(100vw - 24px);
  height: 520px;
  max-height: calc(100vh - 120px);
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid rgba(226,232,244,0.95);
  background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,249,255,0.78));
  box-shadow: 0 26px 60px rgba(17,36,80,.22);
  transform-origin: 100% 100%;
  animation: cbPop .20s ease-out;
}

/* Header gradient like your mock */
.cb-head{
  height: 70px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 12px 14px;
  color:#fff;
  background: linear-gradient(90deg, #2D76D6, #67B3FF);
  border-bottom: 1px solid rgba(255,255,255,.18);
}

.cb-head-left{
  display:flex;
  align-items:center;
  gap: 12px;
}

.cb-head-ico{
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: rgba(255,255,255,.22);
  border: 1px solid rgba(255,255,255,.22);
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
}
.cb-head-ico .cb-bot{ color:#fff; width: 26px; height: 26px; }

.cb-title{
  font-weight: 950;
  font-size: 18px;
  letter-spacing: .2px;
}
.cb-sub{
  margin-top: 2px;
  font-weight: 800;
  font-size: 12px;
  opacity: .85;
}

.cb-close{
  width: 40px;
  height: 40px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,.30);
  background: rgba(255,255,255,.16);
  color:#fff;
  cursor:pointer;
  font-size: 18px;
  display:flex;
  align-items:center;
  justify-content:center;
}

/* Body */
.cb-body{
  height: calc(100% - 70px - 78px);
  padding: 14px 14px 10px;
  overflow:auto;
  background:
    radial-gradient(circle at 25% 10%, rgba(45,118,214,0.12), transparent 55%),
    radial-gradient(circle at 85% 30%, rgba(103,179,255,0.10), transparent 55%);
}

.cb-row{
  display:flex;
  gap: 10px;
  margin-bottom: 12px;
}
.cb-row.user{ justify-content:flex-end; }
.cb-row.user .cb-bubble{ background: rgba(225,235,255,.88); border-color: rgba(45,118,214,.18); }
.cb-row.bot .cb-bubble{ background: rgba(255,255,255,.82); border-color: rgba(226,232,244,.95); }

.cb-avatar{
  width: 34px;
  height: 34px;
  border-radius: 999px;
  background: rgba(255,255,255,.82);
  border: 1px solid rgba(226,232,244,.95);
  display:flex;
  align-items:center;
  justify-content:center;
  flex: 0 0 auto;
}

.cb-bubble{
  max-width: 78%;
  border-radius: 14px;
  border: 1px solid rgba(226,232,244,.95);
  padding: 10px 12px;
  box-shadow: 0 10px 18px rgba(17,36,80,.06);
}

.cb-text{
  font-weight: 850;
  color:#2b3a5b;
  line-height: 1.25;
}
.cb-time{
  margin-top: 6px;
  font-size: 11px;
  font-weight: 800;
  color:#7b8eaa;
  text-align: right;
}

/* Footer */
.cb-foot{
  height: 78px;
  padding: 10px 12px 12px;
  background: linear-gradient(180deg, rgba(248,251,255,.96), rgba(245,249,255,.86));
  border-top: 1px solid rgba(226,232,244,.90);
}

.cb-input-wrap{
  height: 56px;
  border-radius: 999px;
  border: 1px solid rgba(226,232,244,.95);
  background: rgba(255,255,255,.78);
  display:flex;
  align-items:center;
  gap: 10px;
  padding: 8px 8px 8px 12px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
}

.cb-input{
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  font-weight: 850;
  color:#2b3a5b;
}
.cb-input::placeholder{ color:#93a1b9; font-weight: 850; }

.cb-send{
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  color:#fff;
  background: linear-gradient(180deg, #2D76D6, #67B3FF);
  box-shadow: 0 16px 28px rgba(45,118,214,.22);
  display:flex;
  align-items:center;
  justify-content:center;
}
.cb-send svg{ width: 18px; height: 18px; }

/* Anim */
@keyframes cbPop{
  from{ transform: translateY(10px) scale(.96); opacity: 0; }
  to{ transform: translateY(0) scale(1); opacity: 1; }
}

/* ===== Responsive ===== */
@media (max-width: 860px){
  .cb-root{ right: 14px; bottom: 14px; }
  .cb-panel{
    width: min(420px, calc(100vw - 20px));
    height: min(520px, calc(100vh - 140px));
    border-radius: 20px;
  }
}

@media (max-width: 520px){
  .cb-fab{ width: 70px; height: 70px; }
  .cb-panel{
    width: calc(100vw - 16px);
    height: min(540px, calc(100vh - 110px));
    border-radius: 18px;
  }
  .cb-bubble{ max-width: 86%; }
}
</style>
