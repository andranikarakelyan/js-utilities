//FIXME: This test should be improved
import {sort} from "./sorting-functions";

describe('sort: Sorts array', () => {

  const start_arr = [ 3, 4, 1, 5, -1 ];
  const expected_arr = [ -1, 1, 3, 4, 5 ];

  it( 'bubble sort', () => {
    const arr = sort( start_arr.slice(), ( a, b ) => a - b, 'bubble' );
    expect(arr).toEqual(expected_arr);
  } );
  it( 'selection sort', () => {
    const arr = sort( start_arr.slice(), ( a, b ) => a - b, 'selection' );
    expect(arr).toEqual(expected_arr);
  } );

});
