class Marquee extends window.HTMLElement {
  connectedCallback () {
    // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/marquee
    // behavior
    // Sets how the text is scrolled within the marquee. Possible values are scroll, slide and alternate. If no value is specified, the default value is scroll.
    const behavior = (this.getAttribute('behavior') !== null) ? this.getAttribute('behavior') : 'scroll'

    // bgcolor
    // Sets the background color through color name or hexadecimal value.
    const bgcolor = (this.getAttribute('bgcolor') !== null) ? this.getAttribute('bgcolor') : false

    if (bgcolor) {
      this.style.backgroundColor = bgcolor
    }

    // direction
    // Sets the direction of the scrolling within the marquee. Possible values are left, right, up and down. If no value is specified, the default value is left.
    const direction = (this.getAttribute('direction') !== null) ? this.getAttribute('direction') : 'left'

    // height
    // Sets the height in pixels or percentage value.
    const height = (this.getAttribute('height') !== null) ? this.getAttribute('height') : false

    if (height) {
      const heightIsANumber = !isNaN(height)
      let setHeight = height
      // If only a number is given, assume pixels.
      if (heightIsANumber) {
        setHeight = setHeight + 'px'
      }
      this.style.height = setHeight
    }

    // hspace
    // Sets the horizontal margin
    const hspace = (this.getAttribute('hspace') !== null) ? this.getAttribute('hspace') : 0

    if (hspace) {
      this.style.marginLeft = `${hspace}px`
      this.style.marginRight = `${hspace}px`
    }

    // loop
    // Sets the number of times the marquee will scroll. If no value is specified, the default value is −1, which means the marquee will scroll continuously.
    const loop = (this.getAttribute('loop') !== null) ? parseInt(this.getAttribute('loop'), 10) : -1

    // scrollamount
    // Sets the amount of scrolling at each interval in pixels. The default value is 6.
    const scrollamount = (this.getAttribute('scrollamount') !== null) ? parseInt(this.getAttribute('scrollamount'), 10) : 6

    // scrolldelay
    // Sets the interval between each scroll movement in milliseconds. The default value is 85. Note that any value smaller than 60 is ignored and the value 60 is used instead, unless truespeed is specified.

    // truespeed
    // By default, scrolldelay values lower than 60 are ignored. If truespeed is present, those values are not ignored.

    // vspace
    // Sets the vertical margin in pixels or percentage value.
    const vspace = (this.getAttribute('vspace') !== null) ? this.getAttribute('vspace') : 0

    if (vspace) {
      this.style.marginTop = `${vspace}px`
      this.style.marginBottom = `${vspace}px`
    }

    // width
    // Sets the width in pixels or percentage value.
    const width = (this.getAttribute('width') !== null) ? this.getAttribute('width') : false

    if (width) {
      const widthIsANumber = !isNaN(width)
      let setWidth = width
      // If only a number is given, assume pixels.
      if (widthIsANumber) {
        setWidth = setWidth + 'px'
      }
      this.style.width = setWidth
    }

    // Custom stuff not in the original element
    const easing = (this.getAttribute('easing') !== null) ? this.getAttribute('easing') : 'linear'

    const stagger = (this.getAttribute('stagger') !== null) ? this.getAttribute('stagger') : false
    const staggerscale = (this.getAttribute('staggerscale') !== null) ? parseFloat(this.getAttribute('staggerscale'), 10) : 1

    // If the behaviour is slide, it should only loop once
    let setLoop = loop
    if (behavior === 'slide') {
      setLoop = 1
    }

    // Set overflow on the element so it can clip text
    if (window.getComputedStyle(this).display === 'inline') {
      this.style.display = 'block'
    }
    this.style.overflow = 'hidden'

    // Ensure text does not wrap
    this.style.whiteSpace = 'nowrap'

    // Get the tag name of this custom element to be able to find any nested of the same name
    const tagName = this.tagName

    // Check the parent node to see if this current instance is nested within another marquee
    const isNested = this.parentNode.tagName === tagName

    // So that we can move letters individually, wrap each letter with a span
    let text = this.textContent.trim()

    // Replace current text with wrapped text
    let children = Array.from(this.childNodes)

    if (!stagger) {
      const wrapper = document.createElement('span')
      // Hide before first render to prevent flicker
      wrapper.style.visibility = 'hidden'
      // You cannot move text that is inline with translate
      wrapper.style.display = 'inline-block'
      // Indicate that they will change and should be on a GPU layer
      wrapper.style.willChange = 'transform'

      // Remove children from marquee
      children.forEach(this.removeChild.bind(this))
      // Put them into the wrapper
      children.forEach(wrapper.appendChild.bind(wrapper))
      // Put the children back into the marquee now they're wrapped
      children = [wrapper]
      children.forEach(this.appendChild.bind(this))
    } else {
      let staggerDelimiter
      if (stagger === 'letters') {
        staggerDelimiter = ''
      }
      if (stagger === 'words') {
        staggerDelimiter = ' '
      }

      // Ensure that any children that are not text and are inline are wrapped with something that will allow them to move.
      children = children.map(node => {
        // If we're nesting marquees, no need to wrap them.
        if (node.tagName === tagName) {
          // Hide before first render to prevent flicker
          node.style.visibility = 'hidden'
          // Indicate that they will change and should be on a GPU layer
          node.style.willChange = 'transform'
          return node
        } else if (node.nodeType === window.Node.TEXT_NODE) {
          // If it's a text node we'll need to wrap it.

          const splitText = node.textContent.trim().split(staggerDelimiter)

          const splitNodes = splitText.map(letter => {
            // Prevent original letter from being mutated
            letter = letter.slice(0)

            const wrapper = document.createElement('span')
            // So that spaces are not collapsed, convert them into non-breaking spaces.
            if (letter === ' ') {
              letter = '&nbsp;'
            }
            wrapper.innerHTML = letter
            // Hide before first render to prevent flicker
            wrapper.style.visibility = 'hidden'
            // You cannot move text that is inline with translate
            wrapper.style.display = 'inline-block'
            // Indicate that they will change and should be on a GPU layer
            wrapper.style.willChange = 'transform'

            // Spacer
            if (stagger === 'words') {
              const spacerAfter = document.createElement('span')
              spacerAfter.innerHTML = '&nbsp;'
              wrapper.appendChild(spacerAfter)
            }
            return wrapper
          })
          return splitNodes
        } else if (window.getComputedStyle(node).display === 'inline') {
          const wrapper = document.createElement('span')
          // Hide before first render to prevent flicker
          wrapper.style.visibility = 'hidden'
          // You cannot move text that is inline with translate
          wrapper.style.display = 'inline-block'
          // Indicate that they will change and should be on a GPU layer
          wrapper.style.willChange = 'transform'

          // Spacer
          if (stagger === 'letters') {
            const spacerBefore = document.createElement('span')
            spacerBefore.innerHTML = '&nbsp;'
            wrapper.appendChild(spacerBefore)
          }
          wrapper.appendChild(node)

          const spacerAfter = document.createElement('span')
          spacerAfter.innerHTML = '&nbsp;'
          wrapper.appendChild(spacerAfter)
          return wrapper
        } else {
          // Hide before first render to prevent flicker
          node.style.visibility = 'hidden'
          // Indicate that they will change and should be on a GPU layer
          node.style.willChange = 'transform'

          // Spacer
          const spacerAfter = document.createElement('span')
          spacerAfter.innerHTML = '&nbsp;'
          if (stagger === 'letters') {
            const spacerBefore = document.createElement('span')
            spacerBefore.innerHTML = '&nbsp;'
            return [spacerBefore, node, spacerAfter]
          }
          return [node, spacerAfter]
        }
      }).reduce((a, b) => a.concat(b), []) // Flattern array
      this.innerHTML = ''
      children.forEach(this.appendChild.bind(this))
    }

    // set aria-label with the original text to try and resolve any accessibility issues
    if (stagger && isNested) {
      this.setAttribute('aria-label', text)
    }

    // get coordinates so we can transform the letters
    const childrenWithCoordinates = children.map((child, index) => {
      return {
        index,
        element: child,
        coordinates: child.getBoundingClientRect()
      }
    })
    const containerCoordinates = this.getBoundingClientRect()

    const wordWidth = (
      childrenWithCoordinates[childrenWithCoordinates.length - 1].coordinates.right -
        childrenWithCoordinates[0].coordinates.left
    )

    const wordHeight = (
      childrenWithCoordinates
        .map(letter => letter.coordinates.height)
        .reduce((values, nextValue) => {
          return (values > nextValue) ? values : nextValue
        }, 0)
    )

    const containerWidth = (
      containerCoordinates.width
    )

    const containerHeight = (
      containerCoordinates.height
    )

    const MARQUEE_SPEED = 11.8 * scrollamount

    let childrenLength = children.length

    function mapRange (num, inMin, inMax, outMin, outMax) {
      return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
    }

    function speed (distance, time) {
      return distance / time
    }

    function setTransition (coords, time) {
      let { element, index } = coords

      let scale = 1
      if (stagger && childrenLength > 1) {
        scale = mapRange(index, 0, childrenLength - 1, 1, staggerscale)
      }
      time = time * scale
      element.style.transition = `${time}s ${easing}`
    }

    function handleStep (step, coords, callback) {
      let { element } = coords
      const { move, time, direction } = step
      const transitionTime = speed(time, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translate${direction || 'X'}(${move}px)`

      if (transitionTime) {
        element.addEventListener('transitionend', (event) => {
          callback()
        }, { once: true })
      } else {
        setTimeout(() => {
          callback()
        }, 0)
      }
    }

    // We're ready to animate the elements so we can show them again.
    childrenWithCoordinates.forEach(({ element }) => {
      element.style.visibility = 'visible'
    })

    const steps = {
      up: {
        outside: {
          direction: 'Y',
          move: -wordHeight,
          time: wordHeight + containerHeight,
          reset: {
            direction: 'Y',
            move: -wordHeight,
            time: 0
          }
        },
        inside: {
          direction: 'Y',
          move: 0,
          time: containerHeight,
          reset: {
            move: 0,
            time: 0
          }
        },
        insideOnly: {
          direction: 'Y',
          move: 0,
          time: containerHeight - wordHeight,
          reset: {
            direction: 'Y',
            move: 0,
            time: 0
          }
        }
      },
      right: {
        outside: {
          move: containerWidth,
          time: containerWidth + wordWidth,
          reset: {
            move: containerWidth,
            time: 0
          }
        },
        inside: {
          move: containerWidth - wordWidth,
          time: containerWidth,
          reset: {
            move: containerWidth - wordWidth,
            time: 0
          }
        },
        insideOnly: {
          move: containerWidth - wordWidth,
          time: containerWidth - wordWidth,
          reset: {
            move: 0,
            time: 0
          }
        }
      },
      down: {
        outside: {
          direction: 'Y',
          move: containerHeight,
          time: containerHeight + wordHeight,
          reset: {
            direction: 'Y',
            move: containerHeight,
            time: 0
          }
        },
        inside: {
          direction: 'Y',
          move: containerHeight - wordHeight,
          time: containerHeight,
          reset: {
            move: containerHeight - wordHeight,
            time: 0
          }
        },
        insideOnly: {
          direction: 'Y',
          move: containerHeight - wordHeight,
          time: containerHeight - wordHeight,
          reset: {
            direction: 'Y',
            move: containerHeight - wordHeight,
            time: 0
          }
        }
      },
      left: {
        outside: {
          move: -wordWidth,
          time: containerWidth + wordWidth,
          reset: {
            move: -wordWidth,
            time: 0
          }
        },
        inside: {
          move: 0,
          time: containerWidth,
          reset: {
            move: 0,
            time: 0
          }
        },
        insideOnly: {
          move: 0,
          time: containerWidth - wordWidth,
          reset: {
            move: 0,
            time: 0
          }
        }
      }
    }

    let marqueeSteps = {
      steps: [steps.right.outside.reset, steps.left.outside]
    }

    if (direction === 'right') {
      marqueeSteps = {
        steps: [steps.left.outside.reset, steps.right.outside]
      }
    }
    if (direction === 'up') {
      marqueeSteps = {
        steps: [steps.down.outside.reset, steps.up.outside]
      }
    }
    if (direction === 'down') {
      marqueeSteps = {
        steps: [steps.up.outside.reset, steps.down.outside]
      }
    }

    // Slide
    if (behavior === 'slide') {
      marqueeSteps = {
        steps: [steps.right.outside.reset, steps.left.inside]
      }

      if (direction === 'right') {
        marqueeSteps = {
          steps: [steps.left.outside.reset, steps.right.inside]
        }
      }
      if (direction === 'up') {
        marqueeSteps = {
          steps: [steps.down.outside.reset, steps.up.inside]
        }
      }
      if (direction === 'down') {
        marqueeSteps = {
          steps: [steps.up.outside.reset, steps.down.inside]
        }
      }
    }

    // Alternate
    if (behavior === 'alternate') {
      marqueeSteps = {
        setup: steps.right.inside.reset,
        steps: [steps.left.insideOnly, steps.right.insideOnly]
      }

      if (direction === 'right') {
        marqueeSteps = {
          setup: steps.left.insideOnly.reset,
          steps: [steps.right.insideOnly, steps.left.insideOnly]
        }
      }
      if (direction === 'up') {
        marqueeSteps = {
          setup: steps.down.insideOnly.reset,
          steps: [steps.up.insideOnly, steps.down.insideOnly]
        }
      }
      if (direction === 'down') {
        marqueeSteps = {
          setup: steps.up.insideOnly.reset,
          steps: [steps.down.insideOnly, steps.up.insideOnly]
        }
      }
    }

    let childrenTransitioned = 0
    const marqueeLoop = (childWithCoordinates) => {
      handleStep(marqueeSteps.steps[0], childWithCoordinates, () => {
        handleStep(marqueeSteps.steps[1], childWithCoordinates, () => {
          childrenTransitioned++
          if (childrenTransitioned === childrenLength) {
            doLoop()
          }
        })
      })
    }

    let timesLooped = 0
    let lettersSetup = 0
    function doLoop () {
      if (setLoop !== -1 && timesLooped === setLoop) {
        return
      }
      timesLooped++
      childrenTransitioned = 0
      childrenWithCoordinates.forEach((childWithCoordinates) => {
        lettersSetup++
        if (lettersSetup <= childrenLength && marqueeSteps.setup) {
          handleStep(marqueeSteps.setup, childWithCoordinates, () => {
            marqueeLoop(childWithCoordinates)
          })
        } else {
          marqueeLoop(childWithCoordinates)
        }
      })
    }
    doLoop()
  }

  disconnectedCallback () {
  }
}

export default Marquee
