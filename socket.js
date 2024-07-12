import { makeWASocket, DisconnectReason, useMultiFileAuthState, Browsers, fetchLatestBaileysVersion } from "@whiskeysockets/baileys";
import pino from 'pino';
import fs from 'fs'
const { version, isLatest } = await fetchLatestBaileysVersion()
const [APP_NAME, APP_OS, APP_VERSION] = ['Ekur', 'Desktop', '1.0.0']
export let sock, qr, auth, koneksi = 'connecting', info = {
  APP_NAME,
  APP_OS,
  APP_VERSION,
  WA_VERSION: version.join('.'),
};
async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info')
  auth = state
  console.log(`${info.APP_NAME} using WA v${info.WA_VERSION}, isLatest: ${isLatest}`)

  sock = makeWASocket({
    // can provide additional config here
    version,
    browser: [`${info.APP_NAME} `, info.APP_OS, info.APP_VERSION],
    printQRInTerminal: true,
    auth: state,
    logger: pino({ level: 'silent' }),
  });

  sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection) {
      koneksi = connection;
    }
    qr = update.qr;
    if (connection === "open") {
      console.log("opened connection");
    } else if (connection === "close") {
      console.log(
        "connection closed due to \n",
        JSON.stringify(update.lastDisconnect.error?.output?.payload),
        "\n, reconnecting... "
      );
      if (update.lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
        fs.rmSync('auth_info', { recursive: true, force: true });

        // exit the process and restart
      }
      connectToWhatsApp()
      // reconnect if not logged out
    }
  });

  sock.ev.on("creds.update", saveCreds)
}

connectToWhatsApp()