/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/anchor-is-valid */

import Load from "@/comps/load";
import Nav from "@/comps/nav";
import { getInfo } from "@/functions/loading";
import { sortHigh } from "@/functions/sorting";
import { useUser } from "@auth0/nextjs-auth0/client";

export async function getServerSideProps(ctx : any) {
  let loading_function_return = await getInfo();
  return {
    props: {"res" : loading_function_return}
  }
}

export default function Results(res: any) {
  const load_data = res.res;
  //console.log(load_data);

  let results = [];
  for (let match in load_data.matches.matches) {
      if (load_data.matches.matches[match].status.toUpperCase() == "FINISHED") {
        results.push([load_data.matches.matches[match], load_data.matches.matches[match].utcDate]);
      }
  }
  results = results.sort(sortHigh);

  const { isLoading, user } = useUser();
  let sendparam = JSON.stringify({"user": user});

  if (isLoading) {
    return (
      <>
        <Load />
      </>
    );
  } else {
    return (
      <>
        <Nav params={sendparam} />
        <ul>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 max-w-6xl m-auto">
            <div>
              <p className="m-auto justify-center text-2xl font-semibold text-center">Results</p>
              {results.map((result) => (
                <li key={result[0].id} className="grid grid-cols-3 my-4 max-w-xl m-auto">
                  <img src={result[0].homeTeam.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                  <div>
                    <p className="m-auto justify-center text-center">{result[0].score.fullTime.home} - {result[0].score.fullTime.away}</p>
                    <p className="m-auto justify-center text-center">{new Intl.DateTimeFormat('en-GB').format(new Date(result[1].toString()))}</p>
                  </div>
                  <img src={result[0].awayTeam.crest} alt="Team Emblem" className="m-auto justify-center w-10" />
                </li>
              ))}
            </div>
          </div>
        </ul>
      </>
    );
  }
}
