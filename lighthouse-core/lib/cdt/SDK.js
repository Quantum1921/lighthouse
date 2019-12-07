/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
// @ts-nocheck

global.cdt = {};

require('./generated/common/ParsedURL.js');

const SDK = {
  ...require('./generated/sdk/SourceMap.js'),
};

// eslint-disable-next-line no-extend-native
Object.defineProperty(Array.prototype, 'upperBound', {
  /**
   * Return index of the leftmost element that is greater
   * than the specimen object. If there's no such element (i.e. all
   * elements are smaller or equal to the specimen) returns right bound.
   * The function works for sorted array.
   * When specified, |left| (inclusive) and |right| (exclusive) indices
   * define the search window.
   *
   * @param {!T} object
   * @param {function(!T,!S):number=} comparator
   * @param {number=} left
   * @param {number=} right
   * @return {number}
   * @this {Array.<!S>}
   * @template T,S
   */
  value: function(object, comparator, left, right) {
    function defaultComparator(a, b) {
      return a < b ? -1 : (a > b ? 1 : 0);
    }
    comparator = comparator || defaultComparator;
    let l = left || 0;
    let r = right !== undefined ? right : this.length;
    while (l < r) {
      const m = (l + r) >> 1;
      if (comparator(object, this[m]) >= 0) {
        l = m + 1;
      } else {
        r = m;
      }
    }
    return r;
  },
});

globalThis.cdt.SDK.TextSourceMap.prototype.findExactEntry = function(line, column) {
  // findEntry takes compiled locations and returns original locations.
  const entry = this.findEntry(line, column);
  // without an exact hit, we return no match
  const hitMyBattleShip = entry && entry.lineNumber === line;
  if (!entry || !hitMyBattleShip) {
    return {
      sourceColumnNumber: null,
      sourceLineNumber: null,
      name: null,
      sourceURL: null,
    };
  }
  return entry;
};

// Add `lastColumnNumber` to mappings.
globalThis.cdt.SDK.TextSourceMap.prototype.computeLastGeneratedColumns = function() {
  const mappings = this.mappings();
  if (mappings.length && typeof mappings[0].lastColumnNumber !== 'undefined') return;

  for (let i = 0; i < mappings.length - 1; i++) {
    const mapping = mappings[i];
    const nextMapping = mappings[i + 1];
    if (mapping.lineNumber === nextMapping.lineNumber) {
      mapping.lastColumnNumber = nextMapping.columnNumber;
    }
  }
};

module.exports = SDK;
