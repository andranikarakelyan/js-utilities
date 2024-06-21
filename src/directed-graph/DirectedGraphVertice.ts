import {DirectedGraphEdge} from "./DirectedGraphEdge";
import {ObjectWithId} from "./types";


export class DirectedGraphVertice<T extends ObjectWithId> {

  public data?: T | null;
  public edges: DirectedGraphEdge<T>[];

  public constructor(data?: T | null) {
    this.data = data;
    this.edges = [];
  }

  public edgeToOut(endVertice: DirectedGraphVertice<T>): DirectedGraphEdge<T> {
    const edge = new DirectedGraphEdge(this, endVertice);
    this.edges.push(edge);
    endVertice.edges.push(edge);
    return edge;
  }

  public edgeToIn(startVertice: DirectedGraphVertice<T>): DirectedGraphEdge<T> {
    const edge = new DirectedGraphEdge(startVertice, this);
    this.edges.push(edge);
    startVertice.edges.push(edge);
    return edge;
  }

}