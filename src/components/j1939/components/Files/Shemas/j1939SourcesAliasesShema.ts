import type { IJ1939SourcesAliasFile, IJ1939SourcesItem } from '@/components/j1939/components/Files/Shemas/decoderData'
import type { JSONSchemaType } from 'ajv'

const aliasesItemShema: JSONSchemaType<IJ1939SourcesItem> = {
  $id: 'aliasesItem',
  type: 'object',
  properties: {
    srcAdr: {
      type: 'integer'
    },
    alias: {
      type: 'string'
    }
  },
  required: ['srcAdr', 'alias']
}

const srsAliasesFileShema: JSONSchemaType<IJ1939SourcesAliasFile> = {
  type: 'object',
  properties: {
    version: {
      type: 'integer'
    },
    description: {
      type: 'string'
    },
    aliaces: {
      type: 'array',
      items: {
        type: 'object',
        required: [],
        $ref: 'aliasesItem'
      }
    }
  },

  required: ['version', 'description', 'aliaces']
}

export const aliacesShemas = [srsAliasesFileShema, aliasesItemShema]
