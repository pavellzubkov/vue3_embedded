import type { IFileData } from '@/components/j1939/components/Files/Shemas/decoderData'

export interface IJ1939errorSpn {
  spn: number
  name_en: string
  name_ru: string
}

export interface IJ1939errorFmi {
  fmi: number
  name_en: string
  name_ru: string
}

export interface IJ1939errorsFile extends IFileData {
  spns: IJ1939errorSpn[]
  fmis: IJ1939errorFmi[]
}

export const j1939errorsDefault: IJ1939errorsFile = {
  version: 0,
  description: 'Файл описания ошибок J1939. Полный список в соответствующем файле: https://disk.yandex.ru/d/fZs6qkxoPjPyGw',
  spns: [
    {
      spn: 91,
      name_en: 'Accelerator Pedal Position #1',
      name_ru: 'Педали акселератора Положение № 1'
    },
    {
      spn: 102,
      name_en: 'Engine Intake Manifold #1 Pressure',
      name_ru: 'Впускной коллектор двигателя # 1 Давление'
    },
    {
      spn: 105,
      name_en: 'Engine Intake Manifold #1 Temperature',
      name_ru: 'Впускной коллектор двигателя # 1 Температура'
    },
    {
      spn: 110,
      name_en: 'Engine Coolant Temperature',
      name_ru: 'Температура охлаждающей жидкости двигателя'
    },
    {
      spn: 108,
      name_en: 'Barometric Pressure',
      name_ru: 'Барометрическое давление'
    }
  ],
  fmis: [
    {
      fmi: 3,
      name_en: 'Voltage Above Normal',
      name_ru: 'Напряжение выше нормы или короткое замыкание на цепь с более высоким напряжением'
    },
    {
      fmi: 4,
      name_en: 'Voltage Below Normal',
      name_ru: 'Напряжение ниже нормы или короткое замыкание на цепь с более низким напряжением'
    },
    {
      fmi: 5,
      name_en: 'Current Below Normal',
      name_ru: 'Сила тока ниже нормы или цепь разомкнута'
    },
    {
      fmi: 6,
      name_en: 'Current Above Normal',
      name_ru: 'Сила тока выше нормы или цепь замкнута на массу'
    },
    {
      fmi: 8,
      name_en: 'Abnormal Frequency, Pulse Width, or Period',
      name_ru: 'Аномальные частота, ширина импульса или период сигнала'
    }
  ]
}
