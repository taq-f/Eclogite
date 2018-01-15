import { Branch } from './branch';
import { AppWorkingFileChange } from './workingfile';

export interface Status {
  changes: ReadonlyArray<AppWorkingFileChange>;
  upstream?: Branch;
  ahead?: number;
  behind?: number;
}
