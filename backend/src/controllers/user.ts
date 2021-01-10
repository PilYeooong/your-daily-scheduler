import { NextFunction, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import User from '../entity/User';
import Schedule from '../entity/Schedule';
import { signJWT } from './jwt';
import { IDecoded } from '../interfaces';



export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.decoded) {
    try {
      const { id } = req.decoded as IDecoded;
      const user = await getRepository(User).findOne({
        where: { id },
      });
      if (!user) {
        return res.status(400).send('존재하지 않는 유저입니다.');
      }
      return res.status(200).send(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
};

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const userRepository = getRepository(User);
  const scheduleRepository = getRepository(Schedule);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await userRepository.create({
      email,
      password: hashedPassword,
    });
    await userRepository.save(user);
    await scheduleRepository.save(scheduleRepository.create({ user }));
    return res.status(200).send(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await getRepository(User).findOne(
      { email },
      { select: ['id', 'email', 'password'] }
    );
    if (!user) {
      return res.status(400).send('존재하지 않는 사용자입니다.');
    }

    console.log(user);
    const isPasswordMatched = await user.checkPassword(password);

    if (!isPasswordMatched) {
      return res.status(400).send('비밀번호가 일치하지 않습니다.');
    }

    const token = signJWT(user.id);
    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    next(err);
  }
};
