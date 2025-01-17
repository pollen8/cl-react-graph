export declare type TOutputType = 'png' | 'blob';
export interface IWatermark {
    svg: string;
    width: number;
    height: number;
}
export declare const outputSvg: (svgId: string, width: number, height: number, callback: (outputData: string | Blob | null) => void, watermark?: IWatermark, type?: TOutputType) => void;
