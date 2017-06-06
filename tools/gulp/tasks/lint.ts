import gulp = require('gulp');
import { execNodeTask } from '../task_helpers';

gulp.task('lint', ['tslint', 'stylelint']);
gulp.task('stylelint', execNodeTask(
  'stylelint', ['src/**/*.scss', '--config', 'stylelint-config.json', '--syntax', 'scss']
));
gulp.task(':tslint:lib', execNodeTask('tslint', [
  '-c',
  'tslint.json',
  '--project',
  'src/lib/tsconfig-srcs.json',
]));
gulp.task(':tslint:demo-app', execNodeTask('tslint', [
  '-c',
  'tslint.json',
  '--project',
  'src/demo-app/tsconfig.json'
]));
gulp.task('tslint', [':tslint:lib', ':tslint:demo-app']);
