type Json = { [key: string | number | symbol]: any }

class Collection<K, V> extends Map<K, V> {
    constructor (...map: any[]) {
        super()

        if (map !== undefined) map.forEach(x => this.set(x[0], x[1]))
    }

    static jsonToMap (json: Json): Map<any, any> {
        let jsonToMap = new Map()
        
        for (const x in json) {
            jsonToMap.set(x, json[x])
        }
        
        return jsonToMap
    }

    public setJsonToMap (json: Json): this {
        let map = Collection.jsonToMap(json)

        for (const x of map) {
            this.set(...x)
        }

        return this
    }

    static mapToJson (map: Map<any, any>) {
        let mapToObject = {}

        for (const [key, value] of map) {
            mapToObject[key] = value
        }

        return mapToObject
    }

    public toJson (): Json {
        return Collection.mapToJson(this)
    }
}

export default Collection;
