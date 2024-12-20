async function getPresets(password) {
    try {
        const config = {
            method: 'GET',
        }
        const response = await fetch(`/get_all_presets?token=${password}`, config)
        const json = await response.json()

        if (response.ok) return json

        switch (response.status) {
            case 401:
                return { msg: "Incorrect password" }
            case 500:
            case 400:
                return { msg: "Unhadled server exception" }
        }
    }
    catch (e) {
        return { msg: e }
    }
}

async function getPreset(presetId, password) {
    try {
        const config = {
            method: 'GET',
        }
        const response = await fetch(`/get_preset/${presetId}?token=${password}`, config)
        const json = await response.json()

        if (response.ok) return json

        switch (response.status) {
            case 401:
                return { msg: "Incorrect password" }
            case 500:
            case 404:
            case 400:
                return { msg: "Unhadled server exception" }
        }
    }
    catch (e) {
        return { msg: e }
    }
}

async function getKeys(password) {
    try {
        const config = {
            method: 'GET',
        }
        const response = await fetch(`/get_keys?token=${password}`, config)
        const json = await response.json()

        if (response.ok) return json

        switch (response.status) {
            case 401:
                return { msg: "Incorrect password" }
            case 500:
            case 404:
            case 400:
                return { msg: "Unhadled server exception" }
        }
    }
    catch (e) {
        return { msg: e }
    }
}