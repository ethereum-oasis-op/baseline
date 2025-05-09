import { Workstep } from "@provide/types";
export class MyWorkstep {
  async showCreateWorkstepForm(): Promise<void> {
    var workstepForm = document.getElementById("workstep-form-options");
    document.getElementById("workstep-form-header").innerHTML = "Create New Workstep";

    workstepForm.innerHTML = `<div class="form-group container">
				<div class="row">
				<label class="col" for="workstep-name"> Workstep Name: </label>
				<input pattern="[\\w\\d\\s-]+" id="workstep-name" type="text" class="col form-control bg-transparent text-light shadow-none" \\>
				</div>
				</div>`;

    var submitButton = document.getElementById("workstep-form-btn");
    submitButton.innerHTML = "Create Workstep";
  }

  async showWorkstepDetails(workstep: Workstep): Promise<void> {
    var workstepDetailTable = document.getElementById("workstep-details");
    var keys = Object.keys(workstep);
    workstepDetailTable.innerHTML = "";
    workstepDetailTable.innerHTML += `
    <thead>
    <tr>
    <th>Keys</th>
    <th>Values</th>
    </tr>
    </thead>`;
    workstepDetailTable.innerHTML += `
    <tbody>
      ${keys
        .map((key) =>
          key === "metadata"
            ? `<tr><td>${key}</td><td><ul class="list-group">
            <p>Prover</p>
            <li class="list-group-item">Identifier: ${workstep[key]["prover"]["identifier"]}</li>
            <li class="list-group-item">Provider: ${workstep[key]["prover"]["provider"]}</li>
            <li class="list-group-item">Proving scheme: ${workstep[key]["prover"]["proving_scheme"]}</li>
            <li class="list-group-item">Curve: ${workstep[key]["prover"]["curve"]}</li>
          </ul></td></tr>`
            : `<tr><td>${key}</td><td>${workstep[key]}</td></tr>`
        )
        .join("")}
      </tbody>`;
  }
}

export const myWorkstep = new MyWorkstep();
