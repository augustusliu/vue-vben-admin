<template>
  <div class="p-4">
    <MetricCard :loading="loading" class="enter-y" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import MetricCard from './MetricCard.vue';

  export default defineComponent({
    components: {
      MetricCard
    },
    setup() {
      const loading = ref(true);

      setTimeout(() => {
        loading.value = false;
      }, 1500);

      return { loading };
    },
  });
</script>
