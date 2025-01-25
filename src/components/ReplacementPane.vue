<template>
  <div>
    <button class="btn btn-primary" @click="newReplacement">Replace...</button>
    <div v-for="group in replacementGroups" :key="group.key" class="mt-3">
      <ReplacementGroupDetail :group="group" @applied="applied" @remove="remove" />
    </div>
  </div>
</template>

<script>
import { Replacement, ReplacementGroup } from "@/replacements.js";
import { rangeToTarget } from "@lawsafrica/indigo-akn/dist/ranges";
import ReplacementGroupDetail from "@/components/ReplacementGroupDetail.vue";

export default {
  components: {ReplacementGroupDetail},
  props: {
    replacements: Array,
  },
  computed: {
    replacementGroups() {
      const groups = {};
      for (const replacement of this.replacements) {
        if (!(replacement.grouping() in groups)) {
          groups[replacement.grouping()] = [];
        }
        groups[replacement.grouping()].push(replacement);
      }

      return Object.values(groups).map((replacements) => new ReplacementGroup(replacements));
    }
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
    remove (replacement) {
      this.replacements.splice(this.replacements.indexOf(replacement), 1);
    },
    applied (replacement) {
      // find other possibilities
      const root = document.querySelector('#content-root');
      for (const range of replacement.find(root)) {
        this.replacements.push(
          new Replacement(
            range.toString(),
            replacement.newText,
            rangeToTarget(range, root)
          )
        );
      }
    }
  }
}
</script>
