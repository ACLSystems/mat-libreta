module.exports = {
  name: 'conalepjalisco',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/conalepjalisco',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
