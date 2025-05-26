import { reactive, computed } from 'vue'

interface ChartConfig {
  padding: number
  lineColor: string
  lineWidth: number
  dotColor: string
  dotSize: number
  dotSpacingX: number
  dotSpacingY: number
  shadowBlur: number
  initialAmount: number
  finalAmount: number  
  totalPoints: number
  volatility: number
  trend: number
}

// Singleton pattern for the store
const state = reactive({
  config: {
    padding: 0,
    lineColor: '#c8f855',
    lineWidth: 3,
    dotColor: 'rgba(200, 248, 85, 0.6)',
    dotSize: 1.6,
    dotSpacingX: 6,
    dotSpacingY: 6,
    shadowBlur: 12,
    initialAmount: 1000,
    finalAmount: 15000,
    totalPoints: 120,
    volatility: 0.8,
    trend: 0.6
  } as ChartConfig,
  chartData: [] as number[]
})

export function useChartStore() {
  const updateConfig = (newConfig: Partial<ChartConfig>) => {
    Object.assign(state.config, newConfig)
  }
  
  const generateChartData = () => {
    const { initialAmount, finalAmount, totalPoints, volatility, trend } = state.config
    
    const chartData: number[] = []
    
    // Generate key points for major fluctuations
    const keyPoints = Math.floor(totalPoints / 8) + 2
    const keyValues: number[] = []
    
    keyValues.push(initialAmount)
    
    // Generate middle key points
    for (let i = 1; i < keyPoints - 1; i++) {
      const idealValue = initialAmount + (finalAmount - initialAmount) * (i / (keyPoints - 1))
      const valueRange = Math.abs(finalAmount - initialAmount)
      const bigWave = (Math.random() - 0.5) * volatility * valueRange * 0.75
      keyValues.push(idealValue + bigWave)
    }
    
    keyValues.push(finalAmount)
    
    // Generate all points based on key points
    for (let i = 0; i < totalPoints; i++) {
      const segmentIndex = Math.floor(i / (totalPoints - 1) * (keyPoints - 1))
      const nextSegmentIndex = Math.min(segmentIndex + 1, keyPoints - 1)
      
      const segmentPosition = (i / (totalPoints - 1) * (keyPoints - 1)) - segmentIndex
      
      const interpolatedValue = keyValues[segmentIndex] + 
        (keyValues[nextSegmentIndex] - keyValues[segmentIndex]) * segmentPosition
      
      const smallWave = (Math.random() - 0.5) * volatility * Math.abs(finalAmount - initialAmount) * 0.1
      let value = interpolatedValue + smallWave
      
      if (value <= 0) value = initialAmount * 0.5
      
      chartData.push(value)
    }
    
    // Ensure the last point is the target final value
    chartData[totalPoints - 1] = finalAmount
    
    state.chartData = chartData
    return chartData
  }
  
  // Generate data on first use
  if (state.chartData.length === 0) {
    generateChartData()
  }
  
  return {
    config: computed(() => state.config),
    chartData: computed(() => state.chartData),
    updateConfig,
    generateChartData
  }
}
