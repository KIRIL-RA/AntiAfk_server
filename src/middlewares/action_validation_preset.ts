import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ActionDTO } from '../interfaces/preset';

export const validateActionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверяем, что тело запроса не пустое
  if (!req.body) {
    res.status(400).json({ error: 'Request body is required' });
    return;
  }

  const presetInstance = plainToInstance(ActionDTO, req.body); // Преобразуем тело запроса в класс PresetDTO

  // Проверка, что объект после преобразования не является null или undefined
  if (!presetInstance) {
    res.status(400).json({ error: 'Invalid request data' });
    return;
  }

  const errors = await validate(presetInstance, { whitelist: true });

  if (errors.length > 0) {
    res.status(400).json({
      errors: errors.map((error) => ({
        property: error.property,
        constraints: error.constraints,
      })),
    });
    return;
  }

  next();
};