<style>
  header {
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  header h1 {
    margin: 0 0 2rem;
    text-align: center;
    font-size: 4rem;
    font-weight: 400;
    color: hsl(0, 0%, 95%);
  }

  header img#profile-pic {
    justify-self: end;
    max-width: 26rem;
    margin-bottom: 2rem;
  }

  header ul#subtitle {
    margin: 0 0 2rem;
    line-height: 1.8;
    font-size: 2.4rem;
    font-weight: lighter;
    color: var(--grey-3);
    list-style: none;
  }

  header ul#subtitle li {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }

  header ul#subtitle svg {
    width: 3rem;
    height: 3rem;
    margin: -0.2rem 2rem 0 0;
    fill: var(--grey-3);
  }

  header ul#socials {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 28rem;
  }

  header ul#socials svg {
    width: 6.4rem;
    height: 6.4rem;
    fill: var(--grey-2);
  }

  @media (min-width: 43.75em) {
    /* 700px / 16 */
    header {
      padding-top: 5rem;
      display: grid;
      grid-template-columns: 40% 60%;
      grid-template-rows: auto auto auto;
      grid-template-areas:
        'img title'
        'img subtitle'
        'img socials';
      justify-items: center;
    }
    header img#profile-pic {
      grid-area: img;
    }
    header h1 {
      grid-area: title;
      font-size: 6.4rem;
      margin: 0;
    }
    header ul#subtitle {
      grid-area: subtitle;
      font-size: 3.2rem;
    }
    header ul#socials {
      grid-area: socials;
    }
  }
</style>

<header className="w-full max-w-10xl my-0 mx-auto">
  <h1>Cam Jackson</h1>
  <img id="profile-pic" src="./avatar.jpg" alt="My headshot" />
  <ul id="subtitle">
    <li>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path
          d="M24 10.935v2.131l-8 3.947v-2.23l5.64-2.783-5.64-2.79v-2.223l8
          3.948zm-16 3.848l-5.64-2.783 5.64-2.79v-2.223l-8 3.948v2.131l8
          3.947v-2.23zm7.047-10.783h-2.078l-4.011 16h2.073l4.016-16z"></path>
      </svg>
      Full stack developer
    </li>
    <li>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <path
          d="M22 3v13h-11.643l-4.357
          3.105v-3.105h-4v-13h20zm2-2h-24v16.981h4v5.019l7-5.019h13v-16.981z"></path>
      </svg>
      Lead consultant
    </li>
    <li>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24">
        <path
          d="M6 6h-6v-6h6v6zm9-6h-6v6h6v-6zm9 0h-6v6h6v-6zm-18 9h-6v6h6v-6zm9
          0h-6v6h6v-6zm9 0h-6v6h6v-6zm-18 9h-6v6h6v-6zm9 0h-6v6h6v-6zm9
          0h-6v6h6v-6z"></path>
      </svg>
      Frontend expert
    </li>
  </ul>
  <ul id="socials">
    <!-- Icons from iconmonstr -->
    <li>
      <a aria-label="Twitter profile" href="https://twitter.com/thecamjackson">
        <svg
          role="img"
          aria-labelledby="twitter-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <title id="twitter-icon">Twitter profile</title>
          <path
            d="M0 0zm18.862 9.237c.208 4.617-3.235 9.765-9.33 9.765-1.854
            0-3.579-.543-5.032-1.475 1.742.205 3.48-.278
            4.86-1.359-1.437-.027-2.649-.976-3.066-2.28.515.098 1.021.069
            1.482-.056-1.579-.317-2.668-1.739-2.633-3.26.442.246.949.394
            1.486.411-1.461-.977-1.875-2.907-1.016-4.383 1.619 1.986 4.038 3.293
            6.766 3.43-.479-2.053 1.079-4.03 3.198-4.03.944 0 1.797.398 2.396
            1.037.748-.147 1.451-.42 2.085-.796-.245.767-.766 1.41-1.443
            1.816.664-.08 1.297-.256 1.885-.517-.44.656-.997 1.234-1.638 1.697z"></path>
        </svg>
      </a>
    </li>
    <li>
      <a aria-label="GitHub profile" href="https://github.com/camjackson">
        <svg
          role="img"
          aria-labelledby="github-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <title id="github-icon">GitHub profile</title>
          <path
            d="M0 0zm14.534
            19.59c-.406.078-.534-.171-.534-.384v-2.195c0-.747-.262-1.233-.55-1.481
            1.782-.198 3.654-.875 3.654-3.947
            0-.874-.311-1.588-.824-2.147.083-.202.357-1.016-.079-2.117 0
            0-.671-.215-2.198.82-.639-.18-1.323-.267-2.003-.271-.68.003-1.364.091-2.003.269-1.528-1.035-2.2-.82-2.2-.82-.434
            1.102-.16 1.915-.077 2.118-.512.56-.824 1.273-.824 2.147 0 3.064
            1.867 3.751 3.645 3.954-.229.2-.436.552-.508
            1.07-.457.204-1.614.557-2.328-.666 0 0-.423-.768-1.227-.825 0
            0-.78-.01-.055.487 0 0 .525.246.889 1.17 0 0 .463 1.428
            2.688.944v1.489c0
            .211-.129.459-.528.385-3.18-1.057-5.472-4.056-5.472-7.59 0-4.419
            3.582-8 8-8s8 3.581 8 8c0 3.533-2.289 6.531-5.466 7.59z"></path>
        </svg>
      </a>
    </li>
    <li>
      <a
        aria-label="LinkedIn profile"
        href="https://linkedin.com/in/camjackson">
        <svg
          role="img"
          aria-labelledby="linkedin-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <title id="linkedin-icon">LinkedIn profile</title>
          <path
            d="M0 0zm8 19h-3v-11h3v11zm-1.5-12.268c-.966
            0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783
            1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4
            0v5.604h-3v-11h3v1.765c1.397-2.586 7-2.777 7 2.476v6.759z"></path>
        </svg>
      </a>
    </li>
  </ul>
</header>
