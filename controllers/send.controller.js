import { sock } from "../socket.js"
import { phone } from 'phone'

const text = async (req, res) => {
  let { message, target } = req.body;
  target = target + '@s.whatsapp.net';
  try {
    const msg = await sock.sendMessage(target, { text: message });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message' });
  }
  return res.json({ message: 'Pesan berhasil terkirim', data: { target, message } });
}
const validateNumber = (req, res, next) => {
  const { target } = req.body;
  const noSymbol = target?.replace(/[^0-9.]/g, '')
  const { phoneNumber, isValid } = phone('+' + noSymbol)
  if (!isValid) return res.status(400).json({ message: 'Nomor tidak valid' })
  req.body.target = phoneNumber.replace('+', '')
  next()
}
export default { text, validateNumber }