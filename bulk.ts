import { resolve } from 'path'
import { readdir } from 'fs/promises'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import { pipe, each } from '@fxts/core'
import type { JSONSchema7 } from 'json-schema'

type KurlySchema = JSONSchema7 &
  Required<Pick<JSONSchema7, "$id" | "oneOf" | "definitions">>;

async function mergeSchemes(): Promise<KurlySchema> {
  const mergedSchema: KurlySchema = {
    $id: 'kurly',
    $schema: "http://json-schema.org/draft-07/schema#",
    definitions: {},
    oneOf: []
  }
  const schemaDir = resolve(__dirname, './schema')
  const schemaFileNames = await readdir(schemaDir)
  pipe(
    schemaFileNames,
    each(fileName => {
      const schema = require(`${schemaDir}/${fileName}`)
      const schemaId = schema.$id
      mergedSchema.definitions = {
        ...mergedSchema.definitions,
        ...schema.definitions,
        [schemaId]: schema,
      }
      mergedSchema.oneOf.push({ $ref: `#/definitions/${schemaId}` })
    })
  )
  return mergedSchema
}

async function run() {
  const ajv = new Ajv({ strict: true })
  addFormats(ajv)

  /*
    NOTE: 이 함수가 중요하옵니다.
    schema Dir 의 모든 schema 들 하나로 합칩니다.
   */
  const mergedSchema = await mergeSchemes();

  const validate = ajv.compile(mergedSchema)

  // NOTE: 아래는 예시 폴더 안의 파일들을 검사합니다.
  const exampleDir = resolve(__dirname, './examples')
  const exampleFileNames = await readdir(exampleDir)

  pipe(
    exampleFileNames,
    each(fileName => {
      const isValid = validate(require(`${exampleDir}/${fileName}`))
      console.group()
      console.log(`${fileName} : is ${isValid ? 'Valid' : 'In-Valid'}`)
      /* NOTE: Detail Logging
      if (!isValid && validate.errors) {
        pipe(
          validate.errors,
          each(error => {
            const { message } = error
            console.warn(`${fileName} : ${message}`)
          })
        )
      }
      */
      console.groupEnd()
    })
  )
}

run()

/*
  NOTE:
    잘 되는 것 처럼 보입니다만 하나의 문제가 있습니다.
    validate 함수는 boolean 만 return 하기 때문에 검증된 파일이 어떤 Schema 인지 모릅니다.
    (single 파일에서 처럼 개별벅으로 검사하지 않는 이상 가져올 수 있는 방법이 없는것 같아용ㅠ)
 */