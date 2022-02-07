export class MyWorkflow {
  async showCreateWorkflowForm(): Promise<void> {
    var workflowForm = document.getElementById("workflow-form-options");
    document.getElementById("workflow-form-header").innerHTML = "Create New Workflow";

    workflowForm.innerHTML = `<div class="form-group container">
				<div class="row">
				<label class="col" for="workflow-name"> Workflow Name: </label>
				<input pattern="[\\w\\d\\s-]+" id="workflow-name" type="text" class="col form-control bg-transparent text-light shadow-none" \\>
				</div>
				</div>
				<div class="form-group container">
				<div class="row">
				<label class="col" for="version"> Version: </label>
				<input pattern="[\\w\\d\\s-]+" id="version" type="text" class="col form-control bg-transparent text-light shadow-none" \\>
				</div>
				</div>`;

    var submitButton = document.getElementById("workflow-form-btn");
    submitButton.innerHTML = "Create Workflow";
  }
}

export const myWorkflow = new MyWorkflow();
