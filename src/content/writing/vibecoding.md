---
title: Unblocked
date: 2026-06-01
summary: How Claude Code unstuck a stale Swift side project, porting Next Train to the web in about an hour, and what two weeks of vibecoding taught me about AI as a creativity unblocker.
tags: [vibecoding, personal, sideproject]
draft: false
---

I've been fortunate enough to work at a startup in recent years, so it was fairly easy to start tinkering with claude code some days after it [launched in February 2025](https://www.anthropic.com/news/claude-3-7-sonnet). I never got into cursor. I still liked Jetbrains Pycharm too much with their autocomplete and LSP, which I thought were good enough for the work I was doing at the time.

I also always have loved the concept of sideprojects. I've done more than a dozen over my programming years, but there's usually little time or, being honest, willingness to learn and code over the nights or weekends. And I think AI has been a really cool unblocker here.

Let me tell you about [Next Train](https://nexttrain.london). This started as a sideproject that I started coding in 2024. I used it to keep polishing my somewhat rusty Swift and SwiftUI skills because at work I mostly do python.

So I got to design the app, read the TfL API, and model the data. I got it to a point I was sincerely happy about it running it locally, but I always thought there was a lot of polishing needed before I could release it publicly.

I didn't have any energy left to fine tune whatever was missing. After lots of stale months of development I recently just asked Claude to port it to web, get ahold of the data structure and parsing and the UI. A bit over an hour later it was properly running on a local web server and the UI looked quite similar.

It felt just right. I'm not entirely sure all my efforts with the og design and data parsing made any difference, but I want to believe they did.

After some prompts fine tuning the UI, now in english, I also asked it to experiment with the UI a bit and propose a couple more radical options. At this point it produced (effortlessly) 3 variations, two that I didn't like but also the one that I've been finetuning for some days now, that is live in the page: [nexttrain.london](https://nexttrain.london).

And at this exact point it hit me:

1. AI is such a huge unlocker of creativity and stale projects.
2. Web tech, I'd like to think, is gonna have an even bigger boom, because of vibecoding.

I may be wrong but it's a huge pleasure seeing my app in the form of a webpage perfectly working as expected minus the chore of setting up the app stores and all that noise.

Another brilliant AI unblock is that now after the web app is properly setup I can just be chatting to the agent via the new remote features and have it add support for the overground, whilst riding the overground on a very spotty [London 5G](https://www.ookla.com/articles/city-performance-uk-q1-2025) (!) or that I can feed it with live pictures of the station boards and ask it to render the delays in a fashionable elegant way on the page. This feels like the future.

It's been a hard unblock for most of my sideprojects and creativity. It removes the usual complexity by just typing in english the definition of your apps or features, if there's an api to do it you're halfway there already. I also have been tweaking my own dev tools more than usual, even my writing setup.

I'm writing in vscode because I fully pivoted to a vscode + cli (codex and claude) setup some years ago. I like the max configurability of it. It's not necessarily a great thing but with everything vibecoded you could enforce your preferences and configs in almost all software you run, at least locally. But there's just not enough time in the day or stars in the github repos.

Paraphrasing heavily [Karpathy](https://www.youtube.com/watch?v=7xTGNNLPyMI) on his brilliant deep dive into llms video: AI is a tool, and we should treat it like that. I'm not proposing to blindly trust it to replace programming, especially if you're fond of programming! But if you have some dead sideproject rusting, maybe give them a chance. It's really exciting seeing my ideas to completion way faster. I can still enjoy some time reading swiftUI but have my app already fully operational to check my nearest station and the trains coming my way.
