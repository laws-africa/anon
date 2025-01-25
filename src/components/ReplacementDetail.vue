<template>
  <li class="list-group-item replacement" @click="clicked" :class="classes">
    <div v-html="replacement.snippet()" class="mb-1" />
    <div class="d-flex">
      <input type="text" v-model="newText" class="form-control me-auto" />
      <button class="btn btn-success ms-2" @click="apply" v-if="dirty"><i class="bi bi-check"></i></button>
      <button class="btn btn-danger ms-2 " @click="discard"><i class="bi bi-trash"></i></button>
    </div>
  </li>
</template>

<script>
export default {
  emits: ['remove', 'applied'],
  props: ['replacement', 'active'],
  data (self) {
    return {
      newText: self.replacement.newText,
    };
  },
  mounted () {
    this.mark();
  },
  computed: {
    dirty () {
      return !this.replacement.applied || this.newText !== this.replacement.newText;
    },
    classes () {
      const classes = [];
      if (this.replacement.applied) classes.push('applied');
      if (this.active) classes.push('is-active');
      return classes.join(' ');
    }
  },
  methods: {
    apply() {
      this.replacement.newText = this.newText;
      this.replacement.apply(this.getContentRoot());
      this.mark();
      this.$emit('applied', this.replacement);
    },
    discard() {
      this.replacement.unmark();
      this.replacement.unapply(this.getContentRoot());
      this.$emit('remove', this.replacement);
    },
    mark() {
      this.replacement.mark(this.getContentRoot());
      for (const mark of this.replacement.marks) {
        mark.addEventListener('click', () => {
          this.markClicked();
        });
      }
    },
    markClicked() {
      this.activateMarks();
      this.$el.scrollIntoView({ behavior: "smooth" });
      this.$emit('activated', this.replacement);
    },
    clicked () {
      this.activateMarks();
      this.replacement.marks[0].scrollIntoView({ behavior: "smooth" });
      this.$emit('activated', this.replacement);
    },
    activateMarks() {
      // a mark was clicked, activate this replacement
      for (const mark of this.getContentRoot().querySelectorAll('mark.is-active')) {
        mark.classList.remove('is-active');
      }
      for (const mark of this.replacement.marks) {
        mark.classList.add('is-active');
      }
    },
    getContentRoot () {
      return document.querySelector('#content-root');
    }
  }
}
</script>
