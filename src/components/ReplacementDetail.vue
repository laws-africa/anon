<template>
  <div>
    <input type="text" v-model="replacement.oldText" disabled />
    <input type="text" v-model="replacement.newText" />
    <button class="btn btn-success" @click="apply">Save</button>
    <button class="btn btn-success" @click="discard">Discard</button>
  </div>
</template>

<script>
export default {
  emits: ['remove'],
  props: {
    replacement: Object,
  },
  methods: {
    apply() {
      const contentRoot = document.querySelector('#content-root');
      this.replacement.apply(contentRoot);
    },
    discard() {
      const contentRoot = document.querySelector('#content-root');
      this.replacement.unapply(contentRoot);
      this.$emit('remove', this.replacement);
    }
  }
}
</script>
