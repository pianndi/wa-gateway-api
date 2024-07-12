import { sock } from "../socket.js"
import { phone } from 'phone'

const profile = async (req, res) => {
  let { id } = req.query
  id = id.replace(/[^0-9.]/g, '')
  const { phoneNumber, isValid } = phone('+' + id)
  if (!isValid) return res.status(400).json({ message: 'Nomor tidak valid' })
  id = phoneNumber.replace('+', '') + '@s.whatsapp.net'
  let image = undefined
  try {
    image = await sock.profilePictureUrl(id)
  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: 'Profile Picture not found' })
  }
  return res.json({ message: 'Profile Picture', data: { image } });
}

export default { profile }