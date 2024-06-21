import {DirectedGraphEdge} from "./DirectedGraphEdge";


export class DirectedGraphVertex<T> {

  public readonly id: string;
  public data: T | null;
  public edges: DirectedGraphEdge[];

  public constructor(id: string, data: T | null) {
    this.id = id;
    this.data = data;
    this.edges = [];
  }

}