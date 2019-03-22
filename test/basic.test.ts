
import * as Starman from '..'


Starman.default([(runner) => {
  runner("Google should be alive", [
      new Starman.StarmanRequestStep("Status 200").Get("https://www.{{url}}").AddTest((pm) => {
        pm.response.to.have.status(200)
      })
  ])
}], {
  url: "google.com"
})