type Json = { [key: string | number | symbol]: any }

class Collection extends Map {
    constructor (...map: any[]) {
        super()

        if (map !== undefined) map.forEach(x => this.set(x[0], x[1]))
    }

    static jsonToMap (json: Json): Map<any, any> {
        let jsonToMap: any[][] = []
        
        for (const x in json) {
            jsonToMap.push([ x, json[x] ])
        }

        console.log(...jsonToMap);
        console.log(new Map([ "a", "a" ]));
        

        return new Map(...jsonToMap)
    }

    setJsonToMap (json: Json): this {
        Collection.jsonToMap(json)

        return this
    }

    static mapToJson (map: Map<any, any>) {
        let mapToObject = {}

        for (const [key, value] of map) {
            mapToObject[key] = value
        }

        return mapToObject
    }

    toJson (): Json {
        return Collection.mapToJson(this)
    }
}

let collection = new Collection([ "a", 1 ]);

console.log(collection.setJsonToMap({ "a": "1" }));
