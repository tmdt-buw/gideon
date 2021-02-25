import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ApplicationAction, ApplicationState} from '../../../api';
import {ActionType, isHistoryActionType} from '../../../model/action-type';
import {HistoryNavigateEvent} from '../../../model/history-navigate-event';
import {HistoryService} from '../../../service/history.service';

@Component({
  selector: 'gd-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GdHistoryComponent implements OnInit {

  @Input() boundary: string;
  @Input() classes: string | string[];
  minimized = false;
  maximized = false;

  @ViewChild('historyList') private myScrollContainer: ElementRef;

  @Output() navigate = new EventEmitter<HistoryNavigateEvent>();

  constructor(private history: HistoryService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.history.$changed.subscribe(() => {
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  get links(): ApplicationAction[] {
    return this.history.session?.actions;
  }

  getState(applicationAction: ApplicationAction): ApplicationState {
    return this.history.session?.states.find(state => state.id === applicationAction.target);
  }

  minimize(): void {
    this.minimized = !this.minimized;
  }

  maximize(): void {
    this.maximized = !this.maximized;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  emitNavigate(applicationAction: ApplicationAction, index: number): void {
    if (!this.isCurrent(index) && !isHistoryActionType(applicationAction.type)) {
      const state = this.getState(applicationAction);
      this.navigate.emit({type: ActionType.historyRevert, applicationState: state});
    }
  }

  isCurrent(index: number): boolean {
    return index === this.history.session?.actions?.length - 1;
  }

  isHistoryActionType(type: string): boolean {
    return isHistoryActionType(type);
  }
}
