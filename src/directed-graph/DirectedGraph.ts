import {DirectedGraphVertex} from "./DirectedGraphVertex";
import {DirectedGraphEdge} from "./DirectedGraphEdge";


export class DirectedGraph<T> {

  private readonly vertices: DirectedGraphVertex<T>[];
  private readonly edges: DirectedGraphEdge[];

  public constructor(
    vertices?: DirectedGraphVertex<T>[],
    edges?: DirectedGraphEdge[]
  ) {
    this.vertices = vertices || [];
    this.edges = edges || [];
    this.check();
  }

  /**
   * Checks, is graph have valid data or not
   * @private
   */
  private check() {
    const idSet = new Set(this.vertices.map(v => v.id));
    if (idSet.size !== this.vertices.length)
      throw new Error(`Some vertices have duplicate IDs`);

    this.edges.forEach(e => {

      if (e.startVertexId === e.endVertexId)
        throw new Error(`Some edges are cyclic`);

      // Will throw error, when there are no vertices with such ID
      this.getVertexById(e.startVertexId);
      this.getVertexById(e.endVertexId);

    });

  }

  public getVertexById(id: string): DirectedGraphVertex<T> {
    const v = this.vertices.find(v => v.id === id);
    if (!v) throw new Error(`Vertex with id"${id}" not found`);
    return v;
  }

  /**
   * Returns list of vertices graph, which don't have edges
   */
  public findFreeVertices(): DirectedGraphVertex<T>[] {
    return this.vertices.filter(v => v.edges.length === 0);
  }

  /**
   * Returns list of vertices graph, which don't have "in-edges"
   */
  public findStartVertices(): DirectedGraphVertex<T>[] {
    return this.vertices
      .filter(v => v.edges.length !== 0 && !v.edges
        .some(e => e.endVertexId === v.id)
      );
  }

  /**
   * Returns list of graph vertices, which don't have "out-edges"
   */
  public findEndVertices(): DirectedGraphVertex<T>[] {
    return this.vertices
      .filter(v => v.edges.length !== 0 && !v.edges
        .some(e => e.startVertexId === v.id)
      );
  }

  /**
   * Iterates through vertices starting from a specific vertex using "Depth First Search" algorithm.
   * You can skip iterations from specific vertices ( see @param predicate )
   * @param startVertexId Start vertex ID
   * @param predicate Callback, which will be called for each vertex.
   * Return **true** to skip iterations which are coming out from current vertex
   */
  public dfsFrom(startVertexId: string, predicate: (vertex: DirectedGraphVertex<T>) => boolean) {
    const startVertex = this.getVertexById(startVertexId);

    const dfsStep = (vertex: DirectedGraphVertex<T>) => {

      if (predicate(vertex)) return;

      vertex.edges.filter(e => e.startVertexId === vertex.id)
        .map(e => this.getVertexById(e.endVertexId))
        .forEach(v => dfsStep(v));

    }

    dfsStep(startVertex);
  }
}
