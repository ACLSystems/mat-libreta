module.exports = {
  name: 'crm-acl',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/crm-acl',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
};
