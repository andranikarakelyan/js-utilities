import { MultiSet } from './multiset';

describe('MultiSet', () => {
  it('adds and counts items', () => {
    const ms = new MultiSet<number>();
    ms.add(1);
    ms.add(2, 2);
    expect(ms.count(1)).toBe(1);
    expect(ms.count(2)).toBe(2);
    expect(ms.size()).toBe(3);
    expect(ms.uniqueSize()).toBe(2);
  });

  it('removes items', () => {
    const ms = new MultiSet<string>();
    ms.add('a', 3);
    ms.remove('a');
    expect(ms.count('a')).toBe(2);
    ms.remove('a', 2);
    expect(ms.count('a')).toBe(0);
    expect(ms.has('a')).toBe(false);
  });

  it('toArray and clear', () => {
    const ms = new MultiSet<number>();
    ms.add(5, 2);
    ms.add(6);
    expect(ms.toArray().sort()).toEqual([5, 5, 6]);
    ms.clear();
    expect(ms.size()).toBe(0);
  });


  it('add: zero count does nothing, negative count decreases, removes if <= 0', () => {
    const ms = new MultiSet<number>();
    ms.add(1, 0);
    expect(ms.size()).toBe(0);
    ms.add(2, 5);
    ms.add(2, -2);
    expect(ms.count(2)).toBe(3);
    ms.add(2, -3);
    expect(ms.has(2)).toBe(false);
    ms.add(3, -1);
    expect(ms.has(3)).toBe(false);
  });

  it('remove: zero count does nothing, negative count increases, removes if <= 0', () => {
    const ms = new MultiSet<number>();
    ms.add(1, 2);
    ms.remove(1, 0);
    expect(ms.count(1)).toBe(2);
    ms.remove(1, -3);
    expect(ms.count(1)).toBe(5);
    ms.remove(1, 5);
    expect(ms.has(1)).toBe(false);
    ms.remove(2, 1); // removing non-existent
    expect(ms.has(2)).toBe(false);
  });

  it('removing more than present deletes the item', () => {
    const ms = new MultiSet<number>();
    ms.add(1, 2);
    ms.remove(1, 5);
    expect(ms.has(1)).toBe(false);
    expect(ms.count(1)).toBe(0);
  });

  it('works with objects as keys', () => {
    const obj = { a: 1 };
    const ms = new MultiSet<object>();
    ms.add(obj, 2);
    expect(ms.count(obj)).toBe(2);
    ms.remove(obj);
    expect(ms.count(obj)).toBe(1);
  });

  it('entries() yields correct pairs', () => {
    const ms = new MultiSet<string>();
    ms.add('a', 2);
    ms.add('b');
    const entries = Array.from(ms.entries());
    expect(entries).toContainEqual(['a', 2]);
    expect(entries).toContainEqual(['b', 1]);
    expect(entries.length).toBe(2);
  });

  it('toArray returns correct number of items', () => {
    const ms = new MultiSet<number>();
    ms.add(1, 3);
    ms.add(2, 2);
    const arr = ms.toArray();
    expect(arr.filter(x => x === 1).length).toBe(3);
    expect(arr.filter(x => x === 2).length).toBe(2);
    expect(arr.length).toBe(5);
  });

  it('clear removes all items', () => {
    const ms = new MultiSet<number>();
    ms.add(1, 2);
    ms.add(2, 2);
    ms.clear();
    expect(ms.size()).toBe(0);
    expect(ms.uniqueSize()).toBe(0);
  });
});
