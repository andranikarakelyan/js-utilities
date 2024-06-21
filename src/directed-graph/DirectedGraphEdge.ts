export class DirectedGraphEdge {

  public startVertexId: string;
  public endVertexId: string;

  public constructor(
    startVertexId:string,
    endVertexId: string,
  ) {
    this.startVertexId = startVertexId;
    this.endVertexId = endVertexId;
  }

}
