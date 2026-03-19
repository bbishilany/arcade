// PeerJS WebRTC peer-to-peer multiplayer
// No server needed — works on static GitHub Pages

let peer = null;
let conn = null;
let isHostPlayer = false;
let connected = false;
let roomCode = '';
let messageCallback = null;
let statusCallback = null;

function generateCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

function setStatus(msg) {
    if (statusCallback) statusCallback(msg);
}

export function onStatus(cb) {
    statusCallback = cb;
}

export function onMessage(cb) {
    messageCallback = cb;
}

function setupConnection(connection) {
    conn = connection;
    conn.on('open', () => {
        connected = true;
        setStatus('CONNECTED!');
    });
    conn.on('data', (data) => {
        if (messageCallback) messageCallback(data);
    });
    conn.on('close', () => {
        connected = false;
        setStatus('DISCONNECTED');
    });
    conn.on('error', () => {
        connected = false;
        setStatus('CONNECTION ERROR');
    });
}

export function createRoom() {
    return new Promise((resolve) => {
        roomCode = generateCode();
        isHostPlayer = true;
        const peerId = 'baseball-arcade-' + roomCode;

        peer = new Peer(peerId);

        peer.on('open', () => {
            setStatus('ROOM: ' + roomCode);
            resolve(roomCode);
        });

        peer.on('connection', (connection) => {
            setupConnection(connection);
        });

        peer.on('error', (err) => {
            setStatus('ERROR: ' + err.type);
            resolve(null);
        });
    });
}

export function joinRoom(code) {
    return new Promise((resolve) => {
        roomCode = code;
        isHostPlayer = false;
        const hostId = 'baseball-arcade-' + code;

        peer = new Peer();

        peer.on('open', () => {
            setStatus('JOINING...');
            const connection = peer.connect(hostId, { reliable: true });
            setupConnection(connection);

            // Wait for connection to open
            connection.on('open', () => {
                resolve(true);
            });

            connection.on('error', () => {
                setStatus('COULD NOT CONNECT');
                resolve(false);
            });
        });

        peer.on('error', (err) => {
            if (err.type === 'peer-unavailable') {
                setStatus('ROOM NOT FOUND');
            } else {
                setStatus('ERROR: ' + err.type);
            }
            resolve(false);
        });

        // Timeout
        setTimeout(() => {
            if (!connected) {
                setStatus('TIMED OUT');
                resolve(false);
            }
        }, 10000);
    });
}

export function sendMessage(data) {
    if (conn && connected) {
        conn.send(data);
    }
}

export function isHost() {
    return isHostPlayer;
}

export function isConnected() {
    return connected;
}

export function getRoomCode() {
    return roomCode;
}

export function disconnect() {
    if (conn) conn.close();
    if (peer) peer.destroy();
    conn = null;
    peer = null;
    connected = false;
    isHostPlayer = false;
    roomCode = '';
}
