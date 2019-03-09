const connectAdditionalCheckers = (typechecker, errMessage, type?) => Object.assign(typechecker, {
    isRequired: val => typeof val !== undefined && this(val),
    isNullable: () => null,
    message: (...data) => errMessage(type, ...data)
});

const compareWithConstructor = (constructor, message) => connectAdditionalCheckers(val => val.constructor === constructor, message, constructor);
const compareWithFn = (fn, message) => connectAdditionalCheckers(val => fn.call(is, val), message);
const simpleErrorMessage = (type, value, index) => `${messageIntro(value, index)}, expected \`${type.constructor === Array ? `one of ${type.join(',')}` : type}\``;
const messageIntro = (value, index) => `Assertion Error. Recieved \`${value}\` at \`${index}\``;

const ArrayLikeTypes = [Array, Int8Array, Int16Array, Int32Array, Uint8Array, Uint16Array, Uint32Array, Float32Array, Float64Array, BigInt64Array, BigUint64Array]
const NumberLikeTypes = [Number, BigInt];
/**
 * @example ```assertArguments(
 *  is.array,
 *  is.string,
 *  is.object,
 *  arguments
 * )```
 */
module.exports = (...argSchema, arguments) => {
    argSchema.forEach((typechecker, i) => {
        const checkResult = typechecker(arguments[i]);
        if (!checkResult) {
            throw typechecker.message(typechecker.type, arguments[i], i);
        }
    });
    const argSchema = config
        .filter(val => typeof val === 'function')
        .map((arg, i) => {
            arg.value = arguments[i]
        });
};

const is = {

    /* strict typecheckers */
    array:          compareWithConstructor(Array,          simpleErrorMessage),
    int8array:      compareWithConstructor(Int8Array,      simpleErrorMessage),
    int16array:     compareWithConstructor(Int16Array,     simpleErrorMessage),
    int32array:     compareWithConstructor(Int32Array,     simpleErrorMessage),
    uint8array:     compareWithConstructor(Uint8Array,     simpleErrorMessage),
    uint16array:    compareWithConstructor(Uint16Array,    simpleErrorMessage),
    uint32array:    compareWithConstructor(Uint32Array,    simpleErrorMessage),
    bigint64array:  compareWithConstructor(BigInt64Array,  simpleErrorMessage),
    biguint64array: compareWithConstructor(BigUint64Array, simpleErrorMessage),
    object:         compareWithConstructor(Object,         simpleErrorMessage),
    string:         compareWithConstructor(String,         simpleErrorMessage),
    symbol:         compareWithConstructor(Symbol,         simpleErrorMessage),
    number:         compareWithConstructor(Number,         simpleErrorMessage),
    bigint:         compareWithConstructor(BigInt,         simpleErrorMessage),
    buffer:         connectAdditionalCheckers(val => Buffer.isBuffer(val), simpleErrorMessage.bind(global, Buffer)),

    /* non-strict typecheckers */
    iterable:       connectAdditionalCheckers(val => val && typeof val[Symbol.iterator] === 'function', (_type, index, value) => `${messageIntro(value, index)}, expected an iterable value.`),
    finite:         connectAdditionalCheckers(val => Number.isFinite(val), (_type, index, value) => `${messageIntro(value, index)}, expected an finite value.`),
    arrayLike:      connectAdditionalCheckers(val => ArrayLikeTypes.includes(val), simpleErrorMessage),
    numberLike:     connectAdditionalCheckers(val => NumberLikeTypes.includes(val), simpleErrorMessage),

    /* complex typecheckers */
    dataset: connectAdditionalCheckers(val => {
        val instanceof Array && val.reduce((acc, setItem) => acc || setItem instanceof Object, true)
    }, (_type, index, value) => `${messageIntro(value, index)}, expected an Array value with collection of Objects inside.`),

    /* dynamic typecheckers */
    instanceOf: constructor => connectAdditionalCheckers(val => val instanceof constructor, simpleErrorMessage),
    instanceLike: constructors => connectAdditionalCheckers(val => constructors.includes(val), simpleErrorMessage),

    /* custom typecheckers */    
    oneOf: typecheckersList => connectAdditionalCheckers(val => {
        is.array(typecheckersList);
    }, simpleErrorMessage)
}

module.exports.is = is;
