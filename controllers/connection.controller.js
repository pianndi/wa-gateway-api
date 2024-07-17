import qrImage from 'qr-image';
import { sock, auth, info, koneksi, qr as qrCode } from "../socket.js";

const get = async (req, res) => {
  if (koneksi === 'open') {
    const me = auth?.creds?.me
    me.platform = auth?.creds?.platform
    let profile = null
    try {
      profile = await sock.profilePictureUrl(me?.id, 'image')
    } catch (error) {
    }
    me.profile = profile
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
const status = (req, res) => {
  if (koneksi === 'open') {
    const me = auth?.creds?.me
    return res.status(200).json({ message: 'WA sudah terhubung', data: { ...info, me } });
  }
  return res.status(204).json({ message: 'WA belum terhubung', data: { ...info } });
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
  try {
    await sock.logout('logout');
  } catch (error) {
    return res.status(500).json({ message: 'Failed to logout' });
  }
  return res.json({ message: 'Logged out' });
}
export default { get, qr, logout, status }