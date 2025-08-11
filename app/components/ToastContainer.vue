<template>
  <div class="toast-container">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'toast',
          `toast-${toast.type}`
        ]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-content">
          <Icon
            :name="getToastIcon(toast.type)"
            class="toast-icon"
          />
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button
          class="toast-close"
          @click.stop="removeToast(toast.id)"
          aria-label="Close notification"
        >
          <Icon name="material-symbols:close" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
const { toasts, removeToast } = useToast();

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'material-symbols:check-circle-outline';
    case 'error':
      return 'material-symbols:error-outline';
    case 'warning':
      return 'material-symbols:warning-outline';
    case 'info':
    default:
      return 'material-symbols:info-outline';
  }
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 300px;
  max-width: 500px;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  cursor: pointer;
  pointer-events: auto;
  border: 2px solid;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  transform: translateX(0);
}

.toast:hover {
  transform: translateX(-4px);
}

.toast-content {
  display: flex;
  align-items: center;
  flex: 1;
}

.toast-icon {
  margin-right: 12px;
  font-size: 20px;
}

.toast-message {
  margin: 0;
  line-height: 1.4;
  flex: 1;
}

.toast-close {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  margin-left: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Toast type styles */
.toast-error {
  border-color: #ff0040;
  color: #ff0040;
  box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
}

.toast-success {
  border-color: #00ff80;
  color: #00ff80;
  box-shadow: 0 0 20px rgba(0, 255, 128, 0.3);
}

.toast-warning {
  border-color: #ffaa00;
  color: #ffaa00;
  box-shadow: 0 0 20px rgba(255, 170, 0, 0.3);
}

.toast-info {
  border-color: #00ffff;
  color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
}

/* Transitions */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}

@media (max-width: 640px) {
  .toast-container {
    left: 20px;
    right: 20px;
    top: 20px;
  }

  .toast {
    min-width: auto;
    max-width: none;
  }
}
</style>
