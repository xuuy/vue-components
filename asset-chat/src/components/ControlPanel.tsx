import { defineComponent, ref } from 'vue'
import { useChartStore } from '../store/chartStore'
import { Form, InputNumber, Slider, Button, Tabs } from 'ant-design-vue'
import type { TabPaneProps, TabsProps } from 'ant-design-vue'

export default defineComponent({
  name: 'ControlPanel',
  setup() {
    const chartStore = useChartStore()
    
    const formState = ref({
      initialAmount: 1000,
      finalAmount: 15000,
      volatility: 0.8,
      trend: 0.6,
      totalPoints: 120,
    })
    
    const updateChart = () => {
      chartStore.updateConfig({
        initialAmount: formState.value.initialAmount,
        finalAmount: formState.value.finalAmount,
        volatility: formState.value.volatility,
        trend: formState.value.trend,
        totalPoints: formState.value.totalPoints,
      })
      
      chartStore.generateChartData()
    }
    
    const randomizeData = () => {
      formState.value.initialAmount = Math.floor(Math.random() * 1900 + 100)
      formState.value.finalAmount = Math.floor(Math.random() * 1900 + 100)
      formState.value.volatility = parseFloat((Math.random() * 2.9 + 0.1).toFixed(1))
      formState.value.trend = parseFloat((Math.random() * 0.9 + 0.1).toFixed(1))
      formState.value.totalPoints = Math.floor(Math.random() * 180 + 20)
      
      updateChart()
    }
    
    const resetData = () => {
      formState.value = {
        initialAmount: 1000,
        finalAmount: 15000,
        volatility: 0.8,
        trend: 0.6,
        totalPoints: 120,
      }
      
      updateChart()
    }
    
    const tabItems: TabPaneProps[] = [
      {
        tabKey: 'data',
        tab: '资产参数',
        childrens: (
          <Form layout="vertical">
            <Form.Item label="起始资金">
              <InputNumber 
                v-model:value={formState.value.initialAmount}
                min={0} 
                step={100}
                class="w-full"
                onChange={updateChart}
              />
            </Form.Item>
            
            <Form.Item label="最终资金">
              <InputNumber 
                v-model:value={formState.value.finalAmount}
                min={0} 
                step={100}
                class="w-full"
                onChange={updateChart}
              />
            </Form.Item>
            
            <Form.Item label="波动程度">
              <Slider 
                v-model:value={formState.value.volatility}
                min={0} 
                max={3} 
                step={0.1}
                onChange={updateChart}
              />
            </Form.Item>
            
            <Form.Item label="趋势强度">
              <Slider 
                v-model:value={formState.value.trend}
                min={0} 
                max={1} 
                step={0.1}
                onChange={updateChart}
              />
            </Form.Item>
            
            <Form.Item label="数据点数量">
              <InputNumber 
                v-model:value={formState.value.totalPoints}
                min={20} 
                max={500} 
                step={10}
                class="w-full"
                onChange={updateChart}
              />
            </Form.Item>
          </Form>
        )
      }
    ]
    
    return () => (
      <div>
        <h3 class="text-primary border-b border-dark-500 pb-1 mt-0">图表参数设置</h3>
        
        <Tabs>
            {tabItems.map((item: TabPaneProps) => (
                <Tabs.TabPane key={item.tabKey} tab={item.tab}>
                {item.childrens}
                </Tabs.TabPane>
            ))}
        </Tabs>
        
        <div class="flex gap-2 mt-4 justify-end">
          <Button 
            type="primary" 
            class="bg-primary"
            onClick={updateChart}
          >
            更新图表
          </Button>
          <Button 
            class="bg-blue-500 text-white"
            onClick={randomizeData}
          >
            随机数据
          </Button>
          <Button onClick={resetData}>重置参数</Button>
        </div>
      </div>
    )
  }
})
