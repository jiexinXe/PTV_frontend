const flatted = require('flatted');

module.exports = {
    print(val, serialize, indent) {
        return serialize(flatted.stringify(val));
    },
    test(val) {
        return typeof val === 'object' && val !== null;
    }
};
