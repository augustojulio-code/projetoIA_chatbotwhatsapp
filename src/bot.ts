import { connect } from "./connection"

export default async () => {

    const socket = await connect();

    socket.ev.on("messages.upsert", async (message) => {
        console.log(JSON.stringify(message, undefined, 2));

        console.log("replying to", message.messages[0].key.remoteJid);
        await socket.sendMessage(message.messages[0].key.remoteJid!, {
            text: "Olá pessoal!"
        });

    });
};