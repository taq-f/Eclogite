import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { Hunk } from '../models/diff';

@Injectable()
export class DiffService {
  getDiff(repositoryPath: string, filepath: string): Observable<ReadonlyArray<Hunk>> {
    return of([
      {
        lines: [
          {
            type: 'header',
            lineNoBefore: -1,
            lineNoAfter: -1,
            content: '@@ -12,7 +12,7 @@ from app_exceptions import CompanyNotFoundException, NoTableWillBeInquiriedExcep'
          },
          {
            type: 'unchanged',
            lineNoBefore: 12,
            lineNoAfter: 12,
            content: ' from condition import Condition'
          },
          {
            type: 'unchanged',
            lineNoBefore: 13,
            lineNoAfter: 13,
            content: ' from response_model import ResponseModel'
          },
          {
            type: 'unchanged',
            lineNoBefore: 14,
            lineNoAfter: 14,
            content: ' '
          },
          {
            type: 'minus',
            lineNoBefore: 15,
            lineNoAfter: -1,
            content: '-'
          },
          {
            type: 'plus',
            lineNoBefore: -1,
            lineNoAfter: 15,
            content: '+aa'
          },
          {
            type: 'unchanged',
            lineNoBefore: 16,
            lineNoAfter: 16,
            content: ' def init_logger(app):'
          },
          {
            type: 'unchanged',
            lineNoBefore: 17,
            lineNoAfter: 17,
            content: '     \"\"\"ロギング初期化\"\"\"'
          },
          {
            type: 'unchanged',
            lineNoBefore: 18,
            lineNoAfter: 18,
            content: '     log_dir = os.path.join(app.root_path, \'logs\')'
          }
        ]
      },
      {
        lines: [
          {
            type: 'header',
            lineNoBefore: -1,
            lineNoAfter: -1,
            content: '@@ -50,10 +50,10 @@ def remote_addr():'
          },
          {
            type: 'unchanged',
            lineNoBefore: 50,
            lineNoAfter: 50,
            content: ' # ******************************************************************************'
          },
          {
            type: 'unchanged',
            lineNoBefore: 51,
            lineNoAfter: 51,
            content: ' '
          },
          {
            type: 'unchanged',
            lineNoBefore: 52,
            lineNoAfter: 52,
            content: ' app = Flask(__name__)'
          },
          {
            type: 'minus',
            lineNoBefore: 53,
            lineNoAfter: -1,
            content: '-Compress(app)'
          },
          {
            type: 'plus',
            lineNoBefore: -1,
            lineNoAfter: 53,
            content: '+Compress(app)a'
          },
          {
            type: 'unchanged',
            lineNoBefore: 54,
            lineNoAfter: 54,
            content: ' init_logger(app)'
          },
          {
            type: 'unchanged',
            lineNoBefore: 55,
            lineNoAfter: 55,
            content: ' '
          },
          {
            type: 'minus',
            lineNoBefore: 56,
            lineNoAfter: -1,
            content: '-# ******************************************************************************'
          },
          {
            type: 'plus',
            lineNoBefore: -1,
            lineNoAfter: 56,
            content: '+# *a*****************************************************************************'
          },
          {
            type: 'unchanged',
            lineNoBefore: 57,
            lineNoAfter: 57,
            content: ' # Web'
          },
          {
            type: 'unchanged',
            lineNoBefore: 58,
            lineNoAfter: 58,
            content: ' # ******************************************************************************'
          },
          {
            type: 'unchanged',
            lineNoBefore: 59,
            lineNoAfter: 59,
            content: ' '
          }
        ]
      },
      {
        lines: [
          {
            type: 'header',
            lineNoBefore: -1,
            lineNoAfter: -1,
            content: '@@ -126,6 +126,7 @@ def inquire_results(company):'
          },
          {
            type: 'unchanged',
            lineNoBefore: 126,
            lineNoAfter: 126,
            content: '     return jsonify(res_model.json)'
          },
          {
            type: 'unchanged',
            lineNoBefore: 127,
            lineNoAfter: 127,
            content: ' '
          },
          {
            type: 'unchanged',
            lineNoBefore: 128,
            lineNoAfter: 128,
            content: ' '
          },
          {
            type: 'plus',
            lineNoBefore: -1,
            lineNoAfter: 129,
            content: '+dddd'
          },
          {
            type: 'unchanged',
            lineNoBefore: 129,
            lineNoAfter: 130,
            content: ' @app.errorhandler(Exception)'
          },
          {
            type: 'unchanged',
            lineNoBefore: 130,
            lineNoAfter: 131,
            content: ' def handle_error(error):'
          },
          {
            type: 'unchanged',
            lineNoBefore: 131,
            lineNoAfter: 132,
            content: '     \"\"\"Error handler when a routed function raises unhandled error\"\"\"'
          },
          {
            type: 'unchanged',
            lineNoBefore: 132,
            lineNoAfter: 133,
            content: '',
          }
        ]
      }
    ]);
  }
}
