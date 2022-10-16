import type { IJ1939errorFmi, IJ1939errorsFile, IJ1939errorSpn } from '@/components/j1939/components/Files/Shemas/j1939errorsDefault'
import type { JSONSchemaType } from 'ajv'

const errorsSpnShema: JSONSchemaType<IJ1939errorSpn> = {
  $id: 'errSpnItem',
  type: 'object',
  properties: {
    spn: {
      type: 'integer'
    },
    name_en: {
      type: 'string'
    },
    name_ru: {
      type: 'string'
    }
  },
  required: ['spn', 'name_en', 'name_ru']
}

const errorsFmiShema: JSONSchemaType<IJ1939errorFmi> = {
  $id: 'errFmiItem',
  type: 'object',
  properties: {
    fmi: {
      type: 'integer'
    },
    name_en: {
      type: 'string'
    },
    name_ru: {
      type: 'string'
    }
  },
  required: ['fmi', 'name_en', 'name_ru']
}

const j1939errorsFileShema: JSONSchemaType<IJ1939errorsFile> = {
  type: 'object',
  properties: {
    version: {
      type: 'integer'
    },
    description: {
      type: 'string'
    },
    spns: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        $ref: 'errSpnItem'
      }
    },
    fmis: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        $ref: 'errFmiItem'
      }
    }
  },

  required: ['version', 'description', 'spns', 'fmis']
}

export const errorsFileShemas = [j1939errorsFileShema, errorsSpnShema, errorsFmiShema]
