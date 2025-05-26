import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue'
import { useChartStore } from '../store/chartStore'

export default defineComponent({
  name: 'AssetChart',
  setup() {
    const chartStore = useChartStore()
    const canvasRef = ref<HTMLCanvasElement | null>(null)
    const ctx = ref<CanvasRenderingContext2D | null>(null)
    let resizeObserver: ResizeObserver | null = null

    onMounted(() => {
      if (canvasRef.value) {
        ctx.value = canvasRef.value.getContext('2d')
        
        // Set up resize observer
        resizeObserver = new ResizeObserver(() => {
          resizeCanvas()
          renderChart()
        })
        resizeObserver.observe(canvasRef.value.parentElement as Element)
        
        resizeCanvas()
        renderChart()
      }
    })

    onUnmounted(() => {
      if (resizeObserver && canvasRef.value?.parentElement) {
        resizeObserver.unobserve(canvasRef.value.parentElement)
        resizeObserver.disconnect()
      }
    })

    const resizeCanvas = () => {
      if (!canvasRef.value) return
      
      const container = canvasRef.value.parentElement
      if (container) {
        canvasRef.value.width = container.clientWidth
        canvasRef.value.height = container.clientHeight
      }
    }

    watch(() => chartStore.chartData, () => {
      renderChart()
    })

    watch(() => chartStore.config, () => {
      renderChart()
    }, { deep: true })

    const renderChart = () => {
      if (!ctx.value || !canvasRef.value || !chartStore.chartData.value.length) return
      
      const width = canvasRef.value.width
      const height = canvasRef.value.height
      const padding = chartStore.config.value.padding
      const chartWidth = width - padding * 2
      const chartHeight = height - padding * 2
      
      // Clear canvas
      ctx.value.clearRect(0, 0, width, height)
      
      // Find price range
      const max = Math.max(...chartStore.chartData.value) * 1.1
      const min = Math.max(0, Math.min(...chartStore.chartData.value) * 0.9)
      const range = max - min
      
      // Draw chart line
      ctx.value.strokeStyle = chartStore.config.value.lineColor
      ctx.value.lineWidth = chartStore.config.value.lineWidth
      ctx.value.beginPath()
      
      // Store line points
      const linePoints: {x: number, y: number}[] = []
      
      for (let i = 0; i < chartStore.chartData.value.length; i++) {
        const x = padding + (i / (chartStore.chartData.value.length - 1)) * chartWidth
        const y = padding + chartHeight - ((chartStore.chartData.value[i] - min) / range * chartHeight)
        linePoints.push({x, y})
      }
      
      // Draw smooth line
      ctx.value.moveTo(linePoints[0].x, linePoints[0].y)
      for (let i = 0; i < linePoints.length - 1; i++) {
        const xc = (linePoints[i].x + linePoints[i+1].x) / 2
        const yc = (linePoints[i].y + linePoints[i+1].y) / 2
        ctx.value.quadraticCurveTo(linePoints[i].x, linePoints[i].y, xc, yc)
      }
      
      // Connect to last point
      ctx.value.quadraticCurveTo(
        linePoints[linePoints.length-2].x, 
        linePoints[linePoints.length-2].y, 
        linePoints[linePoints.length-1].x, 
        linePoints[linePoints.length-1].y
      )
      
      // Add line glow effect
      ctx.value.shadowColor = chartStore.config.value.lineColor
      ctx.value.shadowBlur = chartStore.config.value.shadowBlur
      ctx.value.stroke()
      ctx.value.shadowBlur = 0
      
      // Draw dot fill
      renderDotFill(linePoints, padding, chartWidth, height)
    }
    
    const renderDotFill = (
      linePoints: {x: number, y: number}[], 
      padding: number, 
      chartWidth: number, 
      height: number
    ) => {
      if (!ctx.value) return
      
      const { dotSpacingX, dotSpacingY, dotSize, dotColor } = chartStore.config.value
      
      ctx.value.fillStyle = dotColor
      
      for (let x = padding; x <= padding + chartWidth; x += dotSpacingX) {
        for (let y = padding; y <= height - padding; y += dotSpacingY) {
          // Calculate line height for this x position
          const xRatio = (x - padding) / chartWidth
          const pointIndex = Math.floor(xRatio * (linePoints.length - 1))
          const nextIndex = Math.min(pointIndex + 1, linePoints.length - 1)
          
          if (pointIndex < 0) continue
          
          const pointX = linePoints[pointIndex].x
          const nextX = linePoints[nextIndex].x
          const pointY = linePoints[pointIndex].y
          const nextY = linePoints[nextIndex].y
          
          // Linear interpolation to find y position
          let lineY
          if (nextX === pointX) {
            lineY = pointY
          } else {
            const ratio = (x - pointX) / (nextX - pointX)
            lineY = pointY + ratio * (nextY - pointY)
          }
          
          // Only draw points below the line
          if (y >= lineY) {
            ctx.value.beginPath()
            ctx.value.rect(x - dotSize/2, y - dotSize/2, dotSize, dotSize)
            ctx.value.fill()
          }
        }
      }
    }

    return () => (
      <canvas 
        ref={canvasRef} 
        class="w-full h-full bg-dark-900"
      ></canvas>
    )
  }
})
