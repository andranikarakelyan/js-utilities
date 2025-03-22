/**
 * Interface representing the result of the current code information.
 */
export interface ICurrentCodeInfoResult {
  /** The name of the class containing the current code. */
  className: string;
  /** The name of the method containing the current code. */
  methodName: string;
  /** The full file path of the current code. */
  filepath: string;
  /** The file name of the current code. */
  filename: string;
  /** The line number of the current code. */
  lineNumber: number;
  /** The column number of the current code. */
  columnNumber: number;
}

/**
 * Retrieves information about the current code execution context.
 *
 * @param additionalDepth - The additional depth to consider in the stack trace.
 * @returns An object containing the class name, method name, file path, file name, line number, and column number of the current code.
 */
export function currentCodeInfo(additionalDepth: number = 0): ICurrentCodeInfoResult {
  const error = new Error();
  const stack = error.stack?.split("\n") || [];
  const stackLineIndex = 2 + additionalDepth;
  const stackLine = stack[stackLineIndex];

  const result: ICurrentCodeInfoResult = {
    className: "",
    methodName: "",
    filepath: "",
    filename: "",
    lineNumber: -1,
    columnNumber: -1
  }

  let match: RegExpMatchArray | null = null;

  match = stackLine?.match(/at (\w+)\.(\w+)/);
  if (match) {
    result.className = match[1];
    result.methodName = match[2];
  }
  else {
    match = stackLine?.match(/at (\w+)\.<anonymous>/);
    if (match) {
      result.className = match[1];
      result.methodName = "anonymous";
    }
    else {
      match = stackLine?.match(/at (\w+)/);
      if (match) {
        result.methodName = match[1];
      }
      else {
        result.methodName = 'anonymous';
      }
    }
  }

  let filePathInfo = stackLine?.match(/\((.*):(\d+):(\d+)\)/) || stackLine?.match(/at (.*):(\d+):(\d+)/);

  if (filePathInfo) {
    result.filepath = filePathInfo[1];
    result.filename = filePathInfo[1].split('/').pop() || "unknown";
    result.lineNumber = parseInt(filePathInfo[2], 10);
    result.columnNumber = parseInt(filePathInfo[3], 10);
  }

  return result;
}
