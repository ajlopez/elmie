
var types = require('./types');

function createValue(native) {
	if (typeof native === 'number')
		if (Number.isInteger(native))
			return { value: native, type: types.Int };
		else
			return { value: native, type: types.Float };
}

module.exports = {
	value: createValue
};