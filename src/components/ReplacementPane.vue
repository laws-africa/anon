<template>
  <div>
    <button class="btn btn-primary" @click="newReplacement">Replace...</button>
    <ol class="mt-3">
      <li v-for="replacement in replacements" :key="replacement.id">
        <ReplacementDetail :replacement="replacement" @remove="removeReplacement" />
      </li>
    </ol>
  </div>
</template>

<script>
import { Replacement } from "@/replacements.js";
import { rangeToTarget } from "@lawsafrica/indigo-akn/dist/ranges";
import ReplacementDetail from "@/components/ReplacementDetail.vue";

export default {
  components: {ReplacementDetail},
  props: {
    replacements: Array,
  },
  methods: {
    newReplacement() {
      const selection = window.getSelection();
      const contentRoot = document.querySelector('#content-root');

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          // TODO: is it within the document?
          range.toString();

          const replacement = new Replacement(range.toString(), range.toString(), rangeToTarget(range, contentRoot));
          this.replacements.push(replacement);
        }
      }
    },
    removeReplacement (replacement) {
      this.replacements.splice(this.replacements.indexOf(replacement), 1);
    }
  }
}
</script>
