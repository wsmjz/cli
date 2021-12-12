<template>
  <div class="demo-box">
    <button @click="open">open</button>
    <button @click="injectOpen">inject open</button>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref, getCurrentInstance, render, createRenderer, createVNode, inject} from 'vue';
import {MessageService} from 'vue3-libs/src/components/Message';

const messageServe = new MessageService();

export default defineComponent({
  name: 'TabDemo',
  components: {

  },
  setup() {
    const msgs = [0, 1, 2, 3];
    const open = () => {
      msgs.forEach(item => {
        const m = messageServe.create('消息' + item, { duration: 2000 });
        m.onClose.on<string>('close', id => {
          console.log('m on close', id);
        });
      })
    }
    const injectMessage = inject<MessageService>('customKey'); // 不能用在方法内部
    const injectOpen = () => {
      const m = injectMessage!.create('消息', { duration: 2000 });
      m.onClose.on<string>('close', id => {
        console.log('m on close', id);
      });
    }
    return {
      open,
      injectOpen
    }
  }
});
</script>
