<template>
  <div class="error-page">
    <!-- Automatic Animated Glow -->
    <div class="glow-orb"></div>

    <!-- Main Content -->
    <div class="circles-wrapper">
      
      <!-- 4 Circle -->
      <div class="circle offset-down z-10">
        <p class="top-text">OOOPS</p>
        <h1 class="main-number">4</h1>
        <p class="bottom-text">WE'RE SORRY</p>
      </div>

      <!-- 0 Circle -->
      <div class="circle center-circle z-20">
        <p class="top-text">PAGE NOT</p>
        <h1 class="main-number">0</h1>
        <p class="bottom-text">FOUND</p>
      </div>

      <!-- 4 Circle -->
      <div class="circle offset-up z-10">
        <p class="top-text">SOMETHING</p>
        <h1 class="main-number">4</h1>
        <p class="bottom-text">IS BROKEN</p>
      </div>
      
    </div>
    
    <!-- Go back button -->
    <button @click="handleError" class="return-btn">
      BACK TO HOME →
    </button>
  </div>
</template>

<script setup>
import { useCookie, clearError } from '#imports'

const props = defineProps({
  error: Object
})

const handleError = () => {
  const adminToken = useCookie('admin_token')
  const rpToken = useCookie('rp_token')
  const authToken = useCookie('auth_token')
  
  let redirectUrl = '/home'
  
  if (adminToken.value) {
    redirectUrl = '/admin'
  } else if (rpToken.value) {
    redirectUrl = '/revenue-partnership/select-dashboard'
  } else if (authToken.value) {
    redirectUrl = '/dashboard'
  }
  
  clearError({ redirect: redirectUrl })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  background-color: #0d0e11;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: system-ui, sans-serif;
  color: white;
  user-select: none;
}

/* Automatic roaming animation for the background glow */
@keyframes roam {
  0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
  33% { transform: translate(15vw, -10vh) scale(1.2); opacity: 0.6; }
  66% { transform: translate(-10vw, 15vh) scale(0.9); opacity: 0.5; }
  100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
}

.glow-orb {
  pointer-events: none;
  position: absolute;
  width: 1000px;
  height: 1000px;
  border-radius: 50%;
  filter: blur(120px);
  /* TaxAid Green Color: #008169 (0, 129, 105) */
  background: radial-gradient(circle, rgba(0, 129, 105, 0.4) 0%, rgba(0, 0, 0, 0) 60%);
  top: 50%;
  left: 50%;
  margin-top: -500px;
  margin-left: -500px;
  animation: roam 12s infinite ease-in-out;
}

.circles-wrapper {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Tiny gap so the borders do not merge/overlap */
  gap: 2px;
}

/* Newton's Cradle Pendulum animations */
@keyframes swing-left {
  0% { transform: rotate(0deg); animation-timing-function: ease-out; }
  /* Positive degree swings it LEFT (outward) */
  25% { transform: rotate(25deg); animation-timing-function: ease-in; }
  50% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

@keyframes swing-right {
  0% { transform: rotate(0deg); }
  50% { transform: rotate(0deg); animation-timing-function: ease-out; }
  /* Negative degree swings it RIGHT (outward) */
  75% { transform: rotate(-25deg); animation-timing-function: ease-in; }
  100% { transform: rotate(0deg); }
}

@keyframes center-react {
  /* Right ball hits center (momentum goes LEFT) */
  0%   { transform: translateX(-3px); animation-timing-function: ease-out; }
  5%   { transform: translateX(1px); animation-timing-function: ease-in-out; }
  10%  { transform: translateX(0px); }
  
  /* Left ball hits center (momentum goes RIGHT) */
  50%  { transform: translateX(3px); animation-timing-function: ease-out; }
  55%  { transform: translateX(-1px); animation-timing-function: ease-in-out; }
  60%  { transform: translateX(0px); }
  
  100% { transform: translateX(-3px); }
}

.circle {
  position: relative;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  flex-shrink: 0;
  /* Pivot point far above the circle to create a pendulum string effect */
  transform-origin: 50% -350px;
}

.offset-down {
  /* Left circle */
  margin: 0;
  animation: swing-left 2s infinite linear;
}

.center-circle {
  /* Center circle (stationary) */
  margin: 0;
  z-index: 20;
  animation: center-react 2s infinite linear;
}

.offset-up {
  /* Right circle */
  margin: 0;
  animation: swing-right 2s infinite linear;
}

.top-text {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  position: absolute;
  top: 45px;
}

.main-number {
  font-size: 120px;
  font-weight: 300;
  line-height: 1;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Inter', system-ui, sans-serif;
  margin: 0;
}

.bottom-text {
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  position: absolute;
  bottom: 45px;
}

.return-btn {
  position: absolute;
  bottom: 60px;
  padding: 12px 30px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.5);
  background: transparent;
  cursor: pointer;
  z-index: 30;
  transition: all 0.3s ease;
}

.return-btn:hover {
  color: white;
  border-color: white;
  background: rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  .circles-wrapper {
    flex-direction: column;
    gap: 10px;
  }
  .center-circle {
    margin: 0;
  }
  .offset-down, .offset-up {
    margin-top: 0;
  }
}
</style>
