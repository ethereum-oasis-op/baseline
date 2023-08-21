import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { WorkstepExecutionFailuresEvent } from '../handleWorkstepFailuresEvents/workstepExecutionFailures.event';

@Injectable()
export class VsmFailureSagas {
  @Saga()
  handleWorkstepFailures = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WorkstepExecutionFailuresEvent)
    );
  };
}
