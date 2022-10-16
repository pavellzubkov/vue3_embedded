import type { IJ1939DecoderFile } from '@/components/j1939/components/Files/Shemas/decoderData'

export const decoderDefault: IJ1939DecoderFile = {
  version: 0,
  description:
    'Файл для декодирования сообщений J1939.(базовый). Для полной спецификации загрузите соответствующий файл: https://disk.yandex.ru/d/SMq2eWocxA5MHQ ',
  pgns: [
    {
      PGNd: 61444,
      name_en: 'Electronic Engine Controller 1',
      name_ru: 'Электронный контроллер двигателя 1',
      short: 'EEC1',
      descr_en:
        'Engine related parameters Extended Data Page: 0 Data Page: 0 PDU Format: 240 PDU Specific: 4 PGN Supporting Information: Default Priority: 3 Parameter Group Number: 61444 (0x00F004)',
      descr_ru:
        'Связанные с двигателем параметры Расширенная страница данных: 0 Страница данных: 0 Формат PDU: 240 Специфика PDU: 4 PGN Вспомогательная информация: Приоритет по умолчанию: 3 Номер группы параметров: 61444 (0x00F004)',
      dataLength: '8',
      trans_rate: 'engine speed dependent',
      spns: [
        {
          SPNd: 513,
          descr_en: 'Actual Engine - Percent Torque',
          startByte: 3,
          startBit: 1,
          length: 1,
          lengthIn: 'bytes'
        },
        {
          SPNd: 190,
          descr_en: 'Engine Speed',
          startByte: 4,
          startBit: 1,
          length: 2,
          lengthIn: 'bytes'
        },
        {
          SPNd: 1675,
          descr_en: 'Engine Starter Mode',
          startByte: 7,
          startBit: 1,
          length: 4,
          lengthIn: 'bits'
        }
      ]
    },
    {
      PGNd: 65262,
      name_en: 'Engine Temperature 1',
      name_ru: 'Температура двигателя 1',
      short: 'ET1',
      descr_en:
        'Extended Data Page: 0 Data Page: 0 PDU Format: 254 PDU Specific: 238 PGN Supporting Information: Default Priority: 6 Parameter Group Number: 65262 (0x00FEEE)',
      descr_ru:
        'Расширенная страница данных: 0 Страница данных: 0 Формат PDU: 254 Специфика PDU: 238 PGN Вспомогательная информация: Приоритет по умолчанию: 6 Номер группы параметров: 65262 (0x00FEEE)',
      dataLength: '8',
      trans_rate: '1 s',
      spns: [
        {
          SPNd: 110,
          descr_en: 'Engine Coolant Temperature',
          startByte: 1,
          startBit: 1,
          length: 1,
          lengthIn: 'bytes'
        }
      ]
    },
    {
      PGNd: 61452,
      name_en: 'Electronic Transmission',
      name_ru: 'Электронный контроллер передачи #8',
      short: 'Controller',
      descr_en:
        'Electronic Transmission Controller #8 Extended Data Page: 0 Data Page: 0 PDU Format: 240 PDU Specific: 12 PGN Supporting Information: Default Priority: 3 Parameter Group Number: 61452 (0x00F00C)',
      descr_ru:
        'Электронный контроллер передачи # 8 Расширенная страница данных: 0 Страница данных: 0 Формат PDU: 240 Специфика PDU: 12 PGN Вспомогательная информация: Приоритет по умолчанию: 3 Номер группы параметров: 61452 (0x00F00C)',
      dataLength: '8',
      trans_rate: '20 ms when torque converter unlocked, 100 ms when torque converter locked',
      spns: [
        {
          SPNd: 3030,
          descr_en: 'Transmission Torque Converter Ratio',
          startByte: 1,
          startBit: 1,
          length: 2,
          lengthIn: 'bytes'
        },
        {
          SPNd: 5052,
          descr_en: 'Transmission Clutch/Converter Input Speed',
          startByte: 3,
          startBit: 1,
          length: 2,
          lengthIn: 'bytes'
        }
      ]
    },
    {
      PGNd: 65247,
      name_en: 'Electronic Engine Controller 3',
      name_ru: 'Электронный контроллер двигателя 3',
      short: 'EEC3',
      descr_en:
        'Extended Data Page: 0 Data Page: 0 PDU Format: 254 PDU Specific: 223 PGN Supporting Information: Default Priority: 6 Parameter Group Number: 65247 (0x00FEDF)',
      descr_ru:
        'Расширенная страница данных: 0 Страница данных: 0 Формат PDU: 254 Специфика PDU: 223 PGN Вспомогательная информация: Приоритет по умолчанию: 6 Номер группы параметров: 65247 (0x00FEDF)',
      dataLength: '8',
      trans_rate: '250 msec (preferred) or Engine Speed Dependent (if required by nonlayoutviews)',
      spns: [
        {
          SPNd: 515,
          descr_en: "Engine's Desired Operating Speed",
          startByte: 2,
          startBit: 1,
          length: 2,
          lengthIn: 'bytes'
        }
      ]
    }
  ],
  spns: [
    {
      SPNd: 190,
      name_en: 'Engine Speed',
      name_ru: 'Частота вращения двигателя',
      description_en: 'Actual engine speed which is calculated over a minimum crankshaft angle of 720 degrees divided by the number ofcylinders.',
      description_ru:
        'Фактическая частота вращения двигателя, рассчитанная при минимальном угле поворота коленчатого вала 720 градусов, деленная на количество цилиндров.',
      resolution: 0.125,
      unit: 'rpm',
      offset: 0,
      length: 2,
      lengthIn: 'bytes',
      PGNref: 61444,
      switchVals: [],
      data_range: [0, 8031.875]
    },
    {
      SPNd: 513,
      name_en: 'Actual Engine - Percent Torque',
      name_ru: 'Фактический крутящий момент двигателя в процентах',
      description_en:
        'The calculated output torque of the engine. The data is transmitted in indicated torque as a percent of reference enginetorque (see the engine configuration message, PGN 65251). The engine percent torque value will not be less than zeroand it includes the torque developed in the cylinders required to overcome friction.',
      description_ru:
        'Расчетный выходной крутящий момент двигателя. Данные передаются в указанном крутящем моменте в процентах от эталонного крутящего момента двигателя (см. Сообщение о конфигурации двигателя, PGN 65251). Значение крутящего момента двигателя в процентах не будет меньше нуля, и оно включает крутящий момент, развиваемый в цилиндрах, необходимый для преодоления трения.',
      resolution: 1,
      unit: '%',
      offset: -125,
      length: 1,
      lengthIn: 'bytes',
      PGNref: 61444,
      switchVals: [],
      data_range: [-125, 125]
    },
    {
      SPNd: 515,
      name_en: "Engine's Desired Operating Speed",
      name_ru: 'Желаемая рабочая частота вращения двигателя',
      description_en:
        'An indication by the engine of the optimal operating speed of the engine for the current existing conditions. Theseconditions may include the torque generated to accommodate powertrain demands from the operator (via the acceleratorpedal), cruise control, road speed limit governors, or ASR. Dynamic commands from functions such as smoke control orshift control are excluded from this calculation.',
      description_ru:
        'Индикация двигателем оптимальной рабочей частоты вращения двигателя для текущих существующих условий. Эти условия могут включать крутящий момент, создаваемый для удовлетворения требований оператора к трансмиссии (через педаль акселератора), круиз-контроль, регуляторы ограничения скорости на дороге или ASR. Динамические команды из таких функций, как управление задымлением или переключением передач, исключаются из этого расчета.',
      resolution: 0.125,
      unit: 'rpm',
      offset: 0,
      length: 2,
      lengthIn: 'bytes',
      PGNref: 65247,
      switchVals: [],
      data_range: [0, 8031.875]
    },
    {
      SPNd: 110,
      name_en: 'Engine Coolant Temperature',
      name_ru: 'Температура охлаждающей жидкости двигателя',
      description_en: 'Temperature of liquid found in engine cooling system.',
      description_ru: 'Температура жидкости, обнаруженной в системе охлаждения двигателя.',
      resolution: 1,
      unit: 'C',
      offset: -40,
      length: 1,
      lengthIn: 'bytes',
      PGNref: 65262,
      switchVals: [],
      data_range: [-40, 210]
    },
    {
      SPNd: 1675,
      name_en: 'Engine Starter Mode',
      name_ru: 'Режим запуска двигателя',
      description_en: 'There are several phases in a starting action and different reasons why a start cannot take place.1001-1011 Reserved',
      description_ru: 'В стартовом действии есть несколько этапов и разные причины, по которым старт не может состояться.1001-1011 Зарезервировано',
      length: 4,
      lengthIn: 'bits',
      PGNref: 61444,
      switchVals: [
        {
          key_bit: '0000',
          val_en: 'start not requested',
          val_ru: 'запуск не запрашивается'
        },
        {
          key_bit: '0001',
          val_en: 'starter active, gear not engaged',
          val_ru: 'стартер включен, передача не включена'
        },
        {
          key_bit: '0010',
          val_en: 'starter active, gear engaged',
          val_ru: 'стартер включен, передача включена'
        },
        {
          key_bit: '0011',
          val_en: 'start finished',
          val_ru: 'начало завершено'
        },
        {
          key_bit: '0100',
          val_en: 'starter inhibited due to engine already running',
          val_ru: 'стартер заблокирован из-за уже работающего двигателя'
        },
        {
          key_bit: '0101',
          val_en: 'starter inhibited due to engine not ready for start (preheating)',
          val_ru: 'стартер заблокирован из-за того, что двигатель не готов к запуску (предварительный прогрев)'
        },
        {
          key_bit: '0110',
          val_en: 'starter inhibited due to driveline engaged or other transmission inhibit',
          val_ru: 'стартер заблокирован из-за включения трансмиссии или другого торможения трансмиссии'
        },
        {
          key_bit: '0111',
          val_en: 'starter inhibited due to active immobilizer',
          val_ru: 'стартер заблокирован из-за активного иммобилайзера'
        },
        {
          key_bit: '1000',
          val_en: 'starter inhibited due to starter over-temp',
          val_ru: 'заклинивание стартера из-за перегрева стартера'
        },
        {
          key_bit: '1100',
          val_en: 'starter inhibited - reason unknown',
          val_ru: 'стартер заблокирован - причина неизвестна'
        },
        {
          key_bit: '1101',
          val_en: 'error (legacy implementation only, use 1110)',
          val_ru: 'ошибка (только устаревшая реализация, используйте 1110)'
        },
        {
          key_bit: '1110',
          val_en: 'error',
          val_ru: 'ошибка'
        },
        {
          key_bit: '1111',
          val_en: 'Not Available',
          val_ru: 'недоступно'
        }
      ],
      data_range: [0, 15]
    },
    {
      SPNd: 3030,
      name_en: 'Transmission Torque Converter Ratio',
      name_ru: 'Коэффициент гидротрансформатора трансмиссии',
      description_en:
        'Ratio of the transmissions torque converter output torque to torque converter input torque at current speed.The ratio of 1.000 ( 03 E8 hex ) indicates torque converter lockup.If the ratio is less than 1 and the ratio can not be properly determined it shall be set to a value of FB00 hex.Ratios above 1 indicate torque converter multiplication.',
      description_ru:
        'Отношение выходного крутящего момента гидротрансформатора трансмиссии к входному крутящему моменту гидротрансформатора при текущей частоте вращения.Передаточное отношение 1.000 (03 E8 hex) указывает на блокировку гидротрансформатора.Если передаточное число меньше 1 и его невозможно правильно определить, то оно должно быть установлено на значение FB00 hex. Передаточные числа выше 1 указывают на умножение гидротрансформатора.',
      resolution: 0.001,
      unit: '',
      offset: 0,
      length: 2,
      lengthIn: 'bytes',
      PGNref: 61452,
      switchVals: [],
      data_range: [0, 64.255]
    }
  ]
}
