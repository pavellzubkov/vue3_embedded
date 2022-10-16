import type {
  IJ1939DecoderFile,
  IJ1939decoderSpnMapItem,
  IJ1939decoderSpnSwitchVals,
  IJ1939TemplatePgn,
  IJ1939TemplateSpn
} from '@/components/j1939/components/Files/Shemas/decoderData'
import type { JSONSchemaType } from 'ajv'

const decoderSpnSwitchValShema: JSONSchemaType<IJ1939decoderSpnSwitchVals> = {
  $id: 'switchValItem',
  type: 'object',
  properties: {
    key_bit: {
      type: 'string'
    },
    val_en: {
      type: 'string'
    },
    val_ru: {
      type: 'string'
    }
  },
  required: ['key_bit', 'val_en', 'val_ru']
}

const decoderSpnFullItemShema: JSONSchemaType<IJ1939TemplateSpn> = {
  $id: 'spnFullItem',
  type: 'object',
  properties: {
    SPNd: {
      type: 'integer'
    },
    name_en: {
      type: 'string'
    },
    name_ru: {
      type: 'string'
    },
    description_en: {
      type: 'string'
    },
    description_ru: {
      type: 'string'
    },
    length: {
      type: 'integer',
      nullable: true
    },
    data_range: {
      type: 'array',
      items: {
        type: 'number',
        required: []
      },
      minItems: 2,
      maxItems: 2,
      uniqueItems: true
    },
    offset: {
      type: 'number',
      nullable: true
    },
    resolution: {
      type: 'number',
      nullable: true
    },
    lengthIn: {
      type: 'string',
      nullable: true
    },
    unit: {
      type: 'string',
      nullable: true
    },
    PGNref: {
      type: 'integer'
    },
    switchVals: {
      type: 'array',
      nullable: true,
      items: {
        type: 'object',
        required: [],
        $ref: 'switchValItem'
      }
    }
  },
  required: ['SPNd', 'description_en', 'description_ru', 'name_en', 'name_ru']
}

const decoderSpnMapItemShema: JSONSchemaType<IJ1939decoderSpnMapItem> = {
  $id: 'spnMapItem',
  type: 'object',
  properties: {
    SPNd: {
      type: 'integer'
    },
    descr_en: {
      type: 'string'
    },
    startByte: {
      type: 'integer'
    },
    startBit: {
      type: 'integer'
    },
    length: {
      type: 'integer'
    },
    lengthIn: {
      type: 'string'
    }
  },
  required: ['SPNd', 'descr_en', 'startByte', 'startBit', 'length', 'lengthIn'],
  additionalProperties: false
}

const decoderPgnItemShema: JSONSchemaType<IJ1939TemplatePgn> = {
  $id: 'pgnItem',
  type: 'object',
  properties: {
    PGNd: {
      type: 'integer'
    },
    name_en: {
      type: 'string'
    },
    name_ru: {
      type: 'string'
    },
    short: {
      type: 'string'
    },
    descr_en: {
      type: 'string'
    },
    descr_ru: {
      type: 'string'
    },
    dataLength: {
      type: 'string'
    },
    trans_rate: {
      type: 'string'
    },
    spns: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        $ref: 'spnMapItem'
      }
    }
  },
  required: ['PGNd', 'name_en', 'name_ru', 'short', 'descr_en', 'descr_ru', 'dataLength', 'trans_rate', 'spns']
}

const templateFileShema: JSONSchemaType<IJ1939DecoderFile> = {
  type: 'object',
  properties: {
    version: {
      type: 'integer'
    },
    description: {
      type: 'string'
    },
    pgns: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        $ref: 'pgnItem'
      }
    },
    spns: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        $ref: 'spnFullItem'
      }
    }
  },

  required: ['version', 'description', 'pgns', 'spns']
}

export const decoderShemas = [templateFileShema, decoderPgnItemShema, decoderSpnMapItemShema, decoderSpnFullItemShema, decoderSpnSwitchValShema]
