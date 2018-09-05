/**
 * Created by stefania on 5/16/16.
 */

import { ResourceType } from './resource-type';

export interface ResourceTypePage {
    total: number;
    from: number;
    to: number;
    results: ResourceType[];
}