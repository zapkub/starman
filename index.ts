/*
 * Maintainer
 * - rungsikorn.r@digithunworldwide.com
 */

import { CreatePostmanEnvFromStarmanEnv, CreatePostmanCollectionItemFromStarmanRequest, StarmanRunner, StarmanEnvironmentVariables } from "./runner";

const fs = require('fs');
const path = require('path');
const newman = require('newman');

export default function Starman(steps: ((runner: StarmanRunner)=>void)[], environment: StarmanEnvironmentVariables) {
    const collection = {
        info: {
            name: "API Collections E2E testing",
            descriptions: "",
            schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
        },
        item: [ ]
    }
    const env = CreatePostmanEnvFromStarmanEnv(environment)
    steps.forEach(p => {
        p((name, steps) => {
               collection.item.push({
                   name: name,
                   item: steps.map(CreatePostmanCollectionItemFromStarmanRequest)
               })
        })
    })
    newman.run({
       collection: collection,
       environment: env,
        reporters: 'cli',
    },function(err) {
        if (err) {
           console.error(err)
        }

        if (typeof process.env["STARMAN_RESULT_DIR"] === "string") {
            fs.writeFileSync(path.join(process.env["STARMAN_RESULT_DIR"], "./result/postman.collection.json"),JSON.stringify(collection,null, " "))
            fs.writeFileSync(path.join(process.env["STARMAN_RESULT_DIR"], "./result/postman.variables.json"),JSON.stringify(env, null, " "))
        }

    })
}