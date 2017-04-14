Continuous delivery is awesome!

The basic idea is that every single commit should be ready to go to production as soon as it's pushed. Continuous deployment takes it a step further, and has every commit immediately go straight to production, as long as it passes successfully through a pipeline of tests. In my opinion, continuous deployment is even better, as long as it suits your application.

So why am I celebrating? I put this blog live only a few hours ago, and just now I finished writing some changes to the underlying code. In order to get that code live, all I had to do was push it to GitHub and wait a minute or so, and I had full confidence that I wasn't going to break the site in the process. So what's necessary to make that work?

[//]: # (fold)

1. **Source control**. writeitdown is [checked into github](https://github.com/camjackson/writeitdown). Hopefully source control is a given for any serious project these days...
2. A solid suite of **automated tests**. I'm using [mocha](http://mochajs.org/) as a testing framework, with [sinon](http://sinonjs.org/) for test doubles and [chai](http://chaijs.com/) for assertions. The unit and integration test coverage is decent enough to give me confidence that any changes I write do what they're meant to do, without breaking existing functionality. Functional testing is something I still need to add.
3. A **continuous delivery pipeline**. Continuous integration servers like Jenkins are *so 2011*. If you want to do CD, it's best to have a build server that reflects that model. One where a change is promoted through a series of steps that verify that the code works, before ultimately deploying it. That deployment can be manually triggered for controlled releases, or automatic for continuous deployment. Anyway, writeitdown has a CD pipeline hosted on [Snap CI](https://snap-ci.com/camjackson/writeitdown/branch/master), with automatic deployments for every successful build!
4. An **automated build and deploy process**. This varies in difficulty depending on what you're building, but for something as simple as a node.js website, Heroku's deploy-via-git model works great. At some stage I'd like to [Dockerise](https://www.docker.com/) writeitdown, but neither Snap nor Heroku support Docker at the moment, so I'd probably need to move to [GoCD](http://www.go.cd/) and [EC2](https://aws.amazon.com/ec2/).

I don't want to get too carried away with my accomplishments, as this is obviously a pretty simple application, without all of the complexities (both organisational and technical) that make continuous delivery hard. But still, I'm pretty happy that I seem to have got the model right from the start, which will hopefully make it really easy to keep growing the project.

Yay!
