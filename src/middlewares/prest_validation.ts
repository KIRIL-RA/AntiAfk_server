import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ButtonActionTypes, PresetDTO } from '../interfaces/preset';
import { keys } from '../configs/config_loader'

export const validatePresetMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Проверяем, что тело запроса не пустое
  if (!req.body) {
    res.status(400).json({ error: 'Request body is required' });
    return;
  }

  const presetInstance = plainToInstance(PresetDTO, req.body); // Преобразуем тело запроса в класс PresetDTO

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

  let buttonErrors: object[] = [];

  // Validate buttons
  presetInstance.buttons.forEach(button => {
    // Check is button button exist
    if (button.type == ButtonActionTypes.press) {
      if (keys[button.action] == undefined) buttonErrors.push(
        {
          name: button.name,
          error: `${button.action} button isn't exist`
        }
      );
    }
  });

  // Check if we found any errors while validate buttons
  if(buttonErrors.length > 0 ){
    res.status(400).json({
      errors: buttonErrors
    });
    return;
  }

  next();
};
