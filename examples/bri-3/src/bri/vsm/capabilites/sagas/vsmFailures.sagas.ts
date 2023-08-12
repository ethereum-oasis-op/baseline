import { Injectable } from '@nestjs/common';
import { ICommand, ofType, Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkstepExecutionFailuresEvent } from '../handleWorkstepFailuresEvents/workstepExecutionFailures.event';
import { HandleWorkstepFailuresCommand } from '../handleWorkstepFailures/handleWorkstepFailures.command';

@Injectable()
export class VsmFailureSagas {
  @Saga()
  handleWorkstepFailures = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(WorkstepExecutionFailuresEvent),
      map((event) => {
        return new HandleWorkstepFailuresCommand(event.id);
      }),
    );
  };
}
