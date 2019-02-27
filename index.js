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

    function setTransition (coords, time) {
      let { element, index } = coords

      let scale = 1
      if (stagger && childrenLength > 1) {
        scale = mapRange(index, 0, childrenLength - 1, 1, staggerscale)
      }
      time = time * scale
      element.style.transition = `${time}s ${easing}`
    }

    function speed (distance, time) {
      return distance / time
    }

    function moveInsideLeft (coords, callback) {
      let { element } = coords
      const moveInPX = 0
      const transitionTime = speed(containerWidth, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateX(${moveInPX}px)`
      handleCallback(element, true, callback)
    }

    function resetLeft (coords, callback) {
      moveLeft(coords, callback, true)
    }

    function moveLeft (coords, callback, reset) {
      let { element } = coords
      const moveInPX = wordWidth
      const transitionTime = reset ? 0 : speed(wordWidth + containerWidth, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateX(${-moveInPX}px)`
      handleCallback(element, !reset, callback)
    }

    function moveInsideRight (coords, callback) {
      let { element } = coords
      const moveInPX = containerWidth - wordWidth
      const transitionTime = speed(containerWidth, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateX(${moveInPX}px)`
      handleCallback(element, true, callback)
    }

    function resetRight (coords, callback) {
      moveRight(coords, callback, true)
    }

    function moveRight (coords, callback, reset) {
      let { element } = coords
      const moveInPX = containerWidth
      const transitionTime = reset ? 0 : speed(containerWidth + wordWidth, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateX(${moveInPX}px)`
      handleCallback(element, !reset, callback)
    }

    function resetUp (coords, callback) {
      moveUp(coords, callback, true)
    }

    function moveUp (coords, callback, reset) {
      let { element } = coords
      const moveInPX = wordHeight
      const transitionTime = reset ? 0 : speed(wordHeight + containerHeight, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateY(${-moveInPX}px)`
      handleCallback(element, !reset, callback)
    }

    function moveInsideUp (coords, callback) {
      let { element } = coords
      const moveInPX = 0
      const transitionTime = speed(containerHeight, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateY(${moveInPX}px)`
      handleCallback(element, true, callback)
    }

    function resetDown (coords, callback) {
      moveDown(coords, callback, true)
    }

    function moveDown (coords, callback, reset) {
      let { element } = coords
      const moveInPX = containerHeight
      const transitionTime = reset ? 0 : speed(containerHeight + wordHeight, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateY(${moveInPX}px)`
      handleCallback(element, !reset, callback)
    }

    function moveInsideDown (coords, callback) {
      let { element } = coords
      const moveInPX = containerHeight - wordHeight
      const transitionTime = speed(containerHeight, MARQUEE_SPEED)
      setTransition(coords, transitionTime)
      element.style.transform = `translateY(${moveInPX}px)`
      handleCallback(element, true, callback)
    }

    function handleCallback (element, shouldTransition, callback) {
      if (shouldTransition) {
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

    let marqueeSteps = {
      steps: [resetRight, moveLeft]
    }

    if (direction === 'right') {
      marqueeSteps = {
        steps: [resetLeft, moveRight]
      }
    }
    if (direction === 'up') {
      marqueeSteps = {
        steps: [resetDown, moveUp]
      }
    }
    if (direction === 'down') {
      marqueeSteps = {
        steps: [resetUp, moveDown]
      }
    }

    // Slide
    if (behavior === 'slide') {
      marqueeSteps = {
        steps: [resetRight, moveInsideLeft]
      }

      if (direction === 'right') {
        marqueeSteps = {
          steps: [resetLeft, moveInsideRight]
        }
      }
      if (direction === 'up') {
        marqueeSteps = {
          steps: [resetDown, moveInsideUp]
        }
      }
      if (direction === 'down') {
        marqueeSteps = {
          steps: [resetUp, moveInsideDown]
        }
      }
    }

    // Alternate
    // TODO figure out why alternative is slower than native?
    if (behavior === 'alternate') {
      marqueeSteps = {
        setup: resetRight,
        steps: [moveInsideLeft, moveInsideRight]
      }

      if (direction === 'right') {
        marqueeSteps = {
          setup: resetLeft,
          steps: [moveInsideRight, moveInsideLeft]
        }
      }
      if (direction === 'up') {
        marqueeSteps = {
          setup: resetUp,
          steps: [moveInsideDown, moveInsideUp]
        }
      }
      if (direction === 'down') {
        marqueeSteps = {
          setup: resetDown,
          steps: [moveInsideUp, moveInsideDown]
        }
      }
    }

    let childrenTransitioned = 0
    const marqueeLoop = (childWithCoordinates) => {
      marqueeSteps.steps[0](childWithCoordinates, () => {
        marqueeSteps.steps[1](childWithCoordinates, () => {
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
          marqueeSteps.setup(childWithCoordinates, () => {
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
