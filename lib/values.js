
var types = require('./types');

function createValue(native) {
	if (typeof native === 'number')
		return { value: native, type: types.Int };
}

module.exports = {
	value: createValue
};