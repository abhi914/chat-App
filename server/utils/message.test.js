const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');


describe('generateMessage', () => {
    it('should generate the correct message object', () => {
        const from = "abhi";
        const text = "I am abhi"
        const res = generateMessage(from,text);
        // console.log(res);
        
        expect(typeof res.from).toBe('string');
        expect(typeof res.text).toBe('string');
        expect(typeof res.createdAt).toBe('number');
    });
});

describe('gemerateLocationMessage', () => {
    it('should generate the correct location message', () => {
        const from = "Abhi";
        const latitude = 12;
        const longitude = 14;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const createdAt = new Date();

        const res = generateLocationMessage(from, latitude, longitude );
        expect(typeof res.createdAt).toBe('number');
        expect(res).toMatchObject({from, url});
    });
});