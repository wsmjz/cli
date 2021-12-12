<template>
  <div id="app">
    <section>
      <p>form demo:</p>
      <form-demo />
    </section>
    <section>
      <p>tabs demo:</p>
      <tabs-demo />
    </section>
    <section>
      <p>message demo:</p>
      <message-demo />
    </section>
  </div>
</template>

<script>
import FormDemo from './components/formDemo'
import TabsDemo from './components/tabsDemo'
import MessageDemo from './components/messageDemo'

export default {
  name: 'App',
  components: {
    FormDemo, TabsDemo, MessageDemo
  }
}
</script>

<style>
#app {

}
</style>
