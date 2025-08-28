const chroma = 'http://localhost:8000'

async function getInfo() {
    let identity = await fetch(`${chroma}/api/v2/auth/identity`)
    identity = await identity.json();
    const { user_id, tenant, databases } = identity;

    // let health = await fetch(`${chroma}/api/v2/healthcheck`)
    // health = await health.json()


    // let heart = await fetch(`${chroma}/api/v2/heartbeat`)
    // heart = await heart.json()


    // let preflight = await fetch(`${chroma}/api/v2/pre-flight-checks`)
    // preflight = await preflight.json()

    // let version = await fetch(`${chroma}/api/v2/version`)
    // version = await version.json()


    // const info = { ...identity, ...health, ...heart, ...preflight, version }
    // console.log(info)


    // Expected a name containing 3-512 characters from [a-zA-Z0-9._-], starting and ending with a character in [a-zA-Z0-9].
    let initCollection = await fetch(`${chroma}/api/v2/tenants/${tenant}/databases/${databases[0]}/collections`, {
        method: 'POST',
        body: JSON.stringify({
            "configuration": null,
            // upsert
            "get_or_create": true,
            "metadata": null,
            "name": "x.lab"
        }),
        headers: {
            'content-type': 'application/json'
        }
    })

    initCollection = await initCollection.json()

    console.log(initCollection)
}




async function run() {
    await getInfo()


}


run()
