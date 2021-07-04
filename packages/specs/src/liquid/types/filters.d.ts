import { IDescription, IReferences, IScopes, IArguments } from './common';

export interface IFilter {

  /**
   * Description of the filter
   *
   * @default undefined
   */
  readonly description?: IDescription | string

  /**
   * URL reference to online documentation explaining this filter
   *
   * @default undefined
   */
  readonly references?: IReferences[];

  /**
   * Is the filter tag deprecated?
   *
   * @default false
   */
  readonly deprecated?: boolean;

  /**
   * Supply a snippet to be used in completions
   *
   * @default undefined
   */
  readonly snippet?: string;

  /**
   * When the filter is available within the scope of
   * a specific object and/or tag.
   *
   * @default undefined
   */
  readonly scope?: IScopes

  /**
   * Filter arguments can differ greatly depending on how they are
   * implemented. The spec understands the below filter structures:
   *
   * @example
   *
   * {{ tag | filter: 'hello', param: 'world' }} // comma seperated params
   * {{ tag | filter: 'arg1', 'arg2', }} // comma seperated string
   * {{ tag | filter: argument: 'foo' }} // injected argument params
   *
   * @default undefined
   */
  readonly arguments?: IArguments[];

}

/* REFERENCE ---------------------------------- */

export interface Filters { [name: string]: IFilter; }
