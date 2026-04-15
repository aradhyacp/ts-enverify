import { EnverifySchema,InferEnv } from "./types";
import { EnverifyError } from "./errors";

type EnverifyOptions = {
    source? : Record<string, string | undefined>
}

export function enverify<S extends EnverifySchema>(
    schema: S,
    options: EnverifyOptions = {}
): InferEnv<S> {
    const source = options.source ?? process.env
    const failures: string[] = []
    const result: Record<string, unknown> =[]

    for (const key in schema){
        const field = schema[key]
        const raw = source[key]

        if(raw === undefined){
            if('default' in field && field.default !== undefined) {
                result[key] = field.default
                continue
            }
            if (field.required === true){
                failures.push(`${key}: required but not set`)
                continue
            }
            result[key]=undefined
            continue
        }

        switch (field.type) {
            case 'string': {
                result[key] = raw
                break
            }

            case 'number': {
                const parsed = Number(raw)
                if(isNaN(parsed)){
                    failures.push(`${key}: expected a number, got "${raw}"`)
                } else {
                    result[key]=parsed
                }
                break
            }

            case 'boolean': {
                if(raw === true || raw === '1'){
                    result[key]=true
                }else if (raw === false || raw === '0'){
                    result[key]=false
                }else{
                    failures.push(`${key}: expected true/false/1/0, got "${raw}"`)
                }
                break
            }

            case 'enum': {
                if(field.values.includes(raw)){
                    result[key] = raw
                } else {
                    failures.push(
            `${key}: expected one of [${field.values.join(', ')}], got "${raw}"`
          )
                }
                break
            }
        }
    }

    if(failures.length > 0){
        throw new EnverifyError(failures)
    }

    return result as InferEnv<S>
}