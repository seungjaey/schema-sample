import { resolve } from 'path'
import { readdir } from 'fs/promises'
import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { pipe, map, each, filter, head, toArray, isUndefined } from '@fxts/core'

async function run() {
  const ajv = new Ajv({ strict: true })
  addFormats(ajv)

  // NOTE: Schema File 을 개별적으로 읽습니다.
  const schemaDir = resolve(__dirname, './schema')
  const schemaFileNames = await readdir(schemaDir)

  const schemaEntries = pipe(
    schemaFileNames,
    map(fileName => {
      return [fileName, ajv.compile(require(`${schemaDir}/${fileName}`))]
    }),
    toArray
  )

  // NOTE: 아래는 예시 폴더 안의 파일들을 검사합니다.
  const exampleDir = resolve(__dirname, './examples')
  const exampleFileNames = await readdir(exampleDir)

  pipe(
    exampleFileNames,
    each(fileName => {
      const matchedResult = pipe(
        schemaEntries,
        filter(entries => {
          const [_, validate] = entries
          return (validate as ValidateFunction<unknown>)(require(`${exampleDir}/${fileName}`))
        }),
        head
      )
      if (isUndefined(matchedResult)) {
        console.log(`${fileName} : is In-Valid`)
        return;
      }
      console.log(`${fileName} : is Valid with : ${head(matchedResult)}`)
    })
  )
}

run()
