import Starman from '..'
import { join } from 'path'
import { StarmanRequestStep } from '..'

const express = require('express')
const app = express()

app.get('/some', (req, res) => {
  console.log(req.query)
  res.json(req.query)
})

const instance = app.listen(9912, () => {
  console.log('app start :9912')
})

async function start() {
  await Starman(
    [
      runner => {
        runner('Localhost test', [
          new StarmanRequestStep('Should return query').Get(
            'http://localhost:9912/some'
          )
          .AddQuery({
            x: "10"
          })
          .AddTest((pm) => {
              pm.expect(pm.response.json().x).to.be.eql("10") 
          })
        ])
        runner('Google should be alive', [
          // << This is folder name
          new StarmanRequestStep('Just call google.com') // << This is request name
            .Get('https://www.{{url}}')
            .AddQuery({
              test: '19'
            })
            .AddTest(pm => {
              pm.test('Google.com must return 200 status', () => {
                // << Write test here !
                pm.response.to.have.status(200)
              })
            })
        ])
      }
    ],
    {
      url: 'google.com'
    },
    {
      outputDir: join(__dirname, './basic-collections')
    }
  )
  instance.close()
}
start()