<script lang="ts">
  export let alwaysColumn: boolean = false;

  const flexClasses = 'flex flex-col items-center';
  const spaceClasses = 'mt-0 mx-8 mb-20 py-10 px-8';
  $: gridClasses = alwaysColumn
    ? ''
    : 'lg:grid lg:grid-rows-auto lg:grid-cols-30rem-then-100fr';
</script>

<section
  class:alwaysColumn
  class="{`bg-dark-gray ${flexClasses} ${spaceClasses} ${gridClasses}`}">
  <slot />
</section>
