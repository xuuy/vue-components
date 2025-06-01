import { defineComponent } from 'vue'
import AssetChart from '../components/AssetChart'
import ControlPanel from '../components/ControlPanel'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div class="max-w-1200px mx-auto flex flex-col md:flex-row gap-5">
        <div class="flex-1 h-400px mb-5 md:mb-0">
          <AssetChart />
        </div>
        
        <div class="flex-1 md:max-w-400px bg-dark-700 border border-dark-400 rounded-md p-4">
          <ControlPanel />
        </div>
      </div>
    )
  }
})
