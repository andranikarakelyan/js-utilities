import {DirectedGraphVertice} from "./DirectedGraphVertice";
import {DirectedGraphEdge} from "./DirectedGraphEdge";

export class DirectedGraph<T> {

  public vertices: DirectedGraphVertice<T>[];
  public edges: DirectedGraphEdge<T>[];

  public constructor(
    vertices?: DirectedGraphVertice<T>[],
    edges?: DirectedGraphEdge<T>[]
  ) {
    this.vertices = vertices || [];
    this.edges = edges || [];
  }

}
