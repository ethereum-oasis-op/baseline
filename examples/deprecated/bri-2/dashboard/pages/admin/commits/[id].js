import { commitMgrUrl } from "../../../components/Forms/FormSettings.js";
import Admin from "layouts/Admin.js";
import CardCommit from "../../../components/Cards/CardCommit.js";

export default function Commit({commitDetails, commitError}) {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <CardCommit 
            commit={commitDetails}
            commitError={commitError}
          />
        </div>
      </div>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps({ params }) {
  const { id } = params;
  // Fetch data from external API
  let commitDetails, commitError = null;
  try {
    const res = await fetch(`${commitMgrUrl}/commits/${id}`)
    commitDetails = await res.json()
  } catch (err) {
    commitError = 'failed';
    commitDetails = null;
  }

  // Pass data to the page via props
  return { props: { commitDetails, commitError } }
}

Commit.layout = Admin;