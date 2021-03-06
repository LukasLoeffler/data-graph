import { performance } from "perf_hooks";

export const measure = (
    target: Object,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any) {
        const start = performance.now();
        const result = originalMethod.apply(this, args);
        const finish = performance.now();
        console.log(`Execution time: ${finish - start} milliseconds`);
        return result;
    };

    return descriptor;
};