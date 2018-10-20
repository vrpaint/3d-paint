import { IFrame } from '../../../model/IFrame';

export default interface ITransformPath {
    (path: IFrame[]): IFrame[];
}
