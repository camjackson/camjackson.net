<script lang="ts">
  import SkillBox from '../SkillBox.svelte';
  import Skill from '../Skill.svelte';
</script>

<SkillBox title="Micro frontends" numberOfSkills="{2}">
  <Skill name="Speaking & Writing">
    <p>
      Micro frontends is an architectural style where independently deliverable
      frontend applications are composed into a greater whole. I helped pioneer
      the technique, and have written and spoken extensively on the topic. You
      can find some of my writing on
      <a href="https://martinfowler.com/articles/micro-frontends.html">
        martinfowler.com
      </a>
      , and
      <a href="https://microfrontends.com/">microfrontends.com</a>
      .
    </p>
  </Skill>
  <Skill name="Implementation">
    <p>
      I've worked with multiple household-name organisations to transform their
      frontend architectures, increasing team autonomy and drastically improving
      speed of delivery. All while maintaining product and technical consistency
      where it matters.
    </p>
  </Skill>
</SkillBox>
