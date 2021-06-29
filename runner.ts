export type StarmanRunner = (name: string, steps: StarmanStep[]) => void
export interface StarmanEnvironmentVariables {
    [key: string]: string
}

export type StarmanStepObjectBody = {
    [key: string]: any
}
export type StarmanStepRawBody = string
export type StarmanStepBody = StarmanStepObjectBody | StarmanStepRawBody
export type StarmanRequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
export interface StarmanStep {
    name: string
    test: Function | Function[]
    preRequest: Function | Function[]
    request: {
        url: string
        query?: { key: string, value: string }[],
        method: StarmanRequestMethod,
        header: {
            key: string
            value: string
        }[]
        body?: StarmanStepBody,
    }
}

export function CreatePostmanEnvFromStarmanEnv(envs: StarmanEnvironmentVariables) {
    return {
        name: "API variables for testing",
        values:
            Object.keys(envs).map(k => {
                return {
                    key: k,
                    value: envs[k],
                    "description": {
                        "content": "",
                        "type": "text/plain"
                    },
                    enabled: true,
                }
            }),
        id: "bcd28ee2-5a3c-42bd-8f47-77cfcf213d20",
    }

}

const toEvents = (name: string, func: Function | Function[]) => {
    if (!func || (Array.isArray(func) && func.length <= 0)) {
        return []
    }

    return [
        {
            listen: name,
            script: {
                type: "text/javascript",
                exec: Array.isArray(func) ? func.filter(t => t).map(t => `(${t})(pm);`) : "(" + func.toString() + ")(pm)",
            }
        }
    ]
}

export function CreatePostmanCollectionItemFromStarmanRequest(step: StarmanStep) {
    // Step body should be stringify
    // if body is just plain object
    if (typeof step.request.body === 'object' && step.request.body.mode === undefined) {
        step.request.body = {
            mode: "raw",
            raw: JSON.stringify(step.request.body)
        }
    } else if (typeof step.request.body === 'string') {
         step.request.body = {
            mode: "raw",
            raw: step.request.body
        }
    }

    const test = toEvents("test", step.test)
    const preRequest = toEvents("prerequest", step.preRequest)

    return {
        name: step.name,
        event: [
            ...test,
            ...preRequest,
        ],
        request: step.request,
    }
}