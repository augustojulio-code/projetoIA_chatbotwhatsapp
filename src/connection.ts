import makeWASocket, { DisconnectReason, useMultiFileAuthState } from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import path from 'path';
export const connect = async () => {

    const { state, saveCreds } = await useMultiFileAuthState(

        path.resolve(__dirname, "..", "cache", "auth_info_multi.json")

    );

    const socket = makeWASocket({
        printQRInTerminal: true,
        auth: state,

    });

    socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection == 'close') {
            const shoudReconnet = (lastDisconnect?.error as Boom)?.output?.statusCode !=
                DisconnectReason.loggedOut;

            if (shoudReconnet) {
                await connect();
            }
        }

    });

    socket.ev.on("creds.update", saveCreds);

    return socket
}