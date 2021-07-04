import { IDescription, IReferences, IScopes } from './common';

/* OBJECT TYPEOF ------------------------------ */

export type ObjectTypes =
  | 'object'
  | 'string'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'variable';

/* OBJECT SPECIFICATION ----------------------- */

interface ObjectProperties {
  /**
   * Description of thes property value used by this object
   */
  readonly description?: IDescription | string;
  /**
   * The Typeof object value
   */
  readonly type: ObjectTypes;
  /**
   * Documentation References
   */
  readonly references?: IReferences[];
  /**
   * Property value contains additional properties, eg: `{{ object.prop1.prop2 }}`
   */
  readonly properties?: {
    [name: string]: ObjectProperties;
  };
}

export interface IObject {

  /**
   * The automatically applied tag type, which is "object"
   */
  readonly type?: ObjectTypes;

  /**
   * Description of this object
   *
   */
  readonly description?: IDescription | string;

  /**
   * A URL reference to the documentation pertaining to this tag
   *
   * @default undefined
   */
  readonly link?: string;

  /**
   * Object tags will always be singular tags, enforces `true`
   *
   * @default true
   */
  readonly singular?: true;

  /**
   * Does this tag accept filters
   *
   * @default true
   */
  readonly filters?: boolean;

  /**
   * Does this tag accept whitespace trim dashes?
   *
   * @default true
   */
  readonly trims?: boolean;

  /**
   * The object is a global accessible object
   *
   * @default false
   */
  readonly global?: boolean;

  /**
   * Whether or not this object is a content or constant value
   *
   * @default false
   */
  readonly const?: boolean;

  /**
   * Is this object tag deprecated?
   *
   * @default false
   */
  readonly deprecated?: boolean;

  /**
   * Object is only accessible within tag based scope.
   *
   * @default []
   */
  readonly scope?: IScopes;

  /**
   * List of property values this tag object supports, recursively
   * supply properties for deep nested objects.
   */
  readonly properties?: {
    [name: string]: ObjectProperties;
  };
}

/* REFERENCE ---------------------------------- */

export interface Objects {
  [name: string]: IObject;
}
