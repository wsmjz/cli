<template>
  <div class="demo-box">
    <tabs v-model="currentTab">
      <tab-pane name="aaa">
        <template #title="{ name }">
          <b>customTab-{{ name }}</b>
        </template>
        aaaa
      </tab-pane>
      <tab-pane name="bbb">bbb</tab-pane>
      <tab-pane name="ccc">cccc</tab-pane>
    </tabs>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

export default defineComponent({
  name: 'TabDemo',
  setup() {
    const currentTab = ref('');
    return {
      currentTab
    }
  }
});
</script>
