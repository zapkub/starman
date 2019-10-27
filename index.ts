/*
 * Maintainer
 * - rungsikorn.r@digithunworldwide.com
 */

import {
  CreatePostmanEnvFromStarmanEnv,
  CreatePostmanCollectionItemFromStarmanRequest,
  StarmanRunner,
  StarmanEnvironmentVariables
} from './runner'

const fs = require('fs')
const path = require('path')
const newman = require('newman')

interface StarmanRunnerOptions {
  outputDir?: string
  collectionName?: string
  environmentName?: string
}

export default function Starman(
  steps: ((runner: StarmanRunner) => void)[],
  environment: StarmanEnvironmentVariables,
  options: StarmanRunnerOptions = {}
) {
  const collection = {
    info: {
      name: options.collectionName || 'API Collections E2E testing',
      descriptions: '',
      schema:
        'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
    },
    item: []
  }
  const env = CreatePostmanEnvFromStarmanEnv(environment)
  if (options.environmentName) {
    env.name = options.environmentName
  }

  steps.forEach(p => {
    p((name, steps) => {

      collection.item.push({
        name: name,
        item: steps.map(CreatePostmanCollectionItemFromStarmanRequest)
      })

    })
  })

  return new Promise((resolve, reject) => {
    newman.run(
      {
        collection: collection,
        environment: env,
        reporters: 'cli'
      },
      function(err) {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
        if (options.outputDir) {
          fs.writeFileSync(
            path.join(
              options.outputDir,
              `./${options.collectionName || 'postman'}.collection.json`
            ),
            JSON.stringify(collection, null, ' ')
          )
          fs.writeFileSync(
            path.join(
              options.outputDir,
              `./${options.environmentName || 'postman'}.variables.json`
            ),
            JSON.stringify(env, null, ' ')
          )
        }
      }
    )
  })
}

export * from './request'
export * from './runner'
