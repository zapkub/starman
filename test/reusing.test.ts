import Starman from '..'
import { StarmanRequestStep } from '../request';

const PingRequest = new StarmanRequestStep('Status 200')
  .Get('https://www.{{url}}')
  .AddTest(pm => {
    pm.response.to.have.status(200)
  })

// Both Collection use the same request but different env
Starman([(runner) => runner('Google should be alive', [PingRequest])], {
  url: 'google.com'
})

Starman([(runner) => runner('facebook should be alive', [PingRequest])], {
  url: 'facebook.com'
})
