/**
 * Created by stefania on 4/11/16.
 */
export class ResourceTypeData {
  createDb() {
    const resourceTypePage = {
      'total': 1,
      'from': 0,
      'to': 1,
      'results': [
        {
          'id': '18',
          'name': 'Person',
          'schema': 'Schema for resource type Person',
          'schemaUrl': 'http://www.bla.com',
          'payloadType': 'json',
          'creationDate': 'today',
          'modificationDate': 'today'
        }
      ]
    };
    return {resourceTypePage};
  }
}

