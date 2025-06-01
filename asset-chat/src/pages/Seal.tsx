import { defineComponent, ref } from 'vue'
import CustomSeal from '../components/Seal'

export default defineComponent({
  name: 'SealDemo',
  setup() {
    const sealName = ref('泰州市美堰区市场监督管理局');
    const sealNumber = ref('NCTEN593WWW8593593');
    const sealSize = ref(400);
    const sealColor = ref('#FF0000');
    const sealWorn = ref(false);
    const sealWornLevel = ref(0.5);
    
    return () => (
      <div class="seal-demo p-4">
        <h1 class="text-2xl font-bold mb-4">印章生成器</h1>
        
        <div class="flex flex-wrap gap-8">
          <div class="controls space-y-4 w-80">
            <div>
              <label class="block mb-1">印章名称:</label>
              <input 
                v-model={sealName.value} 
                class="w-full border p-2 rounded" 
                type="text" 
              />
            </div>
            
            <div>
              <label class="block mb-1">印章编号:</label>
              <input 
                v-model={sealNumber.value} 
                class="w-full border p-2 rounded" 
                type="text" 
              />
            </div>
            
            <div>
              <label class="block mb-1">印章大小: {sealSize.value}px</label>
              <input 
                v-model={sealSize.value} 
                class="w-full" 
                type="range" 
                min="100" 
                max="400" 
              />
            </div>
            
            <div>
              <label class="block mb-1">印章颜色:</label>
              <input 
                v-model={sealColor.value} 
                class="w-full h-10" 
                type="color" 
              />
            </div>
            
            {/* 新增磨损效果控制 */}
            <div>
              <div class="flex items-center gap-2">
                <input 
                  v-model={sealWorn.value} 
                  type="checkbox" 
                  id="worn-toggle" 
                />
                <label for="worn-toggle" class="mb-1">启用磨损效果</label>
              </div>
              
              {sealWorn.value && (
                <div class="mt-2">
                  <label class="block mb-1">磨损程度: {Math.round(sealWornLevel.value * 100)}%</label>
                  <input 
                    v-model={sealWornLevel.value} 
                    class="w-full" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.05" 
                  />
                </div>
              )}
            </div>
          </div>
          
          <div class="preview flex items-center justify-center bg-black-100 p-4 min-w-[400px] min-h-[400px]">
            <CustomSeal 
              name={sealName.value} 
              serialNumber={sealNumber.value} 
              size={sealSize.value} 
              color={sealColor.value}
              worn={sealWorn.value}
              wornLevel={sealWornLevel.value} 
            />
          </div>
        </div>
      </div>
    )
  }
})