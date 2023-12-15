export const strategies = {
    object: {
        default: (src) => src,
        merge: (src, dest) => Object.fromEntries(
            Object.entries({...src, ...dest}).sort((a, b) => a[0].localeCompare(b[0]))
        ),
        fallback: (src, dest) => src ?? dest,
        prepend: (src, dest) => ({...dest, ...src}),
        append: (src, dest) => ({...src, ...dest}),
        replace: (_, dest) => dest
    },
    array: {
        default: (src) => src,
        merge: (src, dest) => [...src, ...dest].sort(),
        fallback: (src, dest) => new Array(Math.max(src.length, dest.length)).map((_, i) => src[i] ?? dest[i]),
        append: (src, dest) => [...src, ...dest],
        override: (src, dest) => new Array(Math.max(src.length, dest.length)).map((_, i) => dest[i] ?? src[i]),
        replace: (_, dest) => dest,
        intersect: (src, dest) => Array.from(new Set([...src, ...dest]))
    },
    string: {
        default: (src) => src,
        fallback: (src, dest) => dest ?? src,
        append: (src, dest) => src + dest,
        replace: (_, dest) => dest
    },
    number: {
        default: (src) => src,
        fallback: (src, dest) => dest ?? src,
        add: (src, dest) => src + dest,
        multiply: (src, dest) => src * dest,
        power: (src, dest) => src ** dest,
        exponential: (src, dest) => dest ** src,
        replace: (_, dest) => dest,
        or: (src, dest) => src | dest,
        and: (src, dest) => src & dest,
        xor: (src, dest) => src ^ dest
    },
    boolean: {
        default: (src) => src,
        or: (src, dest) => src || dest,
        and: (src, dest) => src && dest,
        nand: (src, dest) => !(src && dest),
        nor: (src, dest) => !(src || dest),
        xor: (src, dest) => src !== dest,
        xnor: (src, dest) => src === dest
    },
    other: {
        default: (src) => src,
        undefined: () => void 0,
        delete: () => {throw new Error("delete must be handled outside the patch fn")},
        null: () => null,
        nan: () => NaN,
        throw: () => {throw new Error("strategy other.throw() called")}
    }
}

export default (obj, type, strategy, key, value) => strategies[type][strategy](obj[key], value)