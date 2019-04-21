import Starman from '..'
import { StarmanRequestStep } from '../request'
import { join } from 'path'

const PingRequest = new StarmanRequestStep('Status 200')
  .Get('https://www.{{url}}')
  .AddQuery({
    v: '{{url}}',
    b: 'somethingกขอ'
  })
  .AddTest(pm => {
    pm.response.to.have.status(200)
  })

// Both Collection use the same request but different env
Starman(
  [runner => runner('Google should be alive', [PingRequest])],
  {
    url: 'google.com'
  },
  {
    outputDir: join(__dirname, './reusing-collections'),
    collectionName: 'google',
    environmentName: 'google'
  }
)

Starman(
  [runner => runner('facebook should be alive', [PingRequest])],
  {
    url: 'facebook.com'
  },
  {
    outputDir: join(__dirname, './reusing-collections'),
    collectionName: 'facebook',
    environmentName: 'facebook'
  }
)
