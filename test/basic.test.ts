import Starman from '..'
import { join } from 'path'
import { StarmanRequestStep } from '..'

Starman(
  [
    runner => {
      runner('Google should be alive', [
        // << This is folder name
        new StarmanRequestStep('Just call google.com') // << This is request name
          .Get('https://www.{{url}}')
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
    outputDir: join(__dirname, './basic-collections'),
  }
)
