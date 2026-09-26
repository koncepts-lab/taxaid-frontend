<template>
  <div ref="el" class="w-full h-full"></div>
</template>

<script setup>
// Draws an ApexCharts chart directly and redraws it from scratch whenever options or series change.
// vue3-apexcharts JSON-copies the options on update, which drops every formatter function (number formats, tooltips).
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  options: { type: Object, required: true },
  series: { type: Array, required: true },
  type: { type: String, default: 'bar' },
  height: { type: [String, Number], default: '100%' },
})

const el = ref(null)
let chart = null
let token = 0

const draw = async () => {
  const mine = ++token
  const { default: ApexCharts } = await import('apexcharts')
  if (mine !== token || !el.value) return

  chart?.destroy()
  chart = new ApexCharts(el.value, {
    ...props.options,
    chart: { ...props.options.chart, type: props.type, height: props.height, width: '100%' },
    series: JSON.parse(JSON.stringify(props.series)),
  })
  await chart.render()
}

onMounted(draw)
watch(() => [props.options, props.series], draw)
onBeforeUnmount(() => {
  token++
  chart?.destroy()
  chart = null
})
</script>
