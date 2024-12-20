var socket;
let isConnected = false;

async function connectSocket(password, clearConnectionData, ipsChangedCallback) {
    let ips = [];

    socket = await io.connect(`?type=frontend&password=${password}`, { reconnection: false });

    socket.on('conect', err => console.log("connected"))
    socket.on('error', err => clearConnectionData(err))
    socket.on('close', err => clearConnectionData(err))
    socket.on('connect_error', err => clearConnectionData(err))
    socket.on('connect_failed', err => clearConnectionData(err))
    socket.on('disconnect', err => clearConnectionData(err))

    socket.on('init', (data) => {
        try {
            data.forEach(ip => ips.push(ip));
            ipsChangedCallback(ips);
        }
        catch { }
    });

    socket.on('statuses', (data) => {
        try {
            ips = []
            data.forEach(ip => ips.push(ip));
            ipsChangedCallback(ips);
        }
        catch { }
    });
}