module.exports = {
  name: 'cetec',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/cetec',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
