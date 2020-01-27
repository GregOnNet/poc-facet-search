module.exports = {
  name: 'faceted-search-app',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/faceted-search-app',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
