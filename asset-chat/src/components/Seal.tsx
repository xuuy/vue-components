import { defineComponent, computed, PropType } from "vue";

export interface SealProps {
  name: string; // 印章名称
  serialNumber?: string; // 印章编号
  size?: number; // 印章大小
  color?: string; // 印章颜色
}

export default defineComponent({
  name: "CustomSeal",
  props: {
    name: {
      type: String as PropType<string>,
      required: true,
    },
    serialNumber: {
      type: String as PropType<string>,
      default: "",
    },
    size: {
      type: Number as PropType<number>,
      default: 400,
    },
    color: {
      type: String as PropType<string>,
      default: "#FF0000",
    },
  },
  setup(props) {
    const radius = computed(() => props.size / 2);
    const centerX = computed(() => radius.value);
    const centerY = computed(() => radius.value);

    // 生成五角星路径
    const starPath = computed(() => {
      const cx = centerX.value;
      const cy = centerY.value;
      // 更大的五角星 - 占据中心位置更多空间
      const r = radius.value / 3.2;
      const points = 5;
      const outerRadius = r;
      const innerRadius = r * 0.4;
      const startAngle = -Math.PI / 2;

      const coordinates = [];

      for (let i = 0; i < points * 2; i++) {
        const angle = startAngle + (i * Math.PI) / points;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        coordinates.push(`${x},${y}`);
      }

      return `M${coordinates.join(" L")} Z`;
    });

    // 生成圆弧上的文字（名称）
    const nameTextPaths = computed(() => {
      if (!props.name) return [];

      const centerX = radius.value;
      const centerY = radius.value;

      const characters = props.name.split("");

      // 固定的起始角度和结束角度
      const startAngle = -Math.PI * 1.15; // 右上方 (-135度)
      const endAngle = Math.PI * 0.15; // 左上方 (15度)
      const arcLength = endAngle - startAngle;
      const angleStep = arcLength / (characters.length - 1 || 1);

      // 根据字符数量动态调整文字大小
      // 基础字体大小
      const baseFontSize = radius.value * 0.25;
      // 计算合适的字体大小，以避免重叠
      // 当字符数增加时，逐渐减小字体大小
      let fontSize = baseFontSize;

      // 使用比例计算与圆的间距，保持适当的比例
      let r = radius.value * 0.75; // 名称文字距离中心的距离约为半径的75%
      // 字符数超过临界值时开始缩小字体
      const criticalCount = 13;
      if (characters.length > criticalCount) {
        // 缩放因子：字符越多，缩放越大
        const scaleFactor =
          1 - Math.min(0.6, (characters.length - criticalCount) * 0.05);
        fontSize = baseFontSize * scaleFactor;
        r = r + fontSize * (1 - scaleFactor); // 保持与圆的距离
      }

      return characters.map((char, i) => {
        const angle = startAngle + i * angleStep;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        // 调整文字旋转 - 文字底部朝向圆心
        const rotation = (angle + Math.PI / 2) * (180 / Math.PI);

        return { char, x, y, rotation, fontSize };
      });
    });

    // 生成圆弧上的文字（编号）- 环绕底部的弧形
    const serialTextPaths = computed(() => {
      if (!props.serialNumber) return [];

      const centerX = radius.value;
      const centerY = radius.value;
      // 使用比例计算与圆的间距，保持适当的比例
      const r = radius.value * 0.88; // 编号文字距离中心的距离约为半径的88%，更靠近外圆
      const characters = props.serialNumber.split("");

      // 底部环绕，弧形排列 - 调整顺序为从左到右正向阅读
      const startAngle = Math.PI * 0.75; // 开始于左侧 (135度)
      const endAngle = Math.PI * 0.25; // 结束于右侧 (-45度)
      const arcLength = startAngle - endAngle; // 计算正确的弧长
      const angleStep = arcLength / (characters.length - 1 || 1);

      return characters.map((char, i) => {
        // 从左到右排列，确保阅读顺序正确
        const angle = startAngle - i * angleStep;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);

        // 调整文字旋转 - 编号文字正向可读
        const rotation = (angle - Math.PI / 2) * (180 / Math.PI);

        return { char, x, y, rotation };
      });
    });

    // 返回渲染函数
    return () => (
      <div
        class="custom-seal"
        style={{ width: `${props.size}px`, height: `${props.size}px` }}
      >
        <svg
          width={props.size}
          height={props.size}
          viewBox={`0 0 ${props.size} ${props.size}`}
        >
          {/* 外圆 - 更粗的边框 */}
          <circle
            cx={centerX.value}
            cy={centerY.value}
            r={radius.value * 0.95} // 圆的半径为整体半径的95%
            fill="none"
            stroke={props.color}
            stroke-width={`${radius.value * 0.05}px`} // 边框宽度与印章大小成比例
          />

          {/* 五角星 */}
          <path d={starPath.value} fill={props.color} />

          {/* 名称文字 */}
          {nameTextPaths.value.map((item) => (
            <text
              x={item.x}
              y={item.y}
              fill={props.color}
              font-family="宋体"
              font-size={`${item.fontSize}px`} // 使用动态计算的字体大小
              font-weight="normal"
              text-anchor="middle"
              dominant-baseline="middle"
              transform={`rotate(${item.rotation}, ${item.x}, ${item.y})`}
            >
              {item.char}
            </text>
          ))}

          {/* 编号文字 */}
          {serialTextPaths.value.map((item) => (
            <text
              x={item.x}
              y={item.y}
              fill={props.color}
              font-family="宋体"
              font-size={`${radius.value * 0.1}px`} // 字体大小与印章大小成比例
              text-anchor="middle"
              dominant-baseline="middle"
              transform={`rotate(${item.rotation}, ${item.x}, ${item.y})`}
            >
              {item.char}
            </text>
          ))}
        </svg>
      </div>
    );
  },
});
