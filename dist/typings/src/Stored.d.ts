import { Store } from 'vuex';
export declare const Stored: (store: (() => Store<any>) | string, { subProxy, readOnly, propName, commitName, isMethod, }?: {
    subProxy?: boolean | undefined;
    readOnly?: boolean | undefined;
    propName?: string | undefined;
    commitName?: string | undefined;
    isMethod?: boolean | undefined;
}) => (target: any, propertyKey?: string | null, descriptor?: PropertyDescriptor | null) => void;
