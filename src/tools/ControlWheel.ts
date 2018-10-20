import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/share';
import { IVector2 } from '../model/IVectors';
import { vectorDistance } from './vectors';

type delta = 1 | -1;

export class ControlWheel {
    public values: Observable<delta>;
    private _valuesObserver: Observer<delta>;

    constructor(public sensitivity = (Math.PI * 2) / -36) {
        this.values = Observable.create((observer: Observer<delta>) => {
            this._valuesObserver = observer;
        }).share();
    }

    private lastPosition: null | IVector2 = null;
    private cumulativeAngle: number = 0;

    impulse(position: IVector2) {
        if (
            this.lastPosition &&
            vectorDistance(position, this.lastPosition) <
                0.3 /*todo sensitivity*/
        ) {
            const angle1 = Math.atan2(position.y, position.x);
            const angle2 = Math.atan2(this.lastPosition.y, this.lastPosition.x);

            this.cumulativeAngle += angle2 - angle1;

            if (Math.abs(this.cumulativeAngle) >= Math.abs(this.sensitivity)) {
                const delta =
                    Math.sign(this.cumulativeAngle) *
                    Math.sign(this.sensitivity);
                if (delta === -1 || delta === 1) {
                    this._valuesObserver.next(delta);
                }
                this.cumulativeAngle = 0;
            }
        } else {
            this.cumulativeAngle = 0;
        }

        this.lastPosition = Object.assign({}, position);
    }
}
