const jwt = require('jsonwebtoken');
const redis = require('redis');

//setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        Promise.reject('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply ) {
      return res.status(400).json('Unauthorized')
    }
    return res.json({id: reply})
  })
}

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayLoad, 'JWT_SECRET', { expiresIn: '2 days'});
}

const setToken = (token, id) => {
  return Promise.resolve(redisClient.set(token, value))
}

const createSessions = (user) => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
  .then(() => {
    return { success: 'true', userId: id, token }
  })
  .catch(console.log)
}

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) :
  handleSignin(db, bcrypt, req, res)
  .then(data => {
    data.id && data.email ? createSessions(data) : Promise.reject(data)
  })
  .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication: signinAuthentication
}
