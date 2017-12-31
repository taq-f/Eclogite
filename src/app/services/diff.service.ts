import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { getDiff } from '../lib/git/diff';
import { applyPatch } from '../lib/git/apply';
import { FileDiff, Hunk } from '../models/diff';
import { AppStatusEntry } from '../models/workingfile';

@Injectable()
export class DiffService {
  getDiff(
    repositoryPath: string,
    filepath: string,
    status: AppStatusEntry
  ): Observable<FileDiff> {
    return fromPromise(getDiff(repositoryPath, filepath, status));
    // const hunks: ReadonlyArray<Hunk> = [
    //   new Hunk({
    //     selectedState: 'all',
    //     header: {
    //       content: '@@ -12,7 +12,7 @@ from app_exceptions import CompanyNotFoundException, NoTableWillBeInquiriedExcep',
    //       oldFileStartLineNo: 12,
    //       newFileStartLineNo: 12,
    //     },
    //     lines: [
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 12,
    //         newLineNo: 12,
    //         content: ' from condition import Condition',
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 13,
    //         newLineNo: 13,
    //         content: ' from response_model import ResponseModel'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 14,
    //         newLineNo: 14,
    //         content: ' '
    //       },
    //       {
    //         type: 'minus',
    //         oldLineNo: 15,
    //         newLineNo: -1,
    //         content: '-',
    //         selected: true,
    //       },
    //       {
    //         type: 'plus',
    //         oldLineNo: -1,
    //         newLineNo: 15,
    //         content: '+aa',
    //         selected: true,
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 16,
    //         newLineNo: 16,
    //         content: ' def init_logger(app):'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 17,
    //         newLineNo: 17,
    //         content: '     \"\"\"ロギング初期化\"\"\"'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 18,
    //         newLineNo: 18,
    //         content: '     log_dir = os.path.join(app.root_path, \'logs\')'
    //       },
    //     ],
    //   }),
    //   new Hunk({
    //     selectedState: 'all',
    //     header: {
    //       content: '@@ -50,10 +50,10 @@ def remote_addr():',
    //       oldFileStartLineNo: 50,
    //       newFileStartLineNo: 50,
    //     },
    //     lines: [
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 50,
    //         newLineNo: 50,
    //         content: ' # ******************************************************************************'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 51,
    //         newLineNo: 51,
    //         content: ' '
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 52,
    //         newLineNo: 52,
    //         content: ' app = Flask(__name__)'
    //       },
    //       {
    //         type: 'minus',
    //         oldLineNo: 53,
    //         newLineNo: -1,
    //         content: '-Compress(app)',
    //         selected: true,
    //       },
    //       {
    //         type: 'plus',
    //         oldLineNo: -1,
    //         newLineNo: 53,
    //         content: '+Compress(app)a',
    //         selected: true,
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 54,
    //         newLineNo: 54,
    //         content: ' init_logger(app)'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 55,
    //         newLineNo: 55,
    //         content: ' '
    //       },
    //       {
    //         type: 'minus',
    //         oldLineNo: 56,
    //         newLineNo: -1,
    //         content: '-# ******************************************************************************',
    //         selected: true,
    //       },
    //       {
    //         type: 'plus',
    //         oldLineNo: -1,
    //         newLineNo: 56,
    //         content: '+# *a*****************************************************************************',
    //         selected: true,
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 57,
    //         newLineNo: 57,
    //         content: ' # Web'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 58,
    //         newLineNo: 58,
    //         content: ' # ******************************************************************************'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 59,
    //         newLineNo: 59,
    //         content: ' '
    //       },
    //     ],
    //   }),
    //   new Hunk({
    //     selectedState: 'all',
    //     header: {
    //       content: '@@ -126,6 +126,7 @@ def inquire_results(company):',
    //       oldFileStartLineNo: 126,
    //       newFileStartLineNo: 126,
    //     },
    //     lines: [
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 126,
    //         newLineNo: 126,
    //         content: '     return jsonify(res_model.json)'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 127,
    //         newLineNo: 127,
    //         content: ' '
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 128,
    //         newLineNo: 128,
    //         content: ' '
    //       },
    //       {
    //         type: 'plus',
    //         oldLineNo: -1,
    //         newLineNo: 129,
    //         content: '+dddd',
    //         selected: true,
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 129,
    //         newLineNo: 130,
    //         content: ' @app.errorhandler(Exception)'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 130,
    //         newLineNo: 131,
    //         content: ' def handle_error(error):'
    //       },
    //       {
    //         type: 'unchanged',
    //         oldLineNo: 131,
    //         newLineNo: 132,
    //         content: '     \"\"\"Error handler when a routed function raises unhandled error\"\"\"'
    //       },
    //     ],
    //   }),
    // ];

    // return of(new FileDiff({
    //   path: '',
    //   diffInfo: [
    //     '--- a/app.py',
    //     '+++ b/app.py',
    //   ],
    //   hunks: hunks,
    // }));
  }

  applyPatch( repositoryPath: string, patch: string): Observable<undefined> {
    return fromPromise(applyPatch(repositoryPath, patch));
  }
}
