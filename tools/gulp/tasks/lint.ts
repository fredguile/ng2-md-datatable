import gulp = require('gulp');
import { execNodeTask } from '../task_helpers';

gulp.task('lint', ['tslint', 'stylelint']);
gulp.task('stylelint', execNodeTask(
  'stylelint', ['src/**/*.scss', '--config', 'stylelint-config.json', '--syntax', 'scss']
));
gulp.task(':tslint:lib', execNodeTask('tslint', ['-c', 'tslint.json', 'src/lib/*.ts']));
gulp.task(':tslint:demo-app',
  execNodeTask('tslint', ['-c', 'tslint.json', '--project', 'src/demo-app/tsconfig.json', '-e', 'src/demo-app/src/**/*.ts']));
gulp.task('tslint', [':tslint:lib', ':tslint:demo-app']);
