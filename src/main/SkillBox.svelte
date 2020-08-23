<script lang="ts">
  export let title = '';
  export let numberOfSkills;

  $: skillClass =
    numberOfSkills === 2 ? 'skill-x2' : numberOfSkills === 3 ? 'skill-x3' : '';
</script>

<section class="{`column-or-grid panel skill ${skillClass}`}">
  <h2>{title}</h2>
  <slot />
</section>
