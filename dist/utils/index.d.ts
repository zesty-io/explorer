/// <reference types="react" />
export declare const canUseDOM: () => boolean;
export declare const convertToArray: (content: any) => {
    [x: string]: any;
}[];
export declare const flattenObj: (obj: any, parent: any, res?: any) => any;
export declare function deepen(obj: any): {};
export declare const headerZUID: (response: any) => any;
export declare const PrettyPrintJson: ({ data }: any) => JSX.Element;
