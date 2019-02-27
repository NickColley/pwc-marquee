# Progressive Web Component: Marquee

A re-implementation of the [obsolete marquee](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee).

This is a project done for fun and I would definitely not recommend using this in a real service, as the marquee element was made obsolete for a real reason :).

## How to use

### Use from CDN

[TODO UNPKG instructions]

### Install from npm

```html
<pwc-marquee>Scrolling text is fun</pwc-marquee>

<script type="module">
    import Marquee from "@pwc/marquee"

    window.customElements.define('pwc-marquee', Marquee)
</script>
```

> Note: you can choose what the custom element is called by changing `pwc-marquee` to what you prefer.

## Features

[TODO document what attributes you can use, see example/index.html for now]

## Improvements over the original marquee element

- Smooth rendering cross-browser

Think of a cool effect that could be added?

Feel free to raise an issue or contribute it.

## Progressive Enhancement

As this is a progressive web component, for browsers that do not support custom elements, it will fallback to regular text.

## To do / Known issues

- Detect [prefers reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- implement [marquee events](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee#Event_handlers)
- implement [marquee methods](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee#Methods)
- If a user changes the size of their screen, the component does not currently adjust correctly.
- [truespeed attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee#attr-truespeed) is not implemented
- [scrolldelay attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee#attr-scrolldelay) is not implemented