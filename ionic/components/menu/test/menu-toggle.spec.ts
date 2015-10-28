// import {
//   ddescribe,
//   describe,
//   xdescribe,
//   it,
//   iit,
//   xit,
//   expect,
//   beforeEach,
//   afterEach,
//   AsyncTestCompleter,
//   inject,
//   beforeEachBindings
// } from 'angular2/test';

// import {Compiler} from 'angular2/angular2';

import {
    ViewController,
    Navbar,
    Menu,
    MenuToggle
} from 'ionic/ionic';


export function run() {
    describe("MenuToggle", () => {
        let menu, menuToggle;

        // beforeEach(inject([Compiler], compiler => {
        beforeEach(() => {
            menu = new Menu(null, null, null, null, null);
            menuToggle = new MenuToggle(null, null, menu, ViewController, Navbar);
        });

        it('should exist', () => {
            expect(menuToggle).not.toBeUndefined();
        });

        describe("isHidden", () => {

            it('should not be hidden for root pages by default', function () {
                ViewController.isRoot = () => {
                    return true;
                };
                expect(menuToggle.isHidden).toBe(false);
            });

            it('should be hidden for child pages by default', function () {
                ViewController.isRoot = () => {
                    return false;
                };
                expect(menuToggle.isHidden).toBe(true);
            });

            it('should not be hidden for child pages when isMenuWithBackViewsEnabled is true', function () {
                menu.enableMenuWithBackViews = true;
                ViewController.isRoot = () => {
                    return false;
                };
                expect(menuToggle.isHidden).toBe(false);
            });

            it('should be hidden for child pages when isMenuWithBackViewsEnabled is false', function () {
                menu.enableMenuWithBackViews = false;
                ViewController.isRoot = () => {
                    return false;
                };
                expect(menuToggle.isHidden).toBe(true);
            });
        });
    });
}