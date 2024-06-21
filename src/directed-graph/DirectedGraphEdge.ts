import {DirectedGraphVertice} from "./DirectedGraphVertice";
import {ObjectWithId} from "./types";


export class DirectedGraphEdge<T extends ObjectWithId> {

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
