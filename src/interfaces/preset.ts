enum ButtonActionTypes {
    press = "press",
    open = "open"
}

interface ButtonsDTO{
    name: string;
    type: ButtonActionTypes;
    action: string
}

interface PresetDTO{
    name: string;
    buttons: ButtonsDTO[]
}

export {ButtonActionTypes, ButtonsDTO, PresetDTO};