<template>
  <div>
    <button class="btn btn-primary" @click="newReplacement">Replace...</button>
    <div v-for="group of groups.values()" :key="group.key" class="mt-3">
      <ReplacementGroupDetail
        :group="group"
        @remove="remove"
        @applied="applied"
        v-model="activeReplacement"
      />
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
  data() {
    return {
      activeReplacement: null,
      groups: new Map(),
    };
  },
  methods: {
    newReplacement() {
      const selection = window.getSelection();
      const contentRoot = this.getContentRoot();

      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
          // TODO: is it within the document?
          range.toString();

          const replacement = new Replacement(contentRoot, range.toString(), range.toString(), rangeToTarget(range, contentRoot));
          // ensure there are marks before new suggestions are searched
          replacement.mark();
          this.replacements.push(replacement);
          this.updateGroups();
          this.activeReplacement = replacement;
        }
      }
    },
    remove (replacement) {
      const ix = this.replacements.indexOf(replacement);
      if (ix > -1) {
        this.replacements.splice(ix, 1);
        this.updateGroups();
      }
    },
    applied (replacement) {
      if (replacement.suggestion) {
        replacement.suggestion = false;
        this.replacements.push(replacement);
      }
      this.updateGroups();
    },
    updateGroups () {
      const newGroups = new Map();

      // group by the grouping function
      for (const replacement of this.replacements) {
        if (!newGroups.has(replacement.grouping())) {
          newGroups.set(replacement.grouping(), []);
        }
        newGroups.get(replacement.grouping()).push(replacement);
      }

      // map into group objects
      for (const [key, replacements] of newGroups) {
        if (this.groups.has(key)) {
          const group = this.groups.get(key);
          group.replace(replacements);
        } else {
          this.groups.set(key, new ReplacementGroup(replacements));
        }
      }

      // delete groups that are all suggestions or deleted
      for (const [key, group] of this.groups) {
        if (!newGroups.has(key) || group.replacements.length === 0) {
          for (const replacement of group.suggestions) {
            replacement.unmark();
          }
          this.groups.delete(key);
        }
      }

      for (const group of this.groups.values()) {
        group.populateSuggestions();
      }
    },
    getContentRoot () {
      return document.querySelector('#content-root');
    }
  }
}
</script>
