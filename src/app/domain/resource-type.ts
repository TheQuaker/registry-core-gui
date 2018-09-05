/**
 * Created by stefania on 4/11/16.
 */

import {IndexFields} from './index-fields';

export interface ResourceType {
    name: string;
    schema: string;
    schemaUrl: string;
    payloadType: string;
    creationDate: Date;
    modificationDate: Date;
    indexMapperClass: String;
    indexFields: IndexFields[];
    // state: boolean;  // can it be done with out this?
}
