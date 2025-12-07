import { createApp } from 'vue'
import App from './App.vue'
import { router } from './useRouter.js'

import '@picocss/pico'

createApp(App).use(router).mount('#app')
