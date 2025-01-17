const router = require('express').Router();
const jwt = require('jsonwebtoken');
const createUser = require('../controllers/user/createUser.js');
const authLogin = require('../controllers/user/authLogin.js');
const { Token } = require('../database.js');
const generateAccessToken = require('../controllers/user/utils/generateAccessToken.js');
const verifyEmail = require('../controllers/user/utils/verifyEmail.js');
const authToken = require('./middlewares/authToken.js');
const getUser = require('../controllers/user/getUser.js');
const getAllUser = require('../controllers/user/getAllUser');
const editUser = require('../controllers/user/editUser.js');
const deleteUser = require('../controllers/user/deleteUser.js');
const deleteDirection = require('../controllers/direction/deleteDirection.js');
const getDirection = require('../controllers/direction/getDirection.js');
const createAndAddDirection = require('../controllers/direction/createAndAddDirection.js');

//crear nuevo usuario
router.post('', async function (req, res) {
  const {
    firstName,
    lastName,
    password,
    profilePicture,
    email,
    rol,
    newsletterSubscription,
    direction,
  } = req.body;
  try {
    await createUser({
      firstName,
      lastName,
      password,
      profilePicture,
      email,
      rol,
      newsletterSubscription,
      direction,
    });

    return res.status(201).send({ msg: 'User created' });
  } catch (err) {
    return res.status(500);
  }
});
//login
router.post('/login', async function (req, res) {
  try {
    const { email, password } = req.body;
    const authResponse = await authLogin(email, password);
    res.send(authResponse);
  } catch (err) {
    console.log(err);
  }
});
//verificar mail
router.post('/email', async function (req, res) {
  try {
    const { email } = req.body;
    const msg = await verifyEmail(email);
    res.send(msg);
  } catch (err) {
    console.log(err);
  }
});
//crea nuevo token
router.post('/token', async function (req, res) {
  const token = req.body.token;
  try {
    if (token == null) return res.sendStatus(401);
    const storedRefreshToken = await Token.findOne({
      where: {
        token: token,
      },
    });
    if (!storedRefreshToken) return res.sendStatus(403);

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      const newToken = generateAccessToken(user.user);
      return res.send({ msg: 'new token created', token: newToken });
    });
  } catch (err) {
    console.log(err);
  }
});
router.delete('/token', async function (req, res) {
  const token = req.body.token;
  try {
    const storedRefreshToken = await Token.findOne({
      where: {
        token: token,
      },
    });
    if (!storedRefreshToken) {
      return res.send({ msg: 'token not found' });
    }
    await Token.destroy({ where: { token: token } });
    return res.send({ msg: 'token deleted' });
  } catch (err) {
    console.log(err);
  }
});
//trae datos de un usuario
router.get('', authToken, async function (req, res) {
  try {
    const rawUser = req.user.user;
    const user = await getUser(rawUser.id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});
//trae datos de todos los usuarios
router.get('/all', async function (req, res) {
  try {
    const user = await getAllUser();
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});
//edita usuario o dirección
router.put('', authToken, async function (req, res) {
  try {
    const user = req.user.user;
    const editedUser = await editUser(req.body, user.id);
    res.send(editedUser);
  } catch (err) {
    console.log(err);
  }
});

router.put('/admin', authToken, async function (req, res) {
  try {
    const user = req.body;
    const editedUser = await editUser(user, user.id);
    res.send(editedUser);
  } catch (err) {
    console.log(err);
  }
});
//borra usuario
router.delete('', authToken, async function (req, res) {
  try {
    const user = req.user.user;
    const deletedUser = await deleteUser(user.id);
    if (deletedUser) {
      return res.send({ msg: 'user deleted' });
    }
    res.send({ error: "couldn't delete user" });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/admin', authToken, async function (req, res) {
  try {
    const id = req.body.id;
    const deletedUser = await deleteUser(id);
    if (deletedUser) {
      return res.send({ msg: 'user deleted' });
    }
    res.send({ error: "couldn't delete user" });
  } catch (err) {
    console.log(err);
  }
});
//trae direcciones de usuario
router.get('/direction', authToken, async function (req, res) {
  try {
    const rawUser = req.user.user;
    const user = await getDirection(rawUser.id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});
//crea dirección para usuario
router.post('/direction', authToken, async function (req, res) {
  try {
    const newDirection = await createAndAddDirection(req.body, req.user.user);
    if (newDirection) {
      return res.send({ msg: 'direction created' });
    }
    res.send({ error: "couldn't create direction" });
  } catch (err) {
    console.log(err);
  }
});
//borra direccion de usuario
router.delete('/direction/:id', authToken, async function (req, res) {
  try {
    const { id } = req.params;
    const deletedDirection = await deleteDirection(id, req.user.user.id);
    if (deletedDirection) {
      return res.send({ msg: 'direction deleted' });
    }
    res.send({ error: "couldn't delete direction" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
