import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import { config } from '../../../../config/config';
import { requireAuth, UdagramJWT } from '@drewkimberly/udagram-auth';

const router: Router = Router();
const jwt = new UdagramJWT(config.jwt.secret);
const SALT_ROUNDS = 10;

async function generatePassword(plainTextPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(plainTextPassword, salt);
}

async function comparePasswords(
  plainTextPassword: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hash);
}

router.get(
  '/verification',
  requireAuth(jwt),
  async (req: Request, res: Response) => {
    return res.status(200).send({ auth: true, message: 'Authenticated.' });
  }
);

router.post('/login', async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  // check email is valid
  if (!email || !EmailValidator.validate(email)) {
    return res
      .status(400)
      .send({ auth: false, message: 'Email is required or malformed' });
  }

  // check email password valid
  if (!password) {
    return res
      .status(400)
      .send({ auth: false, message: 'Password is required' });
  }

  const user = await User.findByPk(email);
  // check that user exists
  if (!user) {
    return res.status(401).send({ auth: false, message: 'Unauthorized' });
  }

  // check that the password matches
  const authValid = await comparePasswords(password, user.password_hash);

  if (!authValid) {
    return res.status(401).send({ auth: false, message: 'Unauthorized' });
  }

  res.status(200).send({
    auth: true,
    token: jwt.generateToken(user.short()),
    user: user.short()
  });
});

// register a new user
router.post('/', async (req: Request, res: Response) => {
  const email = req.body.email;
  const plainTextPassword = req.body.password;
  // check email is valid
  if (!email || !EmailValidator.validate(email)) {
    return res
      .status(400)
      .send({ auth: false, message: 'Email is required or malformed' });
  }

  // check email password valid
  if (!plainTextPassword) {
    return res
      .status(400)
      .send({ auth: false, message: 'Password is required' });
  }

  // find the user
  const user = await User.findByPk(email);
  // check that user doesnt exists
  if (user) {
    return res
      .status(422)
      .send({ auth: false, message: 'User may already exist' });
  }

  const password_hash = await generatePassword(plainTextPassword);

  const newUser = await new User({
    email: email,
    password_hash: password_hash
  });

  const savedUser = await newUser.save();

  res.status(201).send({
    token: jwt.generateToken(savedUser.short()),
    user: savedUser.short()
  });
});

router.get('/', async (req: Request, res: Response) => {
  res.send('auth');
});

export const AuthRouter: Router = router;
