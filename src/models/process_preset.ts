import prisma from './prisma';
import { ButtonActionTypes, ButtonsDTO, PresetDTO, ProcessPresetDto } from '../interfaces/preset'

/**
 * Create new proces preset, and save it into database
 * @param preset 
 */
export async function CreateProcessPreset(preset: ProcessPresetDto) {

    // Creating buttons for preset
    // It will be only two buttons: Start and Stop
    let buttons = [
        {
            name: 'Start',
            type: ButtonActionTypes.start,
            action: preset.path
        },
        {
            name: 'Stop',
            type: ButtonActionTypes.stop,
            action: preset.path
        }
    ]

    // Save preset in database
    const newPreset = await prisma.preset.create({
        data: {
            name: preset.name,
            buttons: {
                create: buttons
            }
        },
        include: {
            buttons: true, // Включить кнопки в результат
        },
    });

}
