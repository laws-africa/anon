<template>
  <div class="card">
    <div class="card-header d-flex">
      <h6>
        {{ group.title }}
        <span class="ms-2 badge text-bg-secondary">{{group.replacements.length}} / {{group.replacements.length + group.suggestions.length}}</span>
      </h6>
      <button class="btn btn-success ms-auto" @click="apply" :disabled="!canApply" title="Apply"><i class="bi bi-check"></i></button>
      <button class="btn btn-success ms-2" @click="unapply" :disabled="!canUnapply" title="Undo"><i class="bi bi-arrow-counterclockwise"></i></button>
    </div>
    <ul class="list-group list-group-flush replacement-group-items">
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
  computed: {
    canApply () {
      return this.group.replacements.some(r => !r.applied);
    },
    canUnapply () {
      return this.group.replacements.some(r => r.applied);
    }
  },
  methods: {
    apply () {
      for (const replacement of this.group.replacements) {
        replacement.apply();
        this.$emit('applied', replacement);
      }
      for (const replacement of this.group.suggestions) {
        replacement.apply();
        this.$emit('applied', replacement);
      }
    },
    unapply () {
      for (const replacement of this.group.replacements) {
        replacement.unapply();
        this.$emit('unapplied', replacement);
      }
    },
    applied (replacement) {
      this.$emit('applied', replacement);
    },
    removed (replacement) {
      this.$emit('remove', replacement);
    }
  }
}
</script>

<style>
.replacement-group-items {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
