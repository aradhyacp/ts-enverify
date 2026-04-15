export type StringField = {
    type: 'string'
    required?: true
    default?: string
    description?: string
}

export type NumberField = {
    type: 'number'
    required?: true
    default?: string
    description?: string
}

export type BooleanField = {
    type: 'boolean'
    required?: true
    default?: boolean
    description?: string
}

export type EnumField = {
    type: 'enum'
    values: readonly string[]
    required?: true
    default?: string
    description?: string
}

export type FieldSchema = StringField | NumberField | BooleanField | EnumField

export type EnverifySchema = Record<string, FieldSchema>

type InferFieldType<T extends FieldSchema> =
T extends {type:'string'} ? string :
T extends {type:'number'}? number :
T extends {type:'boolean'} ? boolean :
T extends {type:'enum';values: infer V extends readonly string[]}? V[number] : never

type InferField<T extends FieldSchema> = 
T extends {required:true}? InferFieldType<T> :
T extends {default: unknown}? InferFieldType<T> :
InferFieldType<T> | undefined

export type InferEnv<S extends EnverifySchema> = {
    [K in keyof S]: InferField<S[K]>
}
