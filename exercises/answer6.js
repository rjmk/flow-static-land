// @flow

import type { Arr } from '../src/Arr'
import * as arr from '../src/Arr'
import * as maybe from '../src/Maybe'
import * as tuple from '../src/Tuple'

export function evens(count: number): Arr<number> {
  return arr.unfoldr(n => {
    if (count <= 0) {
      return maybe.Nothing
    }
    count--
    return maybe.of(tuple.inj([n, n + 2]))
  }, 1)
}

console.log(evens(10)) // => [1, 3, 5, 7, 9, 11, 13, 15, 17, 19]
