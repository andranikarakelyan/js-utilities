//FIXME: This test should be improved
import {sort} from "./sorting-functions";

test('sort: Sorts array', () => {

  const arr = [ 3, 4, 1, 5, -1 ];
  const expected_arr = [ -1, 1, 3, 4, 5 ];

  sort( arr, ( a, b ) => a - b, 'bubble' );

  expect(arr).toEqual(expected_arr);
});
