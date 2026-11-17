---
title: sammwy.com v5 is live
description: rebuilt the whole site from scratch. again.
brief: astro on the server, yaml for content, a pixel pet that judges you, and a blog that reads markdown straight from a folder.
date: 2026-11-17
---

welcome to **v5**. this time it's not a static page anymore: everything is rendered on the server and the browser gets plain html and css.

## what changed

- the projects page is now a channel menu with a unique pixel banner per repo
- the pet on the home page is alive. feed it. please.
- this blog: every `.md` file inside `data/blog/YYYY/MM/` becomes a post

## how a post looks

```md
---
title: my post
description: one line summary
brief: a slightly longer teaser for the catalog
date: 2026-11-17
---

markdown goes here.
```

> the previous statement about the site being javascript-free is still a lie.
