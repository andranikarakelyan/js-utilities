import {DirectedGraphVertice} from "./DirectedGraphVertice";
import {DirectedGraphEdge} from "./DirectedGraphEdge";
import {ObjectWithId} from "./types";


export class DirectedGraph<T extends ObjectWithId> {

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
