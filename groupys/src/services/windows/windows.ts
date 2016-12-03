import {Injectable} from '@angular/core'
import {global} from '@angular/core/src/facade/lang';

@Injectable()
export class WindowService {
    
    constructor(){}
    
    getNativeWindow()
    {
        return global;
    }
}