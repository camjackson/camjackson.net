<script lang="ts">
  import Panel from './Panel.svelte';
  import H2 from './H2.svelte';

  export let title = '';
</script>

<Panel>
  <H2 className="max-w-80pc lg:self-center lg:justify-self-center">{title}</H2>
  <div
    class="flex flex-col md:grid md:grid-flow-col md:grid-auto-cols-1fr
    md:grid-rows-auto-auto">
    <!-- It's one slot but 2 or 3 children -->
    <slot />
  </div>
</Panel>
