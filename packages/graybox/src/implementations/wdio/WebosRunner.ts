import AbstractRunner from './AbstractRunner';
import { pressButtonWebos } from './helpers';

class WebosRunner extends AbstractRunner {
    launchApp = () => {
        // do nothing
    };

    getElementById = (selector: string) => {
        return $(`[data-testid="${selector}"]`);
    };

    getElementByText = (selector: string) => {
        return $(`//*[text()='${selector}']`);
    };

    scrollById = () => {
        // do nothing
    };

    clickById = () => {
        // do nothing
    };

    clickByText = () => {
        // do nothing
    };

    pressButtonHome = async (n: number) => {
        await pressButtonWebos(n, 'HOME');
    };

    pressButtonBack = async (n: number) => {
        await pressButtonWebos(n, 'BACK');
    };

    pressButtonUp = async (n: number) => {
        await pressButtonWebos(n, 'UP');
    };

    pressButtonDown = async (n: number) => {
        await pressButtonWebos(n, 'DOWN');
    };

    pressButtonLeft = async (n: number) => {
        await pressButtonWebos(n, 'LEFT');
    };

    pressButtonRight = async (n: number) => {
        await pressButtonWebos(n, 'RIGHT');
    };

    pressButtonSelect = async (n: number) => {
        await pressButtonWebos(n, 'ENTER');
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

export default WebosRunner;
