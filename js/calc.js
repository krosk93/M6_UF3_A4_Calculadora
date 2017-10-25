class Register {
  constructor(initialValue = 0) {
    this.value = initialValue
    this.lastIsDot = false
    this.lastIsMinus = false
  }

  get displayValue() {
    return `${Math.abs(this.value)}${this.lastIsDot ? '.' : ' '}`
  }

  get charLength() {
    return `${Math.abs(this.value)}`.replace('.', '').length
  }

  get minus() {
    return this.value < 0 || this.lastIsMinus
  }

  get hasDot() {
    return !Number.isInteger(this.value)
  }

  get hasError() {
    if (!isNaN(this.value) && isFinite(this.value) && this.charLength <= 8) return false
    return true
  }

  clear () {
    this.value = 0
    this.lastIsDot = false
    this.lastIsMinus = false
  }

  swapSign() {
    this.lastIsMinus = !this.lastIsMinus
  }

  setValue(newValue) {
    this.value = parseFloat(newValue)
  }

  addCharToValue(char) {
    if (this.charLength < 8) {
      if (char === '.') {
        if (!this.hasDot) this.lastIsDot = true
      } else {
        if (this.lastIsDot) {
          char = `.${char}`
          this.lastIsDot = false
        }
        this.setValue(`${this.lastIsMinus?'-':''}${this.value}${char}`)
      }
    }
  }

  addValue(value) {
    this.value += value
  }

  subValue(value) {
    this.value -= value
  }
}

class Calculator {
  constructor() {
    this.on = false;
    this.register1 = new Register()
    this.register2 = new Register()
    this.memory = new Register()
    this.mainScreen = document.querySelector(".display>.main.front")
    this.memoryScreen = document.querySelector(".display>.memory.front")
    this.minusScreen = document.querySelector(".display>.minus.front")
    this.ops = new Map([
      [
        'sum',
        {
          name: 'Add',
          calc: (value1, value2) => value1 + value2
        }
      ],
      [
        'sub',
        {
          name: 'Substract',
          calc: (value1, value2) => value1 - value2
        }
      ],
      [
        'mul',
        {
          name: 'Multiplication',
          calc: (value1, value2) => value1 * value2
        }
      ],
      [
        'div',
        {
          name: 'Division',
          calc: (value1, value2) => value1 / value2
        }
      ],
      [
        'eq',
        {
          calc: () => {
            const value1 = this.register1.value
            const value2 = this.register2.value
            this.register1.clear()
            this.register2.clear()
            this.activeRegister1 = true
            this.register1.setValue(this.currOp.calc(value1, value2))
            if(value1 === 1714 && value2 === 155 && this.currOp.name === 'Substract')
              this.easterEgg()
          }
        }
      ]
    ])
    this.currOp = null
    this.keys = new Map([
      [
        'ac',
        {
          click: e => {
            if (!this.on) this.turnOn()
            this.initialize()
          }
        }
      ],
      [
        'c',
        {
          click: e => {
            if (!this.on) return
            this.currentRegister.clear()
          }
        }
      ],
      [
        'mrc',
        {
          click: e => {
            if (!this.on) return
            this.currentRegister.clear()
            this.currentRegister.setValue(this.memory.value)
          }
        }
      ],
      [
        'madd',
        {
          click: e => {
            if (!this.on) return
            this.memory.addValue(this.currentRegister.value)
          }
        }
      ],
      [
        'msub',
        {
          click: e => {
            if (!this.on) return
            this.memory.subValue(this.currentRegister.value)
          }
        }
      ],
      [
        'sqrt',
        {
          click: e => {
            if (!this.on) return
            this.currentRegister.setValue(Math.sqrt(this.currentRegister.value))
          }
        }
      ],
      [
        'sum',
        {
          click: e => {
            if(!this.on) return
            this.setOp('sum')
          }
        }
      ],
      [
        'sub',
        {
          click: e => {
            if (!this.on) return
            if(this.currentRegister.value === 0) this.currentRegister.swapSign()
            else this.setOp('sub')
          }
        }
      ],
      [
        'eq',
        {
          click: e => {
            if (!this.on) return
            if (!!this.currOp) this.ops.get('eq').calc()
          }
        }
      ],
      [
        'off',
        {
          click: e => {
            if (!this.on) return
            this.turnOff()
          }
        }
      ],
      [
        '0',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('0')
          }
        }
      ],
      [
        '1',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('1')
          }
        }
      ],
      [
        '2',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('2')
          }
        }
      ],
      [
        '3',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('3')
          }
        }
      ],
      [
        '4',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('4')
          }
        }
      ],
      [
        '5',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('5')
          }
        }
      ],
      [
        '6',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('6')
          }
        }
      ],
      [
        '7',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('7')
          }
        }
      ],
      [
        '8',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('8')
          }
        }
      ],
      [
        '9',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('9')
          }
        }
      ],
      [
        'dot',
        {
          click: e => {
            if (!this.on) return
            this.addToCurrentRegister('.')
          }
        }
      ],
    ])
    this.initialize()
    this.registerListeners()
    this.render()
  }

  easterEgg() {
    document.querySelectorAll(".calculator").forEach(el => el.classList.add('senyera'))
    const maxPos = 8
    const display = function* () {
      const outMessage = Array(8).fill('!')
      const message = "!!!!!!!!Bon!cop!de!false!!!!!!!!".split('')
      const messageLength = message.length
      for (let i = 0; i < messageLength; i++) {
        outMessage.shift()
        outMessage.push(message.shift())
        yield outMessage.join('')
      }
      return "!"
    }
    const valor = display()
    const show = () => {
      const sq = valor.next()
      this.mainScreen.innerHTML = sq.value
      if(!sq.done) {
        setTimeout(() => {
          show()
        }, 250)
      } else {
        document.querySelectorAll(".calculator").forEach(el => el.classList.remove('senyera'))
        this.render()
      }
    }
    show()
  }

  turnOn() {
    this.on = true
    // setTimeout(() => {
    //   this.mainScreen.innerHTML = "Welcome"
    //   setTimeout(() => {
    //     this.mainScreen.innerHTML = this.currentRegister.displayValue
    //   }, 2000)
    // }, 10)
  }

  turnOff() {
    this.on = false
    this.register1.clear()
    this.register2.clear()
    this.memory.clear()
    // setTimeout(() => {
    //   this.mainScreen.innerHTML = "bye"
    //   setTimeout(() => {
    //     this.mainScreen.innerHTML = ""
    //   }, 2000)
    // }, 10)
  }

  setOp(opName) {
    if (this.ops.has(opName)) {
      this.currOp = this.ops.get(opName)
      this.swapRegister()
    }
  }

  initialize() {
    this.register1.clear()
    this.register2.clear()
    this.activeRegister1 = true;
  }

  registerListeners() {
    document.querySelectorAll(".button").forEach(el => {
      if (this.keys.has(el.getAttribute('data-button')))
        el.addEventListener('click', this.keys.get(el.getAttribute('data-button')).click)
    })
    document.querySelectorAll(".five-button").forEach(el => {
      if (this.keys.has(el.getAttribute('data-button')))
        el.addEventListener('click', this.keys.get(el.getAttribute('data-button')).click)
    })
    document.addEventListener('click', e => this.render())
  }

  addToCurrentRegister(char) {
    this.currentRegister.addCharToValue(char)
  }

  swapRegister() {
    this.activeRegister1 = !this.activeRegister1
  }

  get displayValue() {
    return this.currentRegister.displayValue;
  }

  get currentRegister() {
    if (this.activeRegister1) return this.register1
    return this.register2
  }

  render() {
    if (this.on) this.mainScreen.innerHTML = !this.currentRegister.hasError ? this.displayValue : "error"
    else this.mainScreen.innerHTML = ""
    if (this.currentRegister.minus) this.minusScreen.classList.remove('invisible')
    else this.minusScreen.classList.add('invisible')
    if (this.memory.value !== 0) this.memoryScreen.classList.remove('invisible')
    else this.memoryScreen.classList.add('invisible')
    this.updateDebugInfo()
  }

  updateDebugInfo() {
    document.querySelector(".debug>#register1 #value>.value").innerHTML = this.register1.value
    document.querySelector(".debug>#register1 #minus>.value").innerHTML = this.register1.minus
    document.querySelector(".debug>#register1 #charLength>.value").innerHTML = this.register1.charLength
    document.querySelector(".debug>#register1 #lastIsDot>.value").innerHTML = this.register1.lastIsDot
    document.querySelector(".debug>#register1 #lastIsMinus>.value").innerHTML = this.register1.lastIsMinus

    document.querySelector(".debug>#register2 #value>.value").innerHTML = this.register2.value
    document.querySelector(".debug>#register2 #minus>.value").innerHTML = this.register2.minus
    document.querySelector(".debug>#register2 #charLength>.value").innerHTML = this.register2.charLength
    document.querySelector(".debug>#register2 #lastIsDot>.value").innerHTML = this.register2.lastIsDot
    document.querySelector(".debug>#register2 #lastIsMinus>.value").innerHTML = this.register2.lastIsMinus

    document.querySelector(".debug>#memory #value>.value").innerHTML = this.memory.value
    document.querySelector(".debug>#memory #minus>.value").innerHTML = this.memory.minus
    document.querySelector(".debug>#memory #charLength>.value").innerHTML = this.memory.charLength
    document.querySelector(".debug>#memory #lastIsDot>.value").innerHTML = this.memory.lastIsDot
    document.querySelector(".debug>#memory #lastIsMinus>.value").innerHTML = this.memory.lastIsMinus

    document.querySelector(".debug>#calculator #on>.value").innerHTML = this.on
    document.querySelector(".debug>#calculator #currOp>.value").innerHTML = this.currOp && this.currOp.name
    document.querySelector(".debug>#calculator #activeRegister>.value").innerHTML = this.activeRegister1 ? 'Register 1' : 'Register 2'
  }
}

window.calculator = new Calculator()
