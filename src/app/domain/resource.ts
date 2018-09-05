/**
 * Created by stefania on 5/26/16.
 */

import { IndexedFields } from './indexed-fields';
import { ResourceType } from './resource-type';

export interface Resource {
    id: string;
    resourceType: ResourceType;
    version: string;
    payload: string;
    payloadUrl: string;
    payloadFormat: string;
    creationDate: Date;
    modificationDate: Date;
    indexedFields: IndexedFields[]; // not in the returned data
}
