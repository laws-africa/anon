<template>
  <div class="card">
    <div class="card-header d-flex">
      <h6 @click="toggle">
        <span v-if="collapsed" class="toggle">▶</span>
        <span v-if="!collapsed" class="toggle">▼</span>
        {{ group.title }}
        <span class="ms-2 badge text-bg-secondary">{{nApplied}} / {{group.replacements.length + group.suggestions.length}}</span>
      </h6>
      <button class="btn btn-success ms-auto" @click="apply" :disabled="!canApply" title="Apply"><i class="bi bi-check"></i></button>
      <button class="btn btn-success ms-2" @click="unapply" :disabled="!canUnapply" title="Undo"><i class="bi bi-arrow-counterclockwise"></i></button>
    </div>
    <ul :class="`list-group list-group-flush replacement-group-items ${collapsed ? 'd-none' : ''}`">
      <template v-for="replacement of group.replacements" :key="replacement.id">
        <ReplacementDetail
          :replacement="replacement"
          :active="replacement === modelValue"
          @remove="removed"
          @applied="applied"
          @activated="$emit('update:modelValue', replacement)"
        />
      </template>
      <template v-for="replacement of group.suggestions" :key="replacement.id">
        <ReplacementDetail
          :replacement="replacement"
          :active="replacement === modelValue"
          @remove="removed"
          @applied="applied"
          @activated="$emit('update:modelValue', replacement)"
        />
      </template>
    </ul>
  </div>
</template>

<script>
import ReplacementDetail from "@/components/ReplacementDetail.vue";

export default {
  props: ['group', 'modelValue'],
  components: { ReplacementDetail },
  emits: ['remove', 'applied', 'unapplied'],
  data () {
    return {
      collapsed: false,
    };
  },
  computed: {
    canApply () {
      return this.group.replacements.some(r => !r.applied) || this.group.suggestions.length > 0;
    },
    canUnapply () {
      return this.group.replacements.some(r => r.applied);
    },
    nApplied () {
      return this.group.replacements.filter(r => r.applied).length;
    }
  },
  methods: {
    apply () {
      const replacements = this.group.replacements.concat(this.group.suggestions);
      for (const replacement of replacements) {
        replacement.apply();
        replacement.mark();
        this.$emit('applied', replacement);
      }
    },
    unapply () {
      const replacements = this.group.replacements.concat(this.group.suggestions);
      for (const replacement of replacements) {
        replacement.unapply();
        replacement.mark();
        this.$emit('unapplied', replacement);
      }
    },
    applied (replacement) {
      this.$emit('applied', replacement);
    },
    removed (replacement) {
      this.$emit('remove', replacement);
    },
    toggle () {
      this.collapsed = !this.collapsed;
    }
  }
}
</script>

<style>
.replacement-group-items {
  max-height: 50vh;
  overflow-y: auto;
}

.toggle {
  cursor: pointer;
}
</style>
