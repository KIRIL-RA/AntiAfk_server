import { IsString, IsEnum, ValidateNested, IsArray, ArrayMinSize, IsNumber } from 'class-validator';
import 'reflect-metadata';
import { Type } from 'class-transformer';

// Enum для типа кнопки
export enum ButtonActionTypes {
  press = 'press',
  open = 'open',
  start = 'start',
  stop = 'stop'
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

// DTO для выполнения действия
export class ActionDTO{
  @IsString()
  presetId!: string;

  @IsString()
  buttonName!:string;

  @IsArray()
  @ArrayMinSize(1, { message: 'It must be at least one client in clients array' })
  @IsString({ each: true })
  @Type(() => String) // Обязательно для преобразования массива объектов
  emitClients!: string[]
}

export class SendButtonClickDTO{
  @IsNumber()
  repeatsCount!: number;

  @IsString()
  action!:string;

  @IsArray()
  @ArrayMinSize(1, { message: 'It must be at least one client in clients array' })
  @IsString({ each: true })
  @Type(() => String) // Обязательно для преобразования массива объектов
  emitClients!: string[]
}

export class ProcessPresetDto{
  @IsString()
  name!: string;

  @IsString()
  path!: string;
}