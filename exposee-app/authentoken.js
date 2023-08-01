import pkg from 'jsonwebtoken'
const { verify } = pkg

function validateToken (req, res, next) {
  const accesstoken = req.header('access_token')
  if (!accesstoken) return res.json({ error: 'user not logged in' })
  try {
    const validtoken = verify(accesstoken, 'iamtheSwat1*')
    console.log('at', accesstoken)
    if (validtoken) {
      const userId = validtoken.id
      console.log(validtoken.id)
      console.log('User ID from token:', userId)
      req.userId = userId
      req.access_token = accesstoken
      return next()
    }
  } catch (err) {
    console.error('Token verification error:', err)
    return res.json({ error: err.message })
  }
}

export default validateToken
