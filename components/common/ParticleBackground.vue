<template>
  <div class="particle-background">
    <canvas ref="canvas" class="particle-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const { isDark } = useTheme()

const canvas = ref(null)
let ctx = null
let particles = []
let animationId = null

class Particle {
  constructor(canvasWidth, canvasHeight, centerX, centerY) {
    // Random angle for circular distribution
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * Math.min(canvasWidth, canvasHeight) * 0.4
    
    this.x = centerX + Math.cos(angle) * distance
    this.y = centerY + Math.sin(angle) * distance
    
    // Velocity for gentle movement
    this.vx = (Math.random() - 0.5) * 0.5
    this.vy = (Math.random() - 0.5) * 0.5
    
    this.size = Math.random() * 2.5 + 0.5
    this.opacity = Math.random() * 0.5 + 0.2
    
    this.centerX = centerX
    this.centerY = centerY
    this.maxDistance = Math.min(canvasWidth, canvasHeight) * 0.45
  }
  
  update(canvasWidth, canvasHeight) {
    this.x += this.vx
    this.y += this.vy
    
    // Calculate distance from center
    const dx = this.x - this.centerX
    const dy = this.y - this.centerY
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // If particle goes too far from center, gently pull it back
    if (distance > this.maxDistance) {
      const angle = Math.atan2(dy, dx)
      this.vx -= Math.cos(angle) * 0.02
      this.vy -= Math.sin(angle) * 0.02
    }
    
    // Damping to keep particles from moving too fast
    this.vx *= 0.99
    this.vy *= 0.99
    
    // Add slight random movement
    this.vx += (Math.random() - 0.5) * 0.02
    this.vy += (Math.random() - 0.5) * 0.02
  }
  
  draw(ctx) {
    ctx.fillStyle = isDark.value 
      ? `rgba(255, 255, 255, ${this.opacity * 0.8})` 
      : `rgba(0, 183, 148, ${this.opacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const initCanvas = () => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')
  resizeCanvas()
  
  // Create particles
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  const particleCount = 300
  
  particles = []
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.value.width, canvas.value.height, centerX, centerY))
  }
  
  animate()
}

const resizeCanvas = () => {
  if (!canvas.value) return
  canvas.value.width = canvas.value.offsetWidth
  canvas.value.height = canvas.value.offsetHeight
}

const animate = () => {
  if (!ctx || !canvas.value) return
  
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Draw radial gradient background
  const centerX = canvas.value.width / 2
  const centerY = canvas.value.height / 2
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(canvas.value.width, canvas.value.height) * 0.5)
  if (isDark.value) {
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.02)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  } else {
    gradient.addColorStop(0, 'rgba(0, 183, 148, 0.15)')
    gradient.addColorStop(0.5, 'rgba(0, 183, 148, 0.05)')
    gradient.addColorStop(1, 'rgba(0, 183, 148, 0)')
  }
  
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Update and draw particles
  particles.forEach(particle => {
    particle.update(canvas.value.width, canvas.value.height)
    particle.draw(ctx)
  })
  
  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', resizeCanvas)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', resizeCanvas)
})
</script>

<style scoped>
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
