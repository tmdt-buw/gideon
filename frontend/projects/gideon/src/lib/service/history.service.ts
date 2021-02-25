import {Injectable} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {ActionCall, ApplicationAction, ApplicationState, HistoryControllerService, Session, SessionControllerService} from '../api';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  projectId: string;
  userId: string;
  session: Session;
  expires: Date;
  $sessionLoading: Observable<Session>;
  $changed = new Subject();

  constructor(private historyService: HistoryControllerService, private sessionService: SessionControllerService) {
  }

  initSession(projectId: string, userId: string): void {
    this.projectId = projectId;
    this.userId = userId;
    this.session = null;
    this.checkSession().subscribe();
  }

  checkSession(): Observable<Session> {
    if (this.$sessionLoading) {
      return this.$sessionLoading;
    }
    if (!this.session || this.isSessionExpired()) {
      console.log('[InitSession]');
      this.$sessionLoading = this.historyService.initSession(this.projectId, this.userId).pipe(
          tap(session => {
            this.setSession(session);
            this.$sessionLoading = null;
          })
      );
      return this.$sessionLoading;
    } else {
      return of(this.session);
    }
  }

  endSession(): void {
    console.log('[EndSession]');
    this.historyService.endSession(this.projectId, this.userId).subscribe(() => this.session = null);
  }

  isSessionExpired(): boolean {
    return this.expires < new Date();
  }

  setSession(session: Session): void {
    this.session = session;
    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + session.expiresIn);
    this.expires = expires;
    this.$changed.next();
  }

  recordAction(action: ApplicationAction, state: ApplicationState): void {
    const actionCall = {
      action,
      state
    } as ActionCall;
    console.log(`[Action - ${action.type}]`, actionCall);
    // Check session
    this.checkSession().subscribe(() => {
      this.sessionService.recordAction(this.session.id, actionCall).subscribe(session => {
        this.setSession(session);
      });
    });
  }
}
