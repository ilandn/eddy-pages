'use strict';

var _date = require('handsontable/plugins/columnSorting/sortFunction/date');

var _date2 = _interopRequireDefault(_date);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

it('dateSort comparing function shouldn\'t change order when comparing empty string, null and undefined', function () {
  expect((0, _date2.default)('asc', { columnSorting: {} })(null, null)).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })(null, null)).toEqual(0);

  expect((0, _date2.default)('asc', { columnSorting: {} })('', '')).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })('', '')).toEqual(0);

  expect((0, _date2.default)('asc', { columnSorting: {} })(undefined, undefined)).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })(undefined, undefined)).toEqual(0);

  expect((0, _date2.default)('asc', { columnSorting: {} })('', null)).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })('', null)).toEqual(0);
  expect((0, _date2.default)('asc', { columnSorting: {} })(null, '')).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })(null, '')).toEqual(0);

  expect((0, _date2.default)('asc', { columnSorting: {} })('', undefined)).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })('', undefined)).toEqual(0);
  expect((0, _date2.default)('asc', { columnSorting: {} })(undefined, '')).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })(undefined, '')).toEqual(0);

  expect((0, _date2.default)('asc', { columnSorting: {} })(null, undefined)).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })(null, undefined)).toEqual(0);
  expect((0, _date2.default)('asc', { columnSorting: {} })(undefined, null)).toEqual(0);
  expect((0, _date2.default)('desc', { columnSorting: {} })(undefined, null)).toEqual(0);
});