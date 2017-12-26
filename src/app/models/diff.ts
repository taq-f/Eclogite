export interface Hunk {
  lines: Line[];
}

export interface Line {
  type: string;
  lineNoBefore: number;
  lineNoAfter: number;
  content: string;
}

