/* eslint-disable no-await-in-loop */
import AbstractRunner from './AbstractRunner';
import { pressButtonIos } from './helpers';

class IosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`~${selector}`);
    };

    getElementByText = (selector: string) => {
        return $(`[label="${selector}"]`);
    };

    scrollById = async (selector: string, direction: string) => {
        const element = await this.getElementById(selector);
        let isDisplayed = await element.isDisplayed();
        while (!isDisplayed) {
            await browser.execute('mobile: scroll', { direction });
            isDisplayed = await element.isDisplayed();
        }
    };

    clickById = async (selector: string) => {
        await (await this.getElementById(selector)).click();
    };

    clickByText = async (selector: string) => {
        await (await this.getElementByText(selector)).click();
    };

    pressButtonHome = async (n: number) => {
        await pressButtonIos(n, 'home');
    };

    pressButtonBack = async (n: number) => {
        for (let i = 0; i < n; i++) {
            await browser.execute('mobile: dragFromToForDuration', {
                fromX: 10,
                fromY: 200,
                toX: 500,
                toY: 200,
                duration: 0.5,
            });
            await browser.pause(500);
        }
    };

    pressButtonUp = () => {
        // do nothing
    };

    pressButtonDown = () => {
        // do nothing
    };

    pressButtonLeft = () => {
        // do nothing
    };

    pressButtonRight = () => {
        // do nothing
    };

    pressButtonSelect = () => {
        // do nothing
    };

    expectToMatchElementById = async (selector: string, tag: string, acceptableMismatch = 5) => {
        const element = await this.getElementById(selector);
        await element.waitForDisplayed({ timeout: 60000 });
        await expect((await driver.compareElement(element, tag)).misMatchPercentage).toBeLessThanOrEqual(
            acceptableMismatch
        );
    };

    expectToMatchElementByText = async (selector: string, tag: string, acceptableMismatch = 5) => {
        const element = await this.getElementByText(selector);
        await element.waitForDisplayed({ timeout: 60000 });
        await expect((await driver.compareElement(element, tag)).misMatchPercentage).toBeLessThanOrEqual(
            acceptableMismatch
        );
    };

    expectToMatchScreen = async (tag: string, acceptableMismatch = 5) => {
        await expect((await driver.compareScreen(tag)).misMatchPercentage).toBeLessThanOrEqual(acceptableMismatch);
    };
}

export default IosRunner;
