import io.gatling.core.Predef._    // required for Gatling core structure DSL
import io.gatling.jdbc.Predef._    // can be omitted if you don't use jdbcFeeder
import io.gatling.http.Predef._    // required for Gatling HTTP DSL

import scala.concurrent.duration._

class simuGet extends Simulation {

  val httpConf = http
    .baseUrl("https://uberelo2031.herokuapp.com/") // Here is the root for all relative URLs
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8") // Here are the common headers

  val scn = scenario("BasicSimulation")
    .exec(http("Get stocks").get("game/league_of_legends"))
    .pause(5)

  setUp(scn.inject(atOnceUsers(2200)).protocols(httpConf))
    .assertions(global.responseTime.max.lt(10000))
}