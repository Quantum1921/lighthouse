/**
 * @license Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const emulation = require('../../lib/emulation.js');
const {getMockedEmulationDriver} = require('../gather/gather-runner-test.js');

/* eslint-env jest */

describe('emulation', () => {
  describe('emulate', () => {
    const deviceMetricsFn = jest.fn();
    const setUAFn = jest.fn();
    const driver = getMockedEmulationDriver(deviceMetricsFn, null, null, null, null, setUAFn);

    const getFnCallArg = fn => fn.mock.calls[0][0];
    const getSettings = (formFactor, screenEmulationMethod) => ({
      emulatedFormFactor: formFactor,
      deviceScreenEmulationMethod: screenEmulationMethod,
    });

    beforeEach(() => {
      deviceMetricsFn.mockClear();
      setUAFn.mockClear();
    });

    it('handles: emulatedFormFactor: mobile / deviceScreenEmulationMethod: devtools', async () => {
      await emulation.emulate(driver, {
        emulatedFormFactor: 'mobile',
        deviceScreenEmulationMethod: 'devtools'
      });
      expect(setUAFn).toBeCalled();
      expect(deviceMetricsFn).toBeCalled();
      expect(getFnCallArg(setUAFn)).toMatchObject({userAgent: emulation.MOBILE_USERAGENT});
      expect(getFnCallArg(deviceMetricsFn)).toMatchObject({mobile: true});
    });

    it('handles: emulatedFormFactor: desktop / deviceScreenEmulationMethod: devtools', async () => {
      await emulation.emulate(driver, {
        emulatedFormFactor: 'desktop',
        deviceScreenEmulationMethod: 'devtools'
      });
      expect(setUAFn).toBeCalled();
      expect(deviceMetricsFn).toBeCalled();
      expect(getFnCallArg(setUAFn)).toMatchObject({userAgent: emulation.DESKTOP_USERAGENT});
      expect(getFnCallArg(deviceMetricsFn)).toMatchObject({mobile: false});
    });

    it('handles: emulatedFormFactor: none / deviceScreenEmulationMethod: devtools', async () => {
      await emulation.emulate(driver, {
        emulatedFormFactor: 'none',
        deviceScreenEmulationMethod: 'devtools'
      });
      expect(setUAFn).not.toBeCalled();
      expect(deviceMetricsFn).not.toBeCalled();
    });

    it('handles: emulatedFormFactor: mobile / deviceScreenEmulationMethod: provided', async () => {
      await emulation.emulate(driver, {
        emulatedFormFactor: 'mobile',
        deviceScreenEmulationMethod: 'provided'
      });
      expect(setUAFn).toBeCalled();
      expect(deviceMetricsFn).not.toBeCalled();
      expect(getFnCallArg(setUAFn)).toMatchObject({userAgent: emulation.MOBILE_USERAGENT});
    });

    it('handles: emulatedFormFactor: desktop / deviceScreenEmulationMethod: provided', async () => {
      await emulation.emulate(driver, {
        emulatedFormFactor: 'desktop',
        deviceScreenEmulationMethod: 'provided'
      });
      expect(setUAFn).toBeCalled();
      expect(deviceMetricsFn).not.toBeCalled();
      expect(getFnCallArg(setUAFn)).toMatchObject({userAgent: emulation.DESKTOP_USERAGENT});
    });

    it('handles: emulatedFormFactor: none / deviceScreenEmulationMethod: provided', async () => {
      await emulation.emulate(driver, {
        emulatedFormFactor: 'none',
        deviceScreenEmulationMethod: 'provided'
      });
      expect(setUAFn).not.toBeCalled();
      expect(deviceMetricsFn).not.toBeCalled();
    });
  });
});
