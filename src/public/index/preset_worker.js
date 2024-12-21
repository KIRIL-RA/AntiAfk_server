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

async function createPrest(name, buttons, password) {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: password,
            name: name,
            buttons: buttons
        })
    };
    try {
        const fetchResponse = await fetch(`/add_preset`, settings);
    } catch (e) {
        alert(e);
    }   
} 

async function activatePreset(presetId, buttonName, emitClients, password){
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: password,
            presetId: presetId,
            buttonName: buttonName,
            emitClients: emitClients
        })
    };
    try {
        const fetchResponse = await fetch(`/send_action`, settings);
    } catch (e) {
        alert(e);
    }   
}

async function sendPushButton(buttonName, repeats, emitClients, password) {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: password,
            repeatsCount: Number(repeats),
            action: buttonName,
            emitClients: emitClients
        })
    };
    try {
        const fetchResponse = await fetch(`/send_button`, settings);
    } catch (e) {
        alert(e);
    }   
} 

async function setIpName(ip, name, password) {
    const settings = {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            token: password,
            name: name,
            ip: ip
        })
    };
    try {
        const fetchResponse = await fetch(`/create_client`, settings);
    } catch (e) {
        alert(e);
    }   
}