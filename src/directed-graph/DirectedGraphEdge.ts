import {DirectedGraphVertice} from "./DirectedGraphVertice";

export class DirectedGraphEdge<T> {

  public startVertice: DirectedGraphVertice<T> | null;
  public endVertice: DirectedGraphVertice<T> | null;

  public constructor(
    startVertice: DirectedGraphVertice<T> | null,
    endVertice: DirectedGraphVertice<T> | null
  ) {
    this.startVertice = startVertice;
    this.endVertice = endVertice;
  }

}
