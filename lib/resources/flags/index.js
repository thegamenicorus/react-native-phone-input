import { getAllIso2, getFlagImages } from '@bodhiveggie/countries';

let instance = null

class FlagResource {
  static getInstance() {
    if (!instance) {
      instance = new FlagResource()
    }
    return instance
  }

  constructor() {
    this.flags = getFlagImages();
  }

  get(name) {
    return this.flags[name.toUpperCase()]
  }
}

export default FlagResource.getInstance()
