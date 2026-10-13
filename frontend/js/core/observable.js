class Observable {
  #listeners = [];
  #value;
  
  constructor(initial) { 
    this.#value = initial; 
  }
  
  get value() { 
    return this.#value; 
  }
  
  set value(v) { 
    this.#value = v; 
    this.#listeners.forEach(fn => fn(v)); 
  }
  
  subscribe(fn) { 
    this.#listeners.push(fn); 
    fn(this.#value); 
    return () => { 
      this.#listeners = this.#listeners.filter(l => l !== fn); 
    }; 
  }
}