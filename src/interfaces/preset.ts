import { IsString, IsEnum, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import 'reflect-metadata';
import { Type } from 'class-transformer';

// Enum для типа кнопки
export enum ButtonActionTypes {
  press = 'press',
  open = 'open',
}

// DTO для кнопок
export class ButtonsDTO {
  @IsString()
  name!: string;

  @IsEnum(ButtonActionTypes, { message: `Type must be one of: ${Object.values(ButtonActionTypes).join(', ')}` })
  type!: ButtonActionTypes;

  @IsString()
  action!: string;

  constructor(){}
}

// DTO для пресета
export class PresetDTO {
  @IsString()
  name!: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Buttons array must have at least one button' })
  @ValidateNested({ each: true })
  @Type(() => ButtonsDTO) // Обязательно для преобразования массива объектов
  buttons!: ButtonsDTO[];
  constructor(){}
}