module.exports = {
  name: 'webquid',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/webquid',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
