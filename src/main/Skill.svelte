<script lang="ts">
  export let name = '';
</script>

<style>
  h3 {
    margin: 1rem 1.5rem 0;
    font-size: 2.2rem;
    font-weight: normal;
  }

  p {
    margin: 1rem 0;
    padding: 0 1.5rem;
  }

  @media (min-width: 43.75em) {
    /* 700px / 16 */
    h3 {
      align-self: center;
    }
  }
</style>

<h3>{name}</h3>
<p>
  <slot />
</p>
