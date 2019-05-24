import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { filter, map } from "rxjs/operators";

interface BroadcastEvent {
  key: any;
  data?: any;
}

@Injectable({
  providedIn: "root"
})
export class BroadcasterService {
  private subject = new Subject<BroadcastEvent>();

  broadcast(key?: any, data?: any) {
    this.subject.next({ key, data });
  }

  clearBroadcast() {
    this.subject.unsubscribe();
  }


  getBroadcast<T>(key: any): Observable<T> {
    return this.subject
      .asObservable()
      .pipe(
        filter(event => {
          return event.key === key;
        })
      )
      .pipe(map(event => <T>event.data));
  }
}
