import { IsString, IsEnum, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import 'reflect-metadata';
import { Type } from 'class-transformer';

// DTO для клиентов
export class ClientDTO {
  @IsString()
  name!: string;

  @IsString()
  ip!: string;

  constructor(){}
}