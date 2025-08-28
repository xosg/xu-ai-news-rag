const chroma = 'http://localhost:8000'

async function getInfo() {
    let identity = await fetch(`${chroma}/api/v2/auth/identity`)
    identity = await identity.json();
    const { user_id, tenant, databases } = identity;

    let health = await fetch(`${chroma}/api/v2/healthcheck`)
    health = await health.json()


    let heart = await fetch(`${chroma}/api/v2/heartbeat`)
    heart = await heart.json()


    let preflight = await fetch(`${chroma}/api/v2/pre-flight-checks`)
    preflight = await preflight.json()

    let version = await fetch(`${chroma}/api/v2/version`)
    version = await version.json()


    const info = { ...identity, ...health, ...heart, ...preflight, version }
    console.log(info)
}


async function run() {
    await getInfo()

}


run()
