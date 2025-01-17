// @flow
//
//  Copyright (c) 2019-present, Cruise LLC
//
//  This source code is licensed under the Apache License, Version 2.0,
//  found in the LICENSE file in the root directory of this source tree.
//  You may not use this file except in compliance with the License.

import diff from "jest-diff";
import { isEqual } from "lodash";

// this file runs once jest has injected globals so you can modify the expect matchers
global.expect.extend({
  // expects an array to contain exactly the other elements
  // in otherArray using isEqual
  toContainOnly(received, expectedArray) {
    const receivedArray = Array.from(received);
    let pass = true;
    if (receivedArray.length !== expectedArray.length) {
      pass = false;
    } else {
      for (const expectedItem of expectedArray) {
        if (!receivedArray.some((receivedItem) => isEqual(receivedItem, expectedItem))) {
          pass = false;
          break;
        }
      }
      for (const receivedItem of receivedArray) {
        if (!expectedArray.some((expectedItem) => isEqual(receivedItem, expectedItem))) {
          pass = false;
          break;
        }
      }
    }
    return {
      pass,
      actual: receivedArray,
      message: () => {
        const diffString = diff(expectedArray, receivedArray, { expand: this.expand });
        return `${this.utils.matcherHint(pass ? ".not.toContainOnly" : ".toContainOnly")}\n\nExpected value${
          pass ? " not" : ""
        } to contain only:\n  ${this.utils.printExpected(expectedArray)}\nReceived:\n  ${this.utils.printReceived(
          receivedArray
        )}\n\nDifference:\n\n${diffString}`;
      },
    };
  },
});
