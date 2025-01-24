<template>
  <div>
    <input type="text" v-model="replacement.oldText" disabled />
    <input type="text" v-model="replacement.newText" />
    <button class="btn btn-success" @click="apply">Save</button>
    <button class="btn btn-success" @click="discard">Discard</button>
  </div>
</template>

<script>
import { getTextNodes } from "@lawsafrica/indigo-akn/dist/ranges";

export default {
  emits: ['remove', 'applied'],
  props: {
    replacement: Object,
  },
  data() {
    return {
      marks: [],
    };
  },
  mounted () {
    this.mark();
  },
  methods: {
    apply() {
      const contentRoot = document.querySelector('#content-root');
      this.replacement.apply(contentRoot);
      this.mark();
      this.$emit('applied', this.replacement);
    },
    discard() {
      const contentRoot = document.querySelector('#content-root');
      this.replacement.unapply(contentRoot);
      this.unmark();
      this.$emit('remove', this.replacement);
    },
    mark () {
      this.unmark();

      const contentRoot = document.querySelector('#content-root');
      const range = this.replacement.toRange(contentRoot);

      for (const textNode of getTextNodes(range)) {
        if (textNode.parentElement) {
          let mark = textNode.ownerDocument.createElement('mark');
          textNode.parentElement.insertBefore(mark, textNode);
          mark.appendChild(textNode);
          this.marks.push(mark);
        }
      }
    },
    unmark () {
      for (const mark of this.marks) {
        const parent = mark.parentElement;
        while (parent && mark.firstChild) {
          parent.insertBefore(mark.firstChild, mark);
        }
        mark.remove();
      }
      this.marks = [];
    }
  }
}
</script>
