import prisma from './prisma';
import { ButtonActionTypes, ButtonsDTO, PresetDTO, ProcessPresetDto } from '../interfaces/preset'

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
}

/**
 * Get all saved presets
 * @param needExtended If true - will return not only names and is, it will include buttons
 * @returns 
 */
async function GetPresets(needExtended: boolean): Promise<object> {
    const presets = await prisma.preset.findMany();

    // If we don't need extended data
    // we can just return recieved value
    if (!needExtended)
        return presets;
    
    // If we need extended data
    // Search info about each presets
    else {
        let extendedPresets = []
        for(let i = 0; i < presets?.length; i++){
            const presetData = await getPresetById(presets[i].id);
            extendedPresets.push({...presetData, ...presets[i]});
        }

        return extendedPresets;
    }
}



/**
 * Функция для поиска пресета по id
 * @param {string} presetId - ID пресета
 * @returns {Promise<Object|null>} - Пресет с именем и кнопками или null, если пресет не найден
 */
async function getPresetById(presetId: string): Promise<PresetDTO | {}> {
    // Function for getting button action
    // It neede because we need to check if action is valid
    const getButtonAction = (value: string): string => {
        if (Object.values(ButtonActionTypes).includes(value as ButtonActionTypes)) {
            return value;
        }
        return ButtonActionTypes.open;
    }

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

/**
 * Function to delete a preset and all linked buttons
 * @param {string} presetId - ID of the preset to delete
 * @returns {Promise<void>}
 */
async function deletePreset(presetId: string): Promise<void> {
    try {
        // Delete linked buttons first
        await prisma.button.deleteMany({
            where: {
                preset_id: presetId
            }
        });

        // Delete the preset
        await prisma.preset.delete({
            where: {
                id: presetId
            }
        });

        console.log(`Preset with ID ${presetId} and its linked buttons have been deleted.`);
    } catch (error) {
        console.error(`Error deleting preset with ID ${presetId}:`, error);
        throw error;
    }
}

export { CreatePreset, GetPresets, getPresetById, deletePreset };