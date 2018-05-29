I've been working with React.js for about 3 years now, and in that time I've seen a lot of people (myself included!)
really struggle with testing React applications. In my experience, it's tricky to figure out the right way to test React
apps, but once you know how, it's easy! I often find that once I give people some simple pointers, they're able to get
off and running really quickly. So I figured, why not write all this stuff down so I can share it with everyone!

[//]: # (fold)

## Introduction

### The examples
This post will be example-heavy. You can find the full working source for all examples
[on GitHub](https://github.com/camjackson/react-testing-examples).

### Tools
Ok, let's start with the tooling. The centre of this whole testing universe is going to be Airbnb's fantastic React
testing library, [Enzyme](TODO). Enzyme will help us test our React components in isolation, and it also allows us to
write selectors that pin-point the most important parts of our components for assertions. We'll also use [jest-enzyme](TODO),
which adds Enzyme-y assertions to Jest, giving us more readable tests and more meaningful errors when our tests fail.

Tool number 2 for this blog post is Facebook's [Jest](TODO), which combines a test runner/framework, assertions, and
mocking all in one. The main reason I've picked Jest is because it comes pre-configured with [create-react-app](TODO),
which is the easiest way to get start with React code. However, you could just as well use a combination of tools like
[mocha](TODO), [sinon](TODO), and [chai](TODO), if you prefer.

The final tool worth mentioning here is [JSDOM](TODO), which is sort of like a browser emulator. It's not a real
browser, but it implements many of the browser features that we might need in our tests. For example, globals like
`document`, or `window`, and their respective methods. Importantly, it's written in pure JavaScript, which means we can
start it up in the same process that our tests are running, which makes it a lot faster and more reliable than something
like PhantomJS or headless Chrome.

### General principles
Perhaps the most important thing to understand here is that testing React applications is not fundamentally different
than testing any other type of code. Sure there might be some new tools to learn and some quirks to be mindful of, but
the motivations for testing, the importance of testing, and the rules of thumb that we tend to follow - these are all
exactly the same.

This is important, as it helps inform the techniques we choose to use when testing React apps. As with any other
codebase, we're writing automated tests in order to prevent regressions, to document the code, to drive a good design,
to give ourselves confidence that we can deploy to production without breaking anything. Any potential testing strategy
can be measured against such motivators.

Throughout this article I'll refer to the [testing pyramid](TODO). If you haven't heard of it, it's worth reading
Martin's article, but basically we want to drive most of our tests "downwards". By that we mean focussing primarily on
testing individual 'units' (in this case, usually React components) in isolation. We also write tests that exercise the
integration points between these units, to make sure that they work in concert, but we write fewer of these tests. Then
at the top of the pyramid we can write functional or end-to-end tests, but there should be very few of these, as they
tend to be expensive to write and maintain.

## Part 1: Unit testing stateless React components
Let's start with the easiest part first - unit testing React components that don't have any state. These components are
usually pure functions, so we can think of them in terms of inputs and outputs. I.e. when rendered with a given set of
props (inputs), they should produce a known tree of React elements (outputs).

### Conditional rendering
Here we have a `Loading` component, which renders either a loading spinner or some child content, depending on whether
we're still waiting for something to finish loading:

```js
const Loading = ({ loading, children }) => {
  if (loading) {
    return <Spinner />;
  }
  return children;
}
```

**Rule 1**: Find the logic that's worth testing. This component is pretty basic, but my attention is immediately drawn
to that `if` statement. This *conditional rendering* is always worth a unit test or two:

```js
it('shows a loading spinner when the data is still loading', () => {
  const loading = shallow(
    <Loading loading>
      <span>Hide me</span>
    </Loading>
  );
  expect(loading.find(Spinner)).toExist();
  expect(loading.find('span')).not.toExist();
});

it('renders the children once we are not loading any more', () => {
  const loading = shallow(
    <Loading loading={false}>
      <span>Show me</span>
    </Loading>
  );
  expect(loading.find(Spinner)).not.toExist();
  expect(loading.find('span')).toExist();
});
```

If that makes perfect sense to you then feel free to move on to the next section. But seeing as it's our first code
sample here, I'll break it down in detail for anyone who hasn't done this before. Firstly, we render our `Loading`
component using Enzyme's [`shallow`](TODO) function. This rendering mode effectively mocks out any sub-components so
that we can focus our tests on the `Loading` component. For simple tests like these, `shallow` is a good option, as it's
faster and gives more isolation than the alternative, which is [`mount`](TODO).

The thing that shallow returns is not a real React component or element, instead it's a 'wrapper' around the underlying
React elements, which has many convenient methods available for querying and asserting on its contents. Perhaps the most
versatile of these is [`find`](TODO), which we can use to search the hierarchy for the elements that are most
interesting to us. It supports many different types of selectors, but here we're passing it a React component type,
`Spinner`, or an HTML tag name, `'span'`, to search for elements of those types. Then we can assert on whether or not we
expect to have found anything. In the first test, when `loading` is `true`, there should be a `Spinner` and no `<span>`,
and in the second test the opposite is true.

### Iterative rendering
This is the next most common type of rendering logic. We might have a `Dropdown` component like this:

```js
const Dropdown = ({ value, options, onChange }) => (
  <select value={value}>
    {options.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);
```

The logic to focus on here is that `map` function. We want to make sure that the right number of `<option>` elements is
produced, and also that the data we supply is passed into the right places.

```js
it('renders an option element for each supplied option', () => {
  const dropdown = shallow(
    <Dropdown options={[
      { value: '', label: 'Select size' },
      { value: 'S', label: 'Small' },
      { value: 'M', label: 'Medium' },
      { value: 'L', label: 'Large' },
    ]} />
  );
  const optionElements = dropdown.find('option');
  expect(optionElements).toHaveLength(4);
});

it('renders the value and label into the options', () => {
  const dropdown = shallow(
    <Dropdown options={[
      { value: '', label: 'Select size' },
      { value: 'S', label: 'Small' },
      { value: 'M', label: 'Medium' },
      { value: 'L', label: 'Large' },
    ]} />
  );
  const firstOption = dropdown.find('option').at(0);
  expect(firstOption).toHaveProp('value', '');
  expect(firstOption).toHaveText('Select size');
});
```

There are a couple of things worth calling out here. Firstly, we've made no mention of the `<select>` element. You could
argue that it's an important part of the output of this component and so we should test it. However, if we think about
the reasons we want to write tests, asserting that there's a `<select>` in the output doesn't really help us. E.g., the
chances of such an assertion catching a regression are pretty slim. Secondly, we don't write assertions on every single
`<option>` element, for much the same reason. Given that they're rendered in a loop, if we got the first one right then
we almost definitely got all of them right, so we're fine to just grab the first one and assert on that.

### Data transformations
The next thing we'll focus on is data transformation. For example, we might display the length of a list, the sum total
of some numbers, or format some string data. All of these derivations should usually be done as part of component
rendering. Here's a basic string formatting example:

```js

```

### TODO
- Unit testing stateless components
  - data transformations
  - interactions
  - Render props
  - (Sum of the principles we've developed)
- Unit testing stateful components
  - Test the result of the state, not the state itself
  - Initial state
  - Simulate stuff or call callbacks, then subsequent state
  - update() and await
- HOCs
  - Test the bare component
  - HOCcification should be simple and not worth testing
  - Though you can test it roughly in an integration test
- Integration testing
- Context
- TDD
- Redux
  - Reducers
  - Synchronous action creators
  - Thunks
- Apollo
  - ???
  - Query and Mutation components
- React router
- Snapshot testing
- End-to-end tests
