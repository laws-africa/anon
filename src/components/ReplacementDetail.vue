<template>
  <div>
    <div v-html="replacement.snippet()" class="mb-1" />
    <div class="d-flex">
      <input type="text" v-model="newText" class="form-control me-auto" />
      <button class="btn btn-success ms-2" @click="apply" v-if="dirty"><i class="bi bi-check"></i></button>
      <button class="btn btn-danger ms-2 " @click="discard"><i class="bi bi-trash"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['remove', 'applied'],
  props: {
    replacement: Object,
  },
  data (self) {
    return {
      newText: self.replacement.newText,
    };
  },
  mounted () {
    this.replacement.mark(document.querySelector('#content-root'));
  },
  computed: {
    dirty () {
      return !this.replacement.applied || this.newText !== this.replacement.newText;
    }
  },
  methods: {
    apply() {
      const contentRoot = document.querySelector('#content-root');
      this.replacement.newText = this.newText;
      this.replacement.apply(contentRoot);
      this.replacement.mark(contentRoot);
      this.$emit('applied', this.replacement);
    },
    discard() {
      this.replacement.unmark();
      this.replacement.unapply(document.querySelector('#content-root'));
      this.$emit('remove', this.replacement);
    },
  }
}
</script>
