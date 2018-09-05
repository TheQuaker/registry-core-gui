/**
 * Created by stefania on 4/11/16.
 */
"use strict";
var ResourceTypeData = (function () {
    function ResourceTypeData() {
    }
    ResourceTypeData.prototype.createDb = function () {
        var resourceTypePage = { "total": 1, "from": 0, "to": 1, "results": [{ "id": "18", "name": "Person", "schema": "Schema for resource type Person", "schemaUrl": "http://www.bla.com", "payloadType": "json", "creationDate": "today", "modificationDate": "today" }] };
        return { resourceTypePage: resourceTypePage };
    };
    return ResourceTypeData;
}());
exports.ResourceTypeData = ResourceTypeData;
//# sourceMappingURL=resource-types-data.js.map