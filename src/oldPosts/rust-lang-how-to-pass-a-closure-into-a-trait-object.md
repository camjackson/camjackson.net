> I have an object which is a `&SomeTrait`, and I want to create a closure and pass it into a method on that trait. How do I make the types work?

In this post I'm going to go through my process of eventually figuring out the answer to this question, starting with a much simpler problem. If you just want the answer, then scroll right to the bottom of this post. Otherwise, read on!

[//]: # (fold)

## Passing a function into a function

Lets forget about closures and traits for now, and start with a function that takes another function as a parameter:

```rust
fn call_function(function: fn(u8) -> bool) -> bool {
    function(8)
}
```

As you can see, all this function does is call its argument with a fixed value, and return the result.

Here's how we might use it:

```rust
fn main() {
    println!("{}", call_function(my_local_function));
}

fn my_local_function(arg: u8) -> bool{
    let max = 5;
    arg < max
}
```

Given a pre-defined a function that does some arbitrary calculation, passing it into our first function above is trivial. You can see the complete example in the Rust playground [here](https://play.rust-lang.org/?gist=301cbe27d4b99bba5f8f&version=stable), and even run it in your browser!


## Closures are not functions
Passing a function into a function is great, but what if we need to pass in a closure instead, one which captures (closes over) its environment?

```rust
fn main() {
    let max = 5;
    let closure = move |arg: u8| { arg < max };
    println!("{}", call_function(closure));
}
```

This is mostly the same as before, except we use a closure instead of the pre-defined function. Notice that the closure takes ownership of `max` from its environment, using `move`.

Unfortunately, [this doesn't compile](https://play.rust-lang.org/?gist=f6b1a864771cea867151&version=stable). In Rust, closures and functions aren't interchangeable. In fact, even 2 closures with the same type signature [aren't interchangeable](https://github.com/rust-lang/rust/issues/24036#issuecomment-89509870)! So we can't use `fn(u8) -> bool`  as the type of the parameter to `call_function`, because our closure isn't compatible with it.

Instead, we can make our original function generic, and put a constraint on the type parameter which says that it has to implement the [`Fn`](https://doc.rust-lang.org/std/ops/trait.Fn.html) trait (a trait is like an interface):

```rust
fn call_function<F>(function: F) -> bool
  where F: Fn(u8) -> bool {
    function(8)
}
```

With that type signature, and our previous attempt at `main` (where we passed in the closure), [it works](https://play.rust-lang.org/?gist=31d8b21a8689cf4eeeb4&version=stable)! If the above code doesn't make sense, read more about [generics](http://doc.rust-lang.org/1.0.0-beta/book/generics.html) and [static dispatch](http://doc.rust-lang.org/1.0.0-beta/book/static-and-dynamic-dispatch.html#static-dispatch) in Rust.

## How about a method from a trait?
For my particular use case, it wasn't enough to be able to pass a closure into a function. I want to be able to pass a closure into a method, where the object that I'm passing it to just has a trait type. I.e., I don't know what the concrete type is.

Lets take the generic function signature we just created, and make it part of a trait (with an additional `&self` parameter):

```rust
trait FunctionCaller {
    fn call_function<F>(&self, function: F) -> bool
      where F: Fn(u8) -> bool;
}
```

Now lets consider a function that takes a `FunctionCaller` (a trait object of unknown concrete type), and calls its method, passing it a closure:

```rust
fn invoke(function_caller: &FunctionCaller) -> bool {
    let max = 5;
    let closure = move |arg: u8| { arg < max };

    function_caller.call_function(closure)
}
```

 The `&` means that it's a reference, one of Rust's several pointer types, which is necessary for [dynamic dispatch](http://doc.rust-lang.org/1.0.0-beta/book/static-and-dynamic-dispatch.html#dynamic-dispatch) on a trait object in Rust.

Now we just have to create a type that implements our trait, instantiate it, and pass `invoke` a reference to it!

```rust
struct MyFunctionCaller {
    data: u8,
}

impl FunctionCaller for MyFunctionCaller {
    fn call_function<F>(&self, function: F) -> bool where F: Fn(u8) -> bool {
        function(self.data)
    }
}

fn main() {
    let my_function_caller = &MyFunctionCaller{data: 8};

    println!("{}", invoke(my_function_caller));
}
```

... or so I thought. If you try to run [the complete example](https://play.rust-lang.org/?gist=c2aa2a5c10ea3f106512&version=stable), it won't let us pass `my_function_caller` to `invoke` as a `FunctionCaller` :(

`error: cannot convert to a trait object because trait FunctionCaller is not object-safe [E0038]`

I don't fully understand object safety yet ([this](https://huonw.github.io/blog/2015/01/object-safety/) is on my reading list), but I think the basic problem here is that you can't put a generic method in a trait. Which makes some intuitive sense, I didn't really expect it to work as I was trying it.

## Boxed closures to the rescue!
While the above compilation error makes sense, it didn't lead me to a solution. If you did try to run that last example though, you might have noticed a second compilation error:

`error: the trait FunctionCaller is not implemented for the type FunctionCaller [E0277]`

Uh, ok, that's not immediately helpful... But it did lead me to [this](https://stackoverflow.com/questions/30055356/the-trait-a-is-not-implemented-for-the-type-a) on Stack Overflow, which finally gave me what I needed: boxed closures.

Now that I know what the solution is, it seems obvious. In this post, we've already seen two different ways to specify a parameter's type as a trait:
 1. Static dispatch with generics: `fn foo<T>(t: T) where T: SomeTrait`
 2. Dynamic dispatch with pointers: `fn foo(t: &SomeTrait)`

What we're trying to do now is have a parameter where arguments need to implement the `Fn` trait. If we can't use the first approach (generics), then the solution is surely to use a pointer!

```rust
trait FunctionCaller {
    fn call_function(&self, function: &Fn(u8) -> bool) -> bool;
}
```

Then to use it we just need to pass a reference to our closure:

```rust
let closure = &move |arg: u8| { arg < max };
```

[And it finally works](https://play.rust-lang.org/?gist=e6bba3ef661345d7b5fb&version=stable)! In Rust, a pointer to a closure is known as a 'boxed closure'. The name is a little bit misleading, as Rust's heap-allocated pointer type is called [`Box`](https://doc.rust-lang.org/std/boxed/), but either pointer type (`Box` or reference) will do the trick. In fact, I originally used `Box` in this blog post, as I thought that was required for boxed closures, so thanks to [/u/masklinn](https://www.reddit.com/user/masklinn) on reddit for correcting me!

For completeness, here's the final code I came up with:

```rust
trait FunctionCaller {
    fn call_function(&self, function: &Fn(u8) -> bool) -> bool;
}

struct MyFunctionCaller {
    data: u8,
}

impl FunctionCaller for MyFunctionCaller {
    fn call_function(&self, function: &Fn(u8) -> bool) -> bool {
        function(self.data)
    }
}

fn main() {
    let my_function_caller = &MyFunctionCaller{data: 8};

    println!("{}", invoke(my_function_caller));
}

fn invoke(function_caller: &FunctionCaller) -> bool {
    let max = 5;
    let closure = &move |arg: u8| { arg < max };

    function_caller.call_function(closure)
}
```

## Phew!
That was tricky stuff! After spending a a few years working mostly in dynamically typed languages (Ruby, Javascript, Python), it's taken me a while to get used to solving problems like these, but I have to say I'm really enjoying it. I'd like to do another post soon on my general experiences with Rust so far, but the short version is that it's awesome. Cancel all your current projects and rewrite everything in Rust.

Thanks for reading!
