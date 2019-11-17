import { StarmanStep, StarmanRequestMethod, StarmanStepBody } from './runner'
import { stringify } from 'querystring'

export class StarmanRequestStep implements StarmanStep {
  name = ''
  test = []
  preRequest = []
  request: StarmanStep['request'] = {
    url: '',
    method: 'GET' as StarmanRequestMethod,
    header: []
  }
  query: string
  constructor(name: string) {
    this.name = name
  }
  private reloadURL() {
    if (this.query) {
      this.request.url = `${this.request.url}?${this.query}`
    }
  }
  AddQuery(query: {[key: string]: string | number}) {
    this.query = stringify(query,"&","=",{
      encodeURIComponent:(v) => {
        if(/\{\{.*\}\}/.test(v)){
          return v
        } else {
          return encodeURIComponent(v)
        }
      }
    })
    this.request.query = Object.keys(query).map(key => {
      return {
        key,
        value: query[key] + ""
      }
    })
    this.reloadURL()
    return this
  }
  Get(url: string) {
    this.request.url = url
    this.request.method = 'GET'
    this.reloadURL()
    return this
  }
  Post(url: string) {
    this.request.url = url
    this.request.method = 'POST'
    this.reloadURL()
    return this
  }
  Put(url: string) {
    this.request.url = url
    this.request.method = 'PUT'
    this.reloadURL()
    return this
  }
  Delete(url: string) {
    this.request.url = url
    this.request.method = 'DELETE'
    this.reloadURL()
    return this
  }
  AddHeader(key: string, value: string) {
    this.request.header.push({
      key,
      value
    })
    return this
  }
  AddBody(body: StarmanStepBody) {
    this.request.body = body
    return this
  }
  AddTest(test: StarmanTestFunc) {
    this.test.push(test)
    return this
  }
  AddPreRequest(preRequest: StarmanPreRequestFunc) {
    this.preRequest.push(preRequest)
    return this
  }
}

export type StarmanTestFunc = (pm: any) => void
export type StarmanPreRequestFunc = (pm: any) => void
