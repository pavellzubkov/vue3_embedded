import type { IJ1939SourcesAliasFile } from '@/components/j1939/components/Files/Shemas/decoderData'

export const aliasesDefault: IJ1939SourcesAliasFile = {
  version: 0,
  description: 'Названия блоков передающих сообщения на шину. Содержит информацию: адрес источника - название.(по умолчанию)',
  aliaces: [
    {
      srcAdr: 0,
      alias: 'ДВС'
    },
    {
      srcAdr: 3,
      alias: 'АКПП'
    }
  ]
}
