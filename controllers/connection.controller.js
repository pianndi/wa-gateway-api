import qrImage from 'qr-image';
import { sock, auth, info, koneksi, qr as qrCode } from "../socket.js";
const code = async (req, res) => {
  if (koneksi !== 'connecting') {
    const me = auth?.creds?.me
    me.profile = await sock.profilePictureUrl(me?.id, 'image')
    return res.status(500).json({ message: 'WA sudah terhubung', data: { CONNECTION: koneksi, ...info, me } });
  }
  const { number } = req.body
  const pairingCode = await sock.requestPairingCode(number)
  return res.json({
    message: 'Berhasil', data: {
      pairingCode
    }
  });
}
const get = async (req, res) => {
  if (koneksi !== 'connecting') {
    const me = auth?.creds?.me
    me.platform = auth?.creds?.platform
    me.profile = await sock.profilePictureUrl(me?.id, 'image')
    return res.status(500).json({ message: 'WA sudah terhubung', data: { CONNECTION: koneksi, ...info, me } });
  }
  if (!qrCode) {
    return res.status(404).json({ message: 'QR Loading', data: info });
  }
  res.json({
    message: 'Scan untuk Masuk', data: {
      qr: qrCode,
      src: `data:image/png;base64,${qrImage.imageSync(qrCode, { type: 'png' }).toString('base64')}`,
      ...info
    }
  });
}
const qr = (req, res) => {
  if (!qrCode) {
    return res.status(404).json({ message: 'QR Loading' });
  }
  res.json({
    message: 'Berhasil mengambil qr', data: {
      qr: qrCode,
      src: `data:image/png;base64,${qrImage.imageSync(qrCode, { type: 'png' }).toString('base64')}`
    }
  });
}

const logout = async (req, res) => {
  if (koneksi !== 'open') {
    return res.status(500).json({ message: 'WA belum terhubung' });
  }
  await sock.logout('logout');
  res.json({ message: 'Logged out' });
}
export default { get, qr, logout, code }