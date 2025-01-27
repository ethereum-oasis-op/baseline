import useSWR from 'swr'
import { useRouter } from 'next/router'
import { fetcher } from '../../../lib/workflows'
import Admin from "layouts/Admin.js";
import CardWorkflow from "components/Cards/CardWorkflow.js";

function useWorkflow (id) {
  const { data: workflowData, error: workflowError } = useSWR(`http://localhost:5001/workflows/${id}`, fetcher)
  return {
      workflow: workflowData,
      workflowLoading: !workflowError && !workflowData,
      workflowError: workflowError
  }
}

function useCommit (workflowId) {
  const { data: commitData, error: commitError } = useSWR(`http://localhost:4001/commits?workflowId=${workflowId}`, { refreshInterval: 2000, fetcher })
  return {
      commits: commitData,
      commitsLoading: !commitError && !commitData,
      commitsError: commitError
  }
}


export default function Workflow() {
  const router = useRouter();
  const { id } = router.query

  const { workflow, workflowLoading, workflowError } = useWorkflow(id)
  const { commits, commitsLoading, commitsError } = useCommit(id)

  if (workflowError) return <div>failed to load workflow id {id}</div>
  if (workflowLoading) return <div>loading...</div>

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardWorkflow 
            workflow={workflow}
            workflowLoading={workflowLoading}
            workflowError={workflowError}
            commits={commits}
          />
        </div>
      </div>
    </>
  );
}

Workflow.layout = Admin;