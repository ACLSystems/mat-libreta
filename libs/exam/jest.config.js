module.exports = {
  name: 'exam',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/exam',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
