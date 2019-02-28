/* eslint-env jest */
/* global page, Marquee */

const fs = require('fs')
const cheerio = require('cheerio')

beforeAll(async () => {
  // Capture JavaScript errors.
  page.on('error', err => {
    console.log('error happen at the page: ', err)
  })

  page.on('pageerror', pageerr => {
    console.log('pageerror occurred: ', pageerr)
  })
})

beforeEach(async () => {
  await page.reload()
  await page.addScriptTag({
    content: fs.readFileSync(`${__dirname}/index.js`, 'utf8').replace('export', '// export')
  })
  await page.evaluate(() => {
    window.customElements.define('pwc-marquee', Marquee)
  })
})

describe('Marquee', () => {
  it('does nothing if there are no children', async () => {
    await page.evaluate(() => {
      const $marquee = document.createElement('pwc-marquee')
      document.body.appendChild($marquee)
    })
  })
  describe.skip('behaviour', () => {
  })
  describe('bgcolor', () => {
    it('sets the background color', async () => {
      const backgroundColor = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('bgcolor', 'red')
        document.body.appendChild($marquee)
        return window.getComputedStyle($marquee).backgroundColor
      })
      expect(backgroundColor).toBe('rgb(255, 0, 0)')
    })
  })
  describe.skip('direction', () => {
  })
  describe('height', () => {
    it('sets implict height in pixels', async () => {
      const height = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('height', 100)
        document.body.appendChild($marquee)
        return $marquee.style.height
      })
      expect(height).toBe('100px')
    })
    it('sets explicit height in pixels', async () => {
      const height = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('height', '100px')
        document.body.appendChild($marquee)
        return $marquee.style.height
      })
      expect(height).toBe('100px')
    })
    it('sets explicit height in precentage', async () => {
      const height = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('height', '100%')
        document.body.appendChild($marquee)
        return $marquee.style.height
      })
      expect(height).toBe('100%')
    })
  })
  describe('hspace', () => {
    it('sets vertical margin in pixels', async () => {
      const margins = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('hspace', 100)
        document.body.appendChild($marquee)
        return $marquee.style.marginLeft + ':' + $marquee.style.marginRight
      })
      expect(margins).toBe('100px:100px')
    })
  })
  describe.skip('loop', () => {
  })
  describe.skip('scrollamount', () => {
  })
  describe('vspace', () => {
    it('sets vertical margin in pixels', async () => {
      const margins = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('vspace', 100)
        document.body.appendChild($marquee)
        return $marquee.style.marginTop + ':' + $marquee.style.marginBottom
      })
      expect(margins).toBe('100px:100px')
    })
  })
  describe('width', () => {
    it('sets implict width in pixels', async () => {
      const width = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('width', 100)
        document.body.appendChild($marquee)
        return $marquee.style.width
      })
      expect(width).toBe('100px')
    })
    it('sets explicit width in pixels', async () => {
      const width = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('width', '100px')
        document.body.appendChild($marquee)
        return $marquee.style.width
      })
      expect(width).toBe('100px')
    })
    it('sets explicit width in precentage', async () => {
      const width = await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.setAttribute('width', '100%')
        document.body.appendChild($marquee)
        return $marquee.style.width
      })
      expect(width).toBe('100%')
    })
  })
  describe('easing', () => {
    it('sets transitions with linear by default', async () => {
      await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.textContent = 'Hello Marquee World'
        document.body.appendChild($marquee)
      })
      const html = await page.content()
      const $ = cheerio.load(html)
      const $component = $('pwc-marquee')
      const $innerWrapper = $component.find('span')
      expect($innerWrapper.attr('style')).toContain('linear 0s;')
    })
    it('sets transitions with set easing', async () => {
      await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.textContent = 'Hello Marquee World'
        $marquee.setAttribute('easing', 'ease-in-out')
        document.body.appendChild($marquee)
      })
      const html = await page.content()
      const $ = cheerio.load(html)
      const $component = $('pwc-marquee')
      const $innerWrapper = $component.find('span')
      expect($innerWrapper.attr('style')).toContain('ease-in-out 0s;')
    })
  })
  describe('stagger', () => {
    it('does not split by default', async () => {
      await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.textContent = 'Hello Marquee World'
        document.body.appendChild($marquee)
      })
      const html = await page.content()
      const $ = cheerio.load(html)
      const $component = $('pwc-marquee')
      expect($component.children().length).toBe(1)
    })
    it('can split a sentence into multiple letters', async () => {
      await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.textContent = 'Hello Marquee World'
        $marquee.setAttribute('stagger', 'letters')
        document.body.appendChild($marquee)
      })
      const html = await page.content()
      const $ = cheerio.load(html)
      const $component = $('pwc-marquee')
      expect($component.children().length).toBe(19)
    })
    it('can split a sentence into multiple words', async () => {
      await page.evaluate(() => {
        const $marquee = document.createElement('pwc-marquee')
        $marquee.textContent = 'Hello Marquee World'
        $marquee.setAttribute('stagger', 'words')
        document.body.appendChild($marquee)
      })
      const html = await page.content()
      const $ = cheerio.load(html)
      const $component = $('pwc-marquee')
      expect($component.children().length).toBe(3)
    })
  })
})
