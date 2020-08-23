<script lang="ts">
  import SkillBox from '../SkillBox.svelte';
  import Skill from '../Skill.svelte';
</script>

<SkillBox title="(Some of) my&nbsp;projects" numberOfSkills="{3}">
  <Skill name="Micro frontends writing">
    <p>
      In 2019 I published a
      <a href="https://martinfowler.com/articles/micro-frontends.html">
        long-form article on micro frontends
      </a>
      on martinfowler.com, explaining the theory and practice of this
      architectural style, including a fully-functional demo website. The demo
      is located
      <a href="https://demo.microfrontends.com">here</a>
      , and the source code is all
      <a href="https://github.com/micro-frontends-demo">on GitHub</a>
      .
    </p>
  </Skill>
  <Skill name="Spotify automation">
    <p>
      I try to stay fit by running, and I find that having a song with the
      perfect BPM to match my running pace really helps! So I created
      <a href="https://github.com/camjackson/spotify-automation">
        a set of scripts
      </a>
      that queries my spotify library and automatically compiles a playlist of
      songs I can run to.
    </p>
  </Skill>
  <Skill name="Bits and pieces">
    <p>
      I've contributed code to open source projects like
      <a href="https://github.com/faradayio/cage/">Cage</a>
      ,
      <a href="https://github.com/rabblerouser/">Rabble Rouser</a>
      ,
      <a href="https://github.com/charleskorn/batect">Batect</a>
      , and more. I have some more open source work in progress that isn't ready
      to show yet, and I also build websites for family and friends.
    </p>
  </Skill>
</SkillBox>
