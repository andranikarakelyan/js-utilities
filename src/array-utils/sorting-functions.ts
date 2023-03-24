export type ISortingAlgorithm = 'bubble';

export type ISortingPredicate<T> = ( a: T, b: T ) => number;

export function sort<T>( arr: Array<T>, predicate: ISortingPredicate<T>, algorithm: ISortingAlgorithm ): Array<T> {

  switch ( algorithm ) {
    case "bubble":
      bubble_sort_alg( arr, predicate );
      break;
    default:
      throw new Error( `Unknown algorithm "${ algorithm }"` );
  }

  return arr;
}

function bubble_sort_alg<T>( arr: Array<T>, predicate: ISortingPredicate<T> ): Array<T> {
  let is_changed = true;

  while (is_changed) {
    is_changed = false;

    for (let i = 0; i < arr.length - 1; ++i) {

      if (predicate( arr[i], arr[i + 1] ) > 0) {

        const k = arr[i];
        arr[i] = arr[i + 1]
        arr[i + 1] = k;
        is_changed = true;

      }
    }

  }

  return arr;
}


