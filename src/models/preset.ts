import { Prisma, PrismaClient } from '@prisma/client';
import { ButtonActionTypes, PresetDTO } from '../interfaces/preset'
const prisma = new PrismaClient();

/**
 * Create new preset, and save it into database
 * @param preset 
 */
async function CreatePreset(preset: PresetDTO) {
    // Save preset in database
    const newPreset = await prisma.preset.create({
        data: {
            name: preset.name,
            buttons: {
                create: preset.buttons
            }
        },
        include: {
            buttons: true, // Включить кнопки в результат
        },
    });

    console.log(newPreset);
    GetPresets();
}

async function GetPresets(): Promise<object> {
    const presets =  await prisma.preset.findMany();
    return presets;
}

/**
 * Функция для поиска пресета по id
 * @param {string} presetId - ID пресета
 * @returns {Promise<Object|null>} - Пресет с именем и кнопками или null, если пресет не найден
 */
async function getPresetById(presetId: string): Promise<PresetDTO | {}> {
    // Function for getting button action
    const getButtonAction = function (type:String): ButtonActionTypes{
        switch(type){
            case ButtonActionTypes.open:
                return ButtonActionTypes.open;
            case ButtonActionTypes.press:
                return ButtonActionTypes.press;
            default:
                return ButtonActionTypes.press;
        }
    };

    try {
      // Поиск пресета с вложенными кнопками
      const preset = await prisma.preset.findUnique({
        where: {
          id: presetId,
        },
        include: {
          buttons: true, // Включаем кнопки в результат
        },
      });
  
      if (!preset) {
        console.log(`Пресет с ID ${presetId} не найден.`);
        return {};
      }
  
      // Возвращаем имя пресета и его кнопки
      return {
        name: preset.name,
        buttons: preset.buttons.map((button) => ({
          id: button.id,
          name: button.name,
          type: getButtonAction(button.type),
          action: button.action,
        })),
      };
    } catch (e) {
      console.error('Ошибка при поиске пресета:', e);
      throw e;
    } 
  }
  

export {CreatePreset, GetPresets, getPresetById};