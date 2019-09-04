import {helloWorld} from '../index';

test('hellow world', () => {
	expect(helloWorld()).toStrictEqual('Hello World');
});
