import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import { useChartStore } from '../store/chartStore'
import { render } from '../utils/ChartRenderer'
import type { ChartConfig } from '../utils/ChartRenderer' // Assuming ChartConfig is exported

export default defineComponent({
  name: 'AssetChart',
  setup() {
    const chartStore = useChartStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    // ctx is no longer needed here as it's managed by ChartRenderer.ts
    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
      if (canvasRef.value) {
        // No need to get context here, ChartRenderer will do it
        
        // Set up resize observer
        resizeObserver = new ResizeObserver(() => {
          resizeCanvas()
          renderNewChart() // Call the new render function
        })
        if (canvasRef.value.parentElement) {
          resizeObserver.observe(canvasRef.value.parentElement as Element)
        }
        
        resizeCanvas()
        renderNewChart() // Call the new render function
      }
    })

    onUnmounted(() => {
      if (resizeObserver && canvasRef.value?.parentElement) {
        resizeObserver.unobserve(canvasRef.value.parentElement)
      }
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    })

    const resizeCanvas = () => {
      if (!canvasRef.value) return
      
      const container = canvasRef.value.parentElement
      if (container) {
        const dpr = window.devicePixelRatio || 1;
        // Set display size (css pixels)
        // canvasRef.value.style.width = container.clientWidth + 'px';
        // canvasRef.value.style.height = container.clientHeight + 'px';

        // Set actual size in memory (scaled for dpi)
        canvasRef.value.width = container.clientWidth * dpr;
        canvasRef.value.height = container.clientHeight * dpr;

        // Normalize coordinate system to use CSS pixels.
        const ctx = canvasRef.value.getContext('2d');
        ctx?.scale(dpr, dpr);
      }
    }

    watch(() => chartStore.chartData, () => {
      renderNewChart()
    }, { deep: true }) // deep true might be relevant if chartData is nested, but it's an array of numbers

    watch(() => chartStore.config, () => {
      renderNewChart()
    }, { deep: true })

    // New renderChart function
    const renderNewChart = () => {
      if (!canvasRef.value || !chartStore.chartData || chartStore.chartData.value.length === 0) {
        // Optionally clear canvas if data is empty
        if (canvasRef.value) {
            const ctx = canvasRef.value.getContext('2d');
            if (ctx) {
                // Scale handling for clearRect
                const dpr = window.devicePixelRatio || 1;
                const logicalWidth = canvasRef.value.width / dpr;
                const logicalHeight = canvasRef.value.height / dpr;
                ctx.clearRect(0, 0, logicalWidth, logicalHeight);
            }
        }
        return;
      }
      // The ChartConfig type is now imported and used from chartStore
      render(canvasRef.value, chartStore.chartData.value, chartStore.config.value as ChartConfig)
    }

    return () => (
      <canvas 
        ref={canvasRef} 
        class="w-full h-full bg-dark-900"
        // style attribute will be controlled by resizeCanvas for DPR scaling
      ></canvas>
    )
  }
})
