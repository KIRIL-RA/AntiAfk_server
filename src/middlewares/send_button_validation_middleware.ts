import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SendButtonClickDTO } from '../interfaces/preset';
import { keys } from '../configs/config_loader'

export const validateSendButton = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверяем, что тело запроса не пустое
  if (!req.body) {
    res.status(400).json({ error: 'Request body is required' });
    return;
  }

  const sendButtonInstance = plainToInstance(SendButtonClickDTO, req.body); // Преобразуем тело запроса в класс PresetDTO

  // Проверка, что объект после преобразования не является null или undefined
  if (!sendButtonInstance) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  const errors = await validate(sendButtonInstance, { whitelist: true });

  if (errors.length > 0) {
    res.status(400).json({
      errors: errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      })),
    });
    return;
  }

  if (keys[sendButtonInstance.action] == undefined) {
    res.status(400).json({
        errors: ["Key not founded"]
    });
    return;
  }

  next();
};