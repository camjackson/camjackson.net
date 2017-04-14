A project manager friend recently revealed to me their one rebellious streak - not writing reports. Working at a company where standard (and expected) practice was to provide *x* number of reports to *y* number of people, every single iteration, this PM was convinced that most of them went totally unread, and so writing them was both a waste of time, and adding noise.

So they just stopped writing the reports. Nobody noticed.

[//]: # (fold)

After thinking about this approach for a while, I realised that it applies to many situations, including some that I've come across  myself, working in an infrastructure team:

> "Is anybody still using the old proxy, or can we finally decommission it?"

> "They shouldn't be, but there's only one way to know for sure... Turn it off and see who complains!"

It also works for a codebase. If you're not sure whether a class or a function is needed, just delete it and see if anything breaks! Of course, both of these scenarios depend on your ability to detect faults, and to recover from them. In order to be so bold with your code and your infrastructure, you're going to need most (probably all) of the following:

* Version control
* Good test coverage
* Automated deployments
* Infrastructure as code
* Monitoring, error reporting, and alerting

You might notice some commonality between this list, and the list of things needed to make [continuous delivery](/post/hooray-for-cd) happen. That's no coincidence, as continuous delivery enables you to quickly and easily run these kinds of "change it and see what happens" experiments.

Something that I love about good agile teams is the constant desire to improve the way they work, which often means challenging existing practices. One of my favourites is when someone dares to question a [sacred cow](https://en.wiktionary.org/wiki/sacred_cow), like the daily standup meeting! Some would argue that for very small, close-working teams, everyone always knows what everyone else is working on, and blockers can be resolved as they arise, so the standup is a waste of time.

OK. So stop doing standups. Try it for a few weeks, and see what the results are.

The only rule here is to make sure you come back and judge the results of the experiment, and decide as a team whether to stick with the change, or to go back to how things were before. It's also important to realise that even 'failed' experiments are valuable, as they can help you realise what was important about the thing that you changed or took away, and maybe optimise it. For example, if everybody wants to reinstate standups, but only because it was a good way to announce blockers on work in progress, then maybe the new daily standup can just be a 'daily blocker meeting', instead.

One final point is that where you can, its helpful to have objective, quantitative data for your experiment. That may be very difficult in some instances, especially where people and their interactions are involved, but you should at least stop and think about whether there's something measurable.

This is a principle that I want to apply more in the future. Whenever you find yourself questioning something's value (especially if it has a cost in its current state), I think you should also ask if it's feasible to run a small experiment - take it away and see!
