/**
 * Gideon API
 * Documentation Gideon API v1.0
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import {ApplicationAction} from './applicationAction';
import {ApplicationState} from './applicationState';


export interface Session {
  id: string;
  actions: Array<ApplicationAction>;
  states: Array<ApplicationState>;
  expiresIn: number;
}
