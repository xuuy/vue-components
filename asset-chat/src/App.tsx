import { defineComponent } from 'vue'
import { RouterView, RouterLink } from 'vue-router'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div class="app-container">
        <header class="nav-header">
          <nav>
            <RouterLink to="/seal" class="nav-link">印章演示</RouterLink>
            <RouterLink to="/asset-chat" class="nav-link">资产聊天演示</RouterLink>
          </nav>
        </header>
        <main class="content">
          <RouterView />
        </main>
      </div>
    )
  }
})
