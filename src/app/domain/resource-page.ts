/**
 * Created by stefania on 5/26/16.
 */
import { Resource } from './resource';

export interface ResourcePage {
    total: number;
    from: number;
    to: number;
    results: Resource[];
}
