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

async function GetPresets() {
    const presets =  await prisma.preset.findMany();
    console.log(presets);
}

export {CreatePreset, GetPresets};