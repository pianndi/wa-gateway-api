import { sock } from "../socket.js"
import { phone } from 'phone'

const text = async (req, res) => {
  const { message, to } = req.body;
  const target = to + '@s.whatsapp.net';
  try {
    const msg = await sock.sendMessage(target, { text: message });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to send message' });
  }
  return res.json({ message: 'Pesan berhasil terkirim', data: { target, message } });
}
const button = async (req, res) => {
  const { message, to } = req.body;
  const target = to + '@s.whatsapp.net';
  const templateButtons = [
    { index: 1, urlButton: { displayText: '⭐ Star Baileys on GitHub!', url: 'https://github.com/amiruldev20/Baileys' } },
    { index: 2, callButton: { displayText: 'Call me!', phoneNumber: '+6289519302975' } },
    { index: 3, quickReplyButton: { displayText: 'This is a reply, just like normal buttons!', id: 'id-like-buttons-message' } },
  ]

  const templateMessage = {
    text: "Hi it's a template message",
    footer: 'Hello World',
    viewOnce: true,
    templateButtons: templateButtons
  }
  await sock.sendMessage(to, templateMessage)
  return res.json({ message: 'Template message sent' });
}
const validateNumber = (req, res, next) => {
  const { to } = req.body;
  const noSymbol = to.replace(/[^0-9.]/g, '')
  const { phoneNumber, isValid } = phone('+' + noSymbol)
  if (!isValid) return res.status(400).json({ message: 'Nomor tidak valid' })
  req.body.to = phoneNumber.replace('+', '')
  next()
}
export default { text, validateNumber }