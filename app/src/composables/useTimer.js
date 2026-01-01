import { ref, computed, onUnmounted } from 'vue';

export function useTimer(defaultDuration = 60) {
    const timeRemaining = ref(defaultDuration);
    const isActive = ref(false);
    let intervalId = null;

    const formattedTime = computed(() => {
        const minutes = Math.floor(timeRemaining.value / 60);
        const seconds = timeRemaining.value % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    });

    const progress = computed(() => ((defaultDuration - timeRemaining.value) / defaultDuration) * 100);

    function start(duration) {
        if (duration !== undefined) timeRemaining.value = duration;
        if (isActive.value) return;
        
        isActive.value = true;
        intervalId = setInterval(() => {
            if (timeRemaining.value > 0) {
                timeRemaining.value--;
            } else {
                stop();
            }
        }, 1000);
    }

    function stop() {
        isActive.value = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    function reset(duration = defaultDuration) {
        stop();
        timeRemaining.value = duration;
    }

    function toggle() {
        if (isActive.value) stop();
        else start();
    }

    onUnmounted(() => {
        stop();
    });

    return {
        timeRemaining,
        isActive,
        formattedTime,
        progress,
        start,
        stop,
        reset,
        toggle
    };
}
