<script setup>
import { ref, nextTick, watch } from 'vue';
import SectionTitle from '@/components/SectionTitle.vue';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';

const conversations = ref([
    {
        id: 1,
        name: 'Alice Johnson',
        avatar: 'https://i.pravatar.cc/150?u=alice',
        lastMessage: 'See you at the gym tomorrow!',
        messages: [
            { id: 1, text: 'Hey Alice, are we still on for leg day?', isMe: true, time: '10:00 AM' },
            { id: 2, text: 'Absolutely! I am ready to crush it.', isMe: false, time: '10:05 AM' },
            { id: 3, text: 'See you at the gym tomorrow!', isMe: false, time: '10:06 AM' }
        ]
    },
    {
        id: 2,
        name: 'Coach Mike',
        avatar: 'https://i.pravatar.cc/150?u=mike',
        lastMessage: 'Great form on those squats.',
        messages: [
            { id: 1, text: 'Check out my latest video, how is my form?', isMe: true, time: 'Yesterday' },
            { id: 2, text: 'Looking solid. Keep your chest up a bit more.', isMe: false, time: 'Yesterday' },
            { id: 3, text: 'Great form on those squats.', isMe: false, time: 'Yesterday' }
        ]
    },
    {
        id: 3,
        name: 'Sarah Fit',
        avatar: 'https://i.pravatar.cc/150?u=sarah',
        lastMessage: 'Thanks for the spot!',
        messages: [
            { id: 1, text: 'Thanks for the spot!', isMe: false, time: '2 days ago' },
            { id: 2, text: 'Anytime!', isMe: true, time: '2 days ago' }
        ]
    }
]);

const activeChatId = ref(null);
const newMessage = ref('');
const messagesContainer = ref(null);

function selectChat(id) {
    activeChatId.value = id;
    scrollToBottom();
}

function backToList() {
    activeChatId.value = null;
}

function sendMessage() {
    if (!newMessage.value.trim() || !activeChatId.value) return;

    const chat = conversations.value.find(c => c.id === activeChatId.value);
    if (chat) {
        chat.messages.push({
            id: Date.now(),
            text: newMessage.value,
            isMe: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        chat.lastMessage = newMessage.value; // Update preview
        newMessage.value = '';
        scrollToBottom();
    }
}

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
        }
    });
}

watch(activeChatId, () => {
    scrollToBottom();
});
</script>

<template>
    <div class="messages-view" :class="{ 'messages-view--mobile-active': activeChatId }">
        <SectionTitle class="messages-title">Messages</SectionTitle>
        <div class="chat-interface">
            <div class="chat-list" :class="{ 'chat-list--hidden': activeChatId }">
                <div 
                    v-for="chat in conversations" 
                    :key="chat.id"
                    class="chat-item"
                    :class="{ 'chat-item--active': activeChatId === chat.id }"
                    @click="selectChat(chat.id)"
                >
                    <img :src="chat.avatar" :alt="chat.name" class="chat-item__avatar" />
                    <div class="chat-item__info">
                        <h3 class="chat-item__name">{{ chat.name }}</h3>
                        <p class="chat-item__preview">{{ chat.lastMessage }}</p>
                    </div>
                </div>
            </div>

            <!-- Right Pane: Active Conversation -->
            <div class="chat-window" :class="{ 'chat-window--active': activeChatId }">
                <div v-if="activeChatId" class="chat-window__content">
                    <!-- Header -->
                    <div class="chat-header">
                        <button class="back-button" @click="backToList" aria-label="Back to messages">
                            ←
                        </button>
                        <h2 class="chat-header__name">
                            {{ conversations.find(c => c.id === activeChatId).name }}
                        </h2>
                    </div>
                    <div class="chat-messages" ref="messagesContainer">
                        <div 
                            v-for="msg in conversations.find(c => c.id === activeChatId).messages" 
                            :key="msg.id"
                            class="message"
                            :class="{ 'message--me': msg.isMe, 'message--them': !msg.isMe }"
                        >
                            <div class="message__bubble">
                                {{ msg.text }}
                            </div>
                            <span class="message__time">{{ msg.time }}</span>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <div class="chat-input-wrapper">
                            <Input 
                                id="message-input" 
                                v-model="newMessage" 
                                placeholder="Type a message..." 
                                @keyup.enter="sendMessage"
                            />
                        </div>
                        <Button @click="sendMessage">Send</Button>
                    </div>
                </div>
                <div v-else class="chat-window__empty">
                    <p>Select a conversation to start chatting</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.messages-view {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: calc(100vh - 150px);
    width: 100%;
}

.chat-interface {
    display: flex;
    gap: 1rem;
    flex-grow: 1;
    overflow: hidden; /* Prevents outer scroll */
    background-color: #222;
    border-radius: 1rem;
    border: 1px solid #333;
}

.chat-list {
    width: 35%;
    border-right: 1px solid #333;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
}

.chat-item {
    display: flex;
    align-items: center;
    padding: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    border-bottom: 1px solid #333;
}

.chat-item:hover {
    background-color: #2a2a2a;
}

.chat-item--active {
    background-color: #333;
    border-left: 4px solid #1976d2;
}

.chat-item__avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    margin-right: 1rem;
    object-fit: cover;
}

.chat-item__info {
    overflow: hidden;
}

.chat-item__name {
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.25rem;
    font-size: 1rem;
}

.chat-item__preview {
    color: #888;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.chat-window {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #1a1a1a;
}

.back-button {
    display: none;
}

.chat-window__content {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.chat-window__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #666;
    font-size: 1.2rem;
}

.chat-header {
    padding: 1rem;
    border-bottom: 1px solid #333;
    background-color: #222;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.chat-header__name {
    font-size: 1.2rem;
    font-weight: bold;
    color: #fff;
}

.chat-messages {
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.message {
    display: flex;
    flex-direction: column;
    max-width: 70%;
}

.message--me {
    align-self: flex-end;
    align-items: flex-end;
}

.message--them {
    align-self: flex-start;
    align-items: flex-start;
}

.message__bubble {
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    font-size: 1rem;
    line-height: 1.4;
}

.message--me .message__bubble {
    background-color: #1976d2;
    color: white;
    border-bottom-right-radius: 0.25rem;
}

.message--them .message__bubble {
    background-color: #333;
    color: #eee;
    border-bottom-left-radius: 0.25rem;
}

.message__time {
    font-size: 0.7rem;
    color: #666;
    margin-top: 0.25rem;
    padding: 0 0.5rem;
}

.chat-input-area {
    padding: 1rem;
    background-color: #222;
    border-top: 1px solid #333;
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

.chat-input-wrapper {
    flex-grow: 1;
}

@media (max-width: 768px) {
    .messages-view--mobile-active .messages-title {
        display: none;
    }

    .chat-list {
        width: 100%;
        border-right: none;
    }

    .chat-list--hidden {
        display: none;
    }

    .chat-window {
        display: none;
        width: 100%;
    }

    .chat-window--active {
        display: flex;
    }

    .back-button {
        display: block;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 0.5rem 0 0;
        line-height: 1;
    }
}
</style>