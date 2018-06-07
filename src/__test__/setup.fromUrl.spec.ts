import { expect, assert } from 'chai'
import 'mocha'
import * as nock from 'nock'

import teleport from '../index'

const core = {
  name: "teleport-elements-core",
  version: "0.0.1",
  type: "library",
  elements: {
    View: {
      defaults: {
        style: {
          display: "flex",
          backgroundColor: "#c0c0c0",
          width: 100,
          height: 50
        }
      }
    }
  }
}

const coreReact = {
  name: "teleport-elements-core-react",
  version: "0.0.1",
  type: "mapping",
  library: "teleport-elements-core",
  target: "react",
  map: {
    View: {
      type: "div"
    }
  }
}

const srv = nock('http://libsource.com/')
  .get('/teleport-elements-core.json')
  .reply(200, core)
  .get('/teleport-elements-core-react.json')
  .reply(200, coreReact)

describe('Setup From Url', () => {
  before(() => {
    return new Promise(resolve => {
      const promises = [
        teleport.use('http://libsource.com/teleport-elements-core.json'),
        teleport.use('http://libsource.com/teleport-elements-core-react.json')
      ]

      Promise.all(promises).then(() => {
        resolve()
      })
    })
  })

  it ('elements library should be registered', () => {
    expect(teleport.library(core.name).name).to.equal(core.name)
  })

  it ('elements mapping shoult set up a target correctly', () => {
    expect(teleport.target(coreReact.target).name).to.equal(coreReact.target)
  })

  it ('elements library should have a correct target mapping set', () => {
    expect(teleport.library(core.name).target(coreReact.target).name).to.equal(coreReact.target)
  })

  it ('elements library should have the correct target mapping', () => {
    expect(teleport.library(core.name).mapping(coreReact.target).name).to.equal(coreReact.name)
  })

  it ('elements mapping shoult be set up as a mapping within the target correctly', () => {
    expect(teleport.target(coreReact.target).mapping(coreReact.name).name).to.equal(coreReact.name)
  })

  it ('elements mapping shoult point to the correct elements library', () => {
    expect(teleport.target(coreReact.target).mapping(coreReact.name).library.name).to.equal(core.name)
  })
})