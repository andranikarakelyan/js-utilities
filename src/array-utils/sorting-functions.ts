export type ISortingAlgorithm = 'bubble' | 'selection';

export type ISortingPredicate<T> = ( a: T, b: T ) => number;

export function sort<T>( arr: Array<T>, predicate: ISortingPredicate<T>, algorithm: ISortingAlgorithm ): Array<T> {

  switch ( algorithm ) {
    case "bubble":
      bubble_sort_alg( arr, predicate );
      break;
    case "selection":
      selection_sort_alg( arr, predicate );
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

function selection_sort_alg<T>(arr: Array<T>, predicate: ISortingPredicate<T>): Array<T> {

  for (let index_offset = 0; index_offset < arr.length - 1; ++index_offset) {

    let min_value: null | T = null;
    let min_index: null | number = null;

    for (let i = index_offset; i < arr.length; ++i) {

      if (min_value === null || predicate( arr[i], min_value ) < 0) {
        min_value = arr[i];
        min_index = i;
      }

    }

    const k = arr[index_offset];
    arr[index_offset] = arr[min_index as number];
    arr[min_index as number] = k;

  }

  return arr;

}
