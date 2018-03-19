const expect = require('expect');
let {generateMessage} = require('./message.js');

describe('generateMessage', ()=>{
    it('should generate correct message object.', ()=>{
      let from = 'Jenny';
      let text = 'Ola';
      let message = generateMessage(from, text);

      expect(message.createdAt).toBeA('number');
      expect(message).toInclude({from, text});
    });
});
