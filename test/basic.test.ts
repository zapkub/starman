
import Starman from '..'
import { StarmanRequestStep } from '../request';


Starman([(runner) => {
  runner("Google should be alive", [
      new StarmanRequestStep("Status 200").Get("https://www.google.com").AddTest((pm) => {
        pm.response.to.have.status(200)
      })
  ])
}], {})