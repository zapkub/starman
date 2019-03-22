import { StarmanStep, StarmanRequestMethod, StarmanStepBody } from "./runner";

export class StarmanRequestStep implements StarmanStep {
    name = ""
    test = []
    request: StarmanStep['request'] = {
        url: "",
        method: 'GET' as StarmanRequestMethod,
        header: []
    }
    constructor(name: string) {
        this.name = name
    }
    Get(url: string) {
        this.request.url = url
        this.request.method = 'GET'
        return this
    }
    Post(url: string) {
        this.request.url = url
        this.request.method = 'POST'
        return this
    }
    Put(url: string) {
        this.request.url = url
        this.request.method = 'PUT'
        return this
    }
    Delete(url: string) {
        this.request.url = url
        this.request.method = 'DELETE'
        return this
    }
    AddHeader(key: string, value: string) {
        this.request.header.push({
            key,
            value,
        })
        return this
    }
    AddBody(body: StarmanStepBody) {
        this.request.body = body
        return this
    }
    AddTest(test: (pm: any) => void) {
        this.test.push(test)
        return this
    }
}