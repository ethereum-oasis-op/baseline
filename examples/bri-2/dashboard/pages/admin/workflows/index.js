import useSWR from 'swr'
import { fetcher } from '../../../lib/workflows'
import CardWorkflows from "components/Cards/CardWorkflows.js";
import Admin from "layouts/Admin.js";

function useWorkflows() {
  const { data, error } = useSWR('http://localhost:5001/workflows', fetcher)
  return {
      workflows: data,
      isLoading: !error && !data,
      isError: error
  }
}

export default function Workflows() {
  const { workflows, isLoading, isError } = useWorkflows()
  
  //if (isError) return <div>failed to load workflows</div>
  //if (isLoading) return <div>loading...</div>

  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardWorkflows workflows={workflows} isLoading={isLoading} isError={isError}/>
        </div>
      </div>
    </>
  );
}
  
Workflows.layout = Admin;
