<script setup>
import { ref, nextTick, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import Card from '@/components/Card.vue'
import Avatar from '@/components/Avatar.vue'
import EmptyState from '@/components/EmptyState.vue'

const router = useRouter()

const conversations = ref([
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://i.pravatar.cc/150?u=alice',
    unread: 2,
    online: true,
    messages: [
      { id: 1, text: 'Hey Alice, are we still on for leg day?', isMe: true, time: '10:00' },
      { id: 2, text: 'Absolutely! I am ready to crush it.',     isMe: false, time: '10:05' },
      { id: 3, text: 'See you at the gym tomorrow!',            isMe: false, time: '10:06' },
    ],
  },
  {
    id: 2,
    name: 'Coach Mike',
    avatar: 'https://i.pravatar.cc/150?u=mike',
    unread: 0,
    online: false,
    messages: [
      { id: 1, text: 'Check out my latest video, how is my form?', isMe: true, time: 'Yesterday' },
      { id: 2, text: 'Looking solid. Keep your chest up a bit more.', isMe: false, time: 'Yesterday' },
      { id: 3, text: 'Great form on those squats.', isMe: false, time: 'Yesterday' },
    ],
  },
  {
    id: 3,
    name: 'Sarah Fit',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    unread: 0,
    online: true,
    messages: [
      { id: 1, text: 'Thanks for the spot!', isMe: false, time: '2d' },
      { id: 2, text: 'Anytime!', isMe: true, time: '2d' },
    ],
  },
])

const activeChatId = ref(null)
const newMessage = ref('')
const messagesContainer = ref(null)

const activeChat = computed(() =>
  conversations.value.find(c => c.id === activeChatId.value) || null
)

function selectChat(id) {
  activeChatId.value = id
  const chat = conversations.value.find(c => c.id === id)
  if (chat) chat.unread = 0
  scrollToBottom()
}

function backToList() { activeChatId.value = null }

function sendMessage() {
  if (!newMessage.value.trim() || !activeChat.value) return
  activeChat.value.messages.push({
    id: Date.now(),
    text: newMessage.value,
    isMe: true,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  })
  newMessage.value = ''
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function lastMessage(chat) {
  return chat.messages[chat.messages.length - 1]?.text || ''
}

watch(activeChatId, () => scrollToBottom())
</script>

<template>
  <div class="messages" :class="{ 'messages--mobile-active': activeChatId }">
    <header v-if="!activeChatId" class="messages__head">
      <button class="messages__back" @click="router.back()" aria-label="Back">←</button>
      <div class="messages__title-wrap">
        <span class="messages__eyebrow">Inbox</span>
        <h1 class="messages__title">Messages</h1>
      </div>
    </header>

    <Card padding="none" class="chat">
      <div class="chat__list" :class="{ 'chat__list--hidden': activeChatId }">
        <div
          v-for="c in conversations"
          :key="c.id"
          class="chat-item"
          :class="{ 'chat-item--active': activeChatId === c.id }"
          @click="selectChat(c.id)"
        >
          <div class="chat-item__avatar-wrap">
            <Avatar :src="c.avatar" :alt="c.name" size="md" />
            <span v-if="c.online" class="chat-item__online" aria-label="Online" />
          </div>
          <div class="chat-item__info">
            <div class="chat-item__row">
              <span class="chat-item__name">{{ c.name }}</span>
              <span class="chat-item__time">{{ c.messages[c.messages.length - 1]?.time }}</span>
            </div>
            <div class="chat-item__row">
              <p class="chat-item__preview">{{ lastMessage(c) }}</p>
              <span v-if="c.unread" class="chat-item__badge">{{ c.unread }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="chat__window" :class="{ 'chat__window--active': activeChatId }">
        <template v-if="activeChat">
          <div class="chat__head">
            <button class="chat__back" @click="backToList" aria-label="Back to messages">←</button>
            <Avatar :src="activeChat.avatar" :alt="activeChat.name" size="sm" />
            <div class="chat__head-info">
              <span class="chat__head-name">{{ activeChat.name }}</span>
              <span class="chat__head-status">
                {{ activeChat.online ? 'Online' : 'Offline' }}
              </span>
            </div>
          </div>

          <div class="chat__msgs" ref="messagesContainer">
            <div
              v-for="m in activeChat.messages"
              :key="m.id"
              class="msg"
              :class="m.isMe ? 'msg--me' : 'msg--them'"
            >
              <div class="msg__bubble">{{ m.text }}</div>
              <span class="msg__time">{{ m.time }}</span>
            </div>
          </div>

          <div class="chat__input">
            <input
              v-model="newMessage"
              class="chat__input-field"
              placeholder="Type a message..."
              @keyup.enter="sendMessage"
            />
            <button class="chat__send" @click="sendMessage" :disabled="!newMessage.trim()">
              Send
            </button>
          </div>
        </template>

        <div v-else class="chat__empty">
          <EmptyState
            icon="💬"
            title="No conversation selected"
            description="Pick a chat from the list to start messaging."
          />
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.messages {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  height: calc(100vh - var(--footer-h) - 8rem);
  min-height: 30rem;
}

.messages__head { display: flex; align-items: center; gap: var(--space-3); }
.messages__back {
  width: 2.5rem; height: 2.5rem;
  border-radius: 50%;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.messages__title-wrap { flex: 1; min-width: 0; }
.messages__eyebrow {
  display: block;
  font-size: var(--fs-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-dim);
  font-weight: var(--fw-medium);
}
.messages__title {
  font-size: var(--fs-2xl);
  font-weight: var(--fw-bold);
  letter-spacing: -0.02em;
  color: var(--color-text);
}

.chat {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.chat__list {
  width: 35%;
  min-width: 18rem;
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
  border-bottom: 1px solid var(--color-border);
}
.chat-item:last-child { border-bottom: none; }
.chat-item:hover { background: var(--color-surface-2); }
.chat-item--active {
  background: var(--color-surface-2);
  box-shadow: inset 3px 0 0 var(--color-accent);
}

.chat-item__avatar-wrap { position: relative; flex-shrink: 0; }
.chat-item__online {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 0.65rem;
  height: 0.65rem;
  background: var(--color-success);
  border-radius: 50%;
  border: 2px solid var(--color-surface);
}

.chat-item__info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.chat-item__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
}
.chat-item__name { font-weight: var(--fw-semibold); color: var(--color-text); }
.chat-item__time { font-size: var(--fs-xs); color: var(--color-text-dim); flex-shrink: 0; }
.chat-item__preview {
  color: var(--color-text-muted);
  font-size: var(--fs-sm);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}
.chat-item__badge {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  font-size: var(--fs-xs);
  font-weight: var(--fw-bold);
  padding: 2px 0.5rem;
  border-radius: var(--radius-pill);
  min-width: 1.25rem;
  text-align: center;
  flex-shrink: 0;
}

.chat__window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-elevated);
  min-width: 0;
}

.chat__head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}
.chat__back {
  display: none;
  background: transparent;
  border: none;
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}
.chat__back:hover { background: var(--color-surface-2); }
.chat__head-info { display: flex; flex-direction: column; }
.chat__head-name { font-weight: var(--fw-semibold); color: var(--color-text); }
.chat__head-status { font-size: var(--fs-xs); color: var(--color-text-dim); }

.chat__msgs {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.msg { display: flex; flex-direction: column; max-width: 75%; gap: 2px; }
.msg--me { align-self: flex-end; align-items: flex-end; }
.msg--them { align-self: flex-start; align-items: flex-start; }
.msg__bubble {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-lg);
  font-size: var(--fs-sm);
  line-height: 1.4;
}
.msg--me .msg__bubble {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border-bottom-right-radius: var(--radius-sm);
}
.msg--them .msg__bubble {
  background: var(--color-surface-2);
  color: var(--color-text);
  border-bottom-left-radius: var(--radius-sm);
}
.msg__time { font-size: var(--fs-xs); color: var(--color-text-dim); padding: 0 var(--space-2); }

.chat__input {
  display: flex;
  gap: var(--space-2);
  padding: var(--space-3);
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}
.chat__input-field {
  flex: 1;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-pill);
  font-size: var(--fs-sm);
  outline: none;
  transition: border-color var(--t-fast) var(--ease);
}
.chat__input-field:focus { border-color: var(--color-accent); }
.chat__send {
  padding: 0 var(--space-5);
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;
  border-radius: var(--radius-pill);
  font-weight: var(--fw-semibold);
  cursor: pointer;
  transition: background var(--t-fast) var(--ease);
}
.chat__send:hover:not(:disabled) { background: var(--color-accent-hover); }
.chat__send:disabled { opacity: 0.4; cursor: not-allowed; }

.chat__empty { flex: 1; display: flex; align-items: center; justify-content: center; padding: var(--space-4); }

@media (max-width: 768px) {
  .chat__list--hidden { display: none; }
  .chat__list { width: 100%; min-width: 0; border-right: none; }
  .chat__window { display: none; }
  .chat__window--active { display: flex; }
  .chat__back { display: inline-flex; align-items: center; justify-content: center; }
  .messages--mobile-active .messages__head { display: none; }
}
</style>
